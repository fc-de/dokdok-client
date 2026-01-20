/**
 * @file retry.ts
 * @description API 요청 재시도 로직
 *
 * 네트워크 오류 또는 서버 오류(500, 502, 503, 504) 발생 시 자동으로 재시도합니다.
 * 지수 백오프(exponential backoff) 전략을 사용하여 서버 부하를 줄입니다.
 *
 * @features
 * - 최대 재시도 횟수: 2회
 * - 지수 백오프: 1초 → 2초
 * - 재시도 가능 상태 코드: 500, 502, 503, 504
 * - 멱등성 메서드만 재시도: GET, HEAD, OPTIONS, PUT
 */

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

/**
 * 재시도 설정 타입
 */
type RetryConfig = {
  /** 최대 재시도 횟수 */
  maxRetries: number
  /** 기본 지연 시간 (밀리초) */
  baseDelay: number
  /** 재시도 가능한 HTTP 상태 코드 목록 */
  retryableStatuses: number[]
}

/**
 * 재시도 횟수를 추적하기 위한 확장된 요청 설정 타입
 */
type ExtendedAxiosRequestConfig = InternalAxiosRequestConfig & {
  /** 현재까지의 재시도 횟수 */
  retryCount?: number
}

/**
 * 기본 재시도 설정
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  baseDelay: 1000,
  retryableStatuses: [500, 502, 503, 504],
}

/**
 * 멱등성이 보장되는 HTTP 메서드 목록
 *
 * @description
 * 멱등성(idempotent)이란 같은 요청을 여러 번 보내도 결과가 동일한 특성입니다.
 * - GET, HEAD, OPTIONS: 읽기 전용 요청
 * - PUT: 동일한 리소스로 덮어쓰므로 멱등성 보장
 * - POST, DELETE, PATCH: 멱등성이 보장되지 않아 재시도 시 중복 생성/삭제 위험
 */
const IDEMPOTENT_METHODS = ['GET', 'HEAD', 'OPTIONS', 'PUT'] as const

/**
 * 지정된 시간만큼 대기하는 Promise 반환
 *
 * @param ms - 대기 시간 (밀리초)
 * @returns 대기 완료 후 resolve되는 Promise
 */
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 지수 백오프 지연 시간 계산
 *
 * @description
 * 재시도 횟수가 증가할수록 대기 시간이 기하급수적으로 증가합니다.
 * 이는 서버가 복구될 시간을 주고, 동시 요청으로 인한 추가 부하를 방지합니다.
 *
 * @example
 * - retryCount 0: 1000ms * 2^0 = 1000ms (1초)
 * - retryCount 1: 1000ms * 2^1 = 2000ms (2초)
 * - retryCount 2: 1000ms * 2^2 = 4000ms (4초)
 *
 * @param retryCount - 현재 재시도 횟수
 * @param baseDelay - 기본 지연 시간 (밀리초)
 * @returns 계산된 지연 시간 (밀리초)
 */
const getExponentialDelay = (retryCount: number, baseDelay: number): number => {
  return baseDelay * Math.pow(2, retryCount)
}

/**
 * 요청 재시도 여부 판단
 *
 * @description
 * 다음 조건을 모두 만족해야 재시도합니다:
 * 1. 멱등성이 보장되는 HTTP 메서드 (GET, HEAD, OPTIONS, PUT)
 * 2. 네트워크 에러이거나, 재시도 가능한 HTTP 상태 코드
 *
 * @param error - Axios 에러 객체
 * @param config - 재시도 설정
 * @returns 재시도 가능 여부
 */
const shouldRetry = (error: AxiosError, config: RetryConfig): boolean => {
  const method = error.config?.method?.toUpperCase()

  // 멱등성이 보장되지 않는 메서드는 재시도하지 않음
  // POST, DELETE, PATCH 요청을 재시도하면 중복 생성/삭제 위험
  if (!method || !IDEMPOTENT_METHODS.includes(method as (typeof IDEMPOTENT_METHODS)[number])) {
    return false
  }

  // 네트워크 에러(response 없음)는 멱등성 메서드에 한해 재시도
  if (!error.response) {
    return true
  }

  // 재시도 가능한 HTTP 상태 코드인지 확인
  return config.retryableStatuses.includes(error.response.status)
}

/**
 * Axios 인스턴스에 재시도 인터셉터 설정
 *
 * @description
 * Response interceptor를 추가하여 실패한 요청을 자동으로 재시도합니다.
 * 이 함수는 다른 response interceptor보다 나중에 등록되어야 먼저 실행됩니다.
 * (Axios interceptor는 LIFO 순서로 실행)
 *
 * @param axiosInstance - 재시도 기능을 추가할 Axios 인스턴스
 * @param config - 재시도 설정 (선택적, 기본값 사용 가능)
 *
 * @example
 * ```typescript
 * import { apiClient } from './client'
 * import { setupRetryInterceptor } from './retry'
 *
 * // 기본 설정으로 사용
 * setupRetryInterceptor(apiClient)
 *
 * // 커스텀 설정으로 사용
 * setupRetryInterceptor(apiClient, {
 *   maxRetries: 3,
 *   baseDelay: 2000,
 *   retryableStatuses: [500, 503],
 * })
 * ```
 */
export const setupRetryInterceptor = (
  axiosInstance: AxiosInstance,
  config: Partial<RetryConfig> = {},
): void => {
  const retryConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }

  axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined

    // 원본 요청 설정이 없으면 재시도 불가
    if (!originalRequest) {
      return Promise.reject(error)
    }

    const retryCount = originalRequest.retryCount ?? 0

    // 최대 재시도 횟수 초과 또는 재시도 불가능한 요청이면 에러 반환
    if (retryCount >= retryConfig.maxRetries || !shouldRetry(error, retryConfig)) {
      return Promise.reject(error)
    }

    // 재시도 횟수 증가
    originalRequest.retryCount = retryCount + 1

    // 지수 백오프 지연
    const delayMs = getExponentialDelay(retryCount, retryConfig.baseDelay)
    await delay(delayMs)

    // 원본 요청 재실행
    return axiosInstance(originalRequest)
  })
}
