/**
 * @file loadKakaoSdk.ts
 * @description 카카오 Maps SDK 싱글톤 로더
 *
 * - 앱 전체에서 SDK를 한 번만 로드 (중복 script 삽입 방지)
 * - 지도를 실제로 사용할 때만 로드 (불필요한 토큰/쿼터 소모 방지)
 * - autoload=false + maps.load() 콜백으로 초기화 완료 시점 보장
 */

let kakaoSdkPromise: Promise<void> | null = null

export function loadKakaoSdk(): Promise<void> {
  // 이미 초기화 완료된 경우
  if (window.kakao?.maps) {
    return Promise.resolve()
  }

  // 이미 로드 중인 경우 동일 Promise 반환 (중복 요청 방지)
  if (kakaoSdkPromise) {
    return kakaoSdkPromise
  }

  kakaoSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false&libraries=services`
    script.async = true

    script.onload = () => {
      window.kakao.maps.load(() => resolve())
    }

    script.onerror = (_scriptEvent) => {
      // 실패 시 Promise 초기화하여 재시도 가능하게
      kakaoSdkPromise = null

      // fetch로 실제 HTTP 상태 코드 확인 후 카카오 공식 상태 메시지 사용
      fetch(script.src)
        .then((res) => {
          const kakaoStatusMessages: Record<number, string> = {
            400: '잘못된 요청입니다. API에 필요한 필수 파라미터를 확인해주세요. (400 Bad Request)',
            401: '인증 오류입니다. 앱키(VITE_KAKAO_MAP_KEY)가 올바른지 확인해주세요. (401 Unauthorized)',
            403: '권한 오류입니다. 앱 등록 및 도메인 설정을 확인해주세요. (403 Forbidden)',
            429: '쿼터를 초과했습니다. 정해진 사용량이나 초당 요청 한도를 초과했습니다. (429 Too Many Request)',
            500: '카카오 서버 내부 오류입니다. 잠시 후 다시 시도해주세요. (500 Internal Server Error)',
            502: '카카오 게이트웨이 오류입니다. 잠시 후 다시 시도해주세요. (502 Bad Gateway)',
            503: '카카오 서비스 점검 중입니다. 잠시 후 다시 시도해주세요. (503 Service Unavailable)',
          }
          const message =
            kakaoStatusMessages[res.status] ??
            `카카오 지도 SDK 로드에 실패했습니다. (HTTP ${res.status})`
          const error = new Error(message)
          console.error('[카카오 지도] SDK 로드 실패:', message)
          reject(error)
        })
        .catch(() => {
          const message = '카카오 지도 SDK를 로드할 수 없습니다. 네트워크 연결을 확인해주세요.'
          console.error('[카카오 지도] SDK 로드 실패 (네트워크 오류):', message)
          reject(new Error(message))
        })
    }

    document.head.appendChild(script)
  })

  return kakaoSdkPromise
}
