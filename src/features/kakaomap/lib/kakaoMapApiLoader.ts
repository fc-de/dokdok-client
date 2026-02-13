/**
 * @file kakaoMapApiLoader.ts
 * @description 카카오 Maps SDK 싱글톤 Loader 클래스
 *
 * 상태 흐름:
 *   INITIALIZED → LOADING → SUCCESS
 *                         ↘ FAILURE → retry (지수 백오프)
 *
 * - 동일 appkey/libraries 옵션이면 단일 인스턴스 재사용
 * - 옵션이 달라지면 에러 throw
 * - 이미 window.kakao가 존재하면 즉시 resolve
 * - 실패 시 지수 백오프(exponential backoff) 방식으로 자동 재시도
 */

type LoadState = 'INITIALIZED' | 'LOADING' | 'SUCCESS' | 'FAILURE'

export type KakaoMapLoaderOptions = {
  appkey: string
  libraries?: string[]
  /** 최대 재시도 횟수 (기본값: 3) */
  maxRetries?: number
  /** 초기 재시도 대기 시간 ms (기본값: 500) */
  retryDelay?: number
}

const KAKAO_STATUS_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다. API에 필요한 필수 파라미터를 확인해주세요. (400 Bad Request)',
  401: '인증 오류입니다. 앱키(VITE_KAKAO_MAP_KEY)가 올바른지 확인해주세요. (401 Unauthorized)',
  403: '권한 오류입니다. 앱 등록 및 도메인 설정을 확인해주세요. (403 Forbidden)',
  429: '쿼터를 초과했습니다. 정해진 사용량이나 초당 요청 한도를 초과했습니다. (429 Too Many Request)',
  500: '카카오 서버 내부 오류입니다. 잠시 후 다시 시도해주세요. (500 Internal Server Error)',
  502: '카카오 게이트웨이 오류입니다. 잠시 후 다시 시도해주세요. (502 Bad Gateway)',
  503: '카카오 서비스 점검 중입니다. 잠시 후 다시 시도해주세요. (503 Service Unavailable)',
}

export class Loader {
  private static instance: Loader | null = null

  private state: LoadState = 'INITIALIZED'
  private promise: Promise<void> | null = null

  private readonly appkey: string
  private readonly libraries: string[]
  private readonly maxRetries: number
  private readonly retryDelay: number

  private constructor({
    appkey,
    libraries = [],
    maxRetries = 3,
    retryDelay = 500,
  }: KakaoMapLoaderOptions) {
    this.appkey = appkey
    this.libraries = libraries
    this.maxRetries = maxRetries
    this.retryDelay = retryDelay
  }

  /**
   * 싱글톤 인스턴스 반환
   * - 처음 호출 시 인스턴스 생성
   * - 이후 호출 시 options 없이 기존 인스턴스 반환 가능
   * - options가 달라지면 에러 throw
   */
  static getInstance(options?: KakaoMapLoaderOptions): Loader {
    if (!Loader.instance) {
      if (!options) {
        throw new Error('[KakaoMapLoader] 처음 호출 시 options가 필요합니다.')
      }
      Loader.instance = new Loader(options)
      return Loader.instance
    }

    if (options) {
      const isSameKey = Loader.instance.appkey === options.appkey
      const isSameLibs =
        JSON.stringify(Loader.instance.libraries.sort()) ===
        JSON.stringify((options.libraries ?? []).sort())

      if (!isSameKey || !isSameLibs) {
        throw new Error(
          '[KakaoMapLoader] appkey 또는 libraries 옵션이 기존 인스턴스와 다릅니다. 앱에서 동일한 옵션을 사용해야 합니다.'
        )
      }
    }

    return Loader.instance
  }

  /** 테스트 등에서 인스턴스 초기화 시 사용 */
  static reset(): void {
    Loader.instance = null
  }

  /** SDK 스크립트 URL 생성 */
  private buildScriptUrl(): string {
    const libs = this.libraries.join(',')
    const libsQuery = libs ? `&libraries=${libs}` : ''
    return `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${this.appkey}&autoload=false${libsQuery}`
  }

  /** 지수 백오프 대기 */
  private wait(attempt: number): Promise<void> {
    const delay = this.retryDelay * Math.pow(2, attempt)
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  /** script 태그 삽입 후 로드 시도 (단일 시도) */
  private tryLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.buildScriptUrl()
      const script = document.createElement('script')
      script.src = url
      script.async = true

      script.onload = () => {
        try {
          window.kakao.maps.load(() => resolve())
        } catch {
          reject(new Error('카카오 지도 SDK 초기화에 실패했습니다.'))
        }
      }

      script.onerror = () => {
        // fetch로 실제 HTTP 상태 코드 확인
        fetch(url)
          .then((res) => {
            if (res.ok) {
              reject(
                new Error(
                  '카카오 지도 SDK 로드에 실패했습니다. 일시적인 네트워크 오류일 수 있으니 잠시 후 다시 시도해주세요.'
                )
              )
              return
            }
            const message =
              KAKAO_STATUS_MESSAGES[res.status] ??
              `카카오 지도 SDK 로드에 실패했습니다. (HTTP ${res.status})`
            reject(new Error(message))
          })
          .catch(() => {
            reject(new Error('카카오 지도 SDK를 로드할 수 없습니다. 네트워크 연결을 확인해주세요.'))
          })
      }

      document.head.appendChild(script)
    })
  }

  /**
   * SDK 로드 (지수 백오프 재시도 포함)
   * - 이미 SUCCESS 상태면 즉시 resolve
   * - LOADING 중이면 동일 Promise 반환
   * - INITIALIZED / FAILURE 상태에서 새로 시도
   */
  load(): Promise<void> {
    // 이미 window.kakao가 존재하면 즉시 resolve
    if (window.kakao?.maps) {
      this.state = 'SUCCESS'
      return Promise.resolve()
    }

    if (this.state === 'SUCCESS') {
      return Promise.resolve()
    }

    // LOADING 중이면 동일 Promise 반환
    if (this.state === 'LOADING' && this.promise) {
      return this.promise
    }

    this.state = 'LOADING'

    this.promise = (async () => {
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          await this.tryLoad()
          this.state = 'SUCCESS'
          return
        } catch (err) {
          const isLastAttempt = attempt === this.maxRetries
          const message = err instanceof Error ? err.message : '알 수 없는 오류'
          console.error(
            `[KakaoMapLoader] 로드 실패 (시도 ${attempt + 1}/${this.maxRetries + 1}):`,
            message
          )

          if (isLastAttempt) {
            this.state = 'FAILURE'
            this.promise = null
            throw err
          }

          await this.wait(attempt)
        }
      }
    })()

    return this.promise
  }

  get currentState(): LoadState {
    return this.state
  }
}
