/**
 * @file interceptors.ts
 * @description Axios 요청/응답 인터셉터 설정
 *
 * 이 모듈은 API 클라이언트의 인터셉터를 설정합니다:
 * - Request 인터셉터: 요청 로깅
 * - Response 인터셉터: 응답 로깅, 에러 변환, 401 처리
 * - Retry 인터셉터: 실패한 요청 자동 재시도
 *
 * @important
 * Axios interceptor는 등록 역순(LIFO)으로 실행됩니다.
 * 따라서 인터셉터 등록 순서가 중요합니다:
 * 1. 에러 변환 인터셉터 먼저 등록 → 나중에 실행 (AxiosError → ApiError 변환)
 * 2. Retry 인터셉터 나중에 등록 → 먼저 실행 (AxiosError로 재시도 판단)
 */

import type { AxiosError } from 'axios'

import { apiClient } from './client'
import { ApiError } from './errors'
import { logger } from './logger'
import { setupRetryInterceptor } from './retry'

/**
 * 인터셉터 초기화 여부 플래그
 *
 * @description
 * 인터셉터가 여러 번 등록되는 것을 방지합니다.
 * React의 StrictMode나 HMR(Hot Module Replacement)로 인해
 * 모듈이 여러 번 실행될 수 있기 때문입니다.
 */
let isInitialized = false

/**
 * API 클라이언트 인터셉터 초기화
 *
 * @description
 * apiClient에 요청/응답 인터셉터를 설정합니다.
 * 이 함수는 앱 시작 시 한 번만 호출되어야 합니다.
 *
 * @features
 * - Request 인터셉터: 개발 환경에서 요청 로깅
 * - Response 인터셉터: 응답 로깅, 401 처리, ApiError 변환
 * - Retry 인터셉터: 멱등성 메서드에 대한 자동 재시도
 *
 * @example
 * ```typescript
 * // main.tsx
 * import { setupInterceptors } from '@/api'
 *
 * setupInterceptors()
 *
 * createRoot(document.getElementById('root')!).render(...)
 * ```
 */
export const setupInterceptors = (): void => {
  // 중복 초기화 방지
  if (isInitialized) {
    return
  }

  // ========================================
  // Request 인터셉터
  // ========================================
  // 요청이 서버로 전송되기 전에 실행됩니다.
  // 주로 인증 토큰 추가, 요청 로깅 등에 사용됩니다.
  apiClient.interceptors.request.use(
    (config) => {
      // 개발 환경에서 요청 정보 로깅
      logger.request(config)
      return config
    },
    (error) => {
      // 요청 생성 중 에러 발생 시 로깅
      logger.error(error)
      return Promise.reject(error)
    }
  )

  // ========================================
  // Response 인터셉터 #1: 에러 변환
  // ========================================
  // 먼저 등록되므로 나중에 실행됩니다.
  // Retry 인터셉터가 재시도를 포기한 후 최종적으로 실행됩니다.
  // AxiosError를 ApiError로 변환하여 일관된 에러 처리를 가능하게 합니다.
  apiClient.interceptors.response.use(
    (response) => {
      // 개발 환경에서 응답 정보 로깅
      logger.response(response)
      return response
    },
    (error: AxiosError) => {
      // 에러 로깅
      logger.error(error)

      // 401 Unauthorized: 세션 만료 시 로그인 페이지로 리다이렉트
      // 서버에서 JSESSIONID 쿠키 기반 세션 인증을 사용하므로,
      // 401 응답은 세션이 만료되었거나 유효하지 않음을 의미합니다.
      if (error.response?.status === 401) {
        const isAlreadyOnLogin = window.location.pathname === '/login'
        const requestUrl = error.config?.url ?? ''

        // 인증 상태 확인용 엔드포인트는 리다이렉트하지 않음
        // 이 엔드포인트들은 호출자가 직접 401 응답을 처리함
        const authProbeEndpoints = ['/api/auth/me', '/api/users/me']
        const isAuthProbeRequest = authProbeEndpoints.some(
          (endpoint) => requestUrl === endpoint || requestUrl.endsWith(endpoint)
        )

        const shouldRedirect = !isAlreadyOnLogin && !isAuthProbeRequest

        if (shouldRedirect) {
          // TODO: 로그아웃 알림 토스트 표시
          window.location.href = '/login'
        }
      }

      // 서버 에러 응답에서 code와 message 추출
      const { code, message } = (error.response?.data as { code?: string; message?: string }) ?? {}

      // AxiosError를 ApiError로 변환하여 reject
      // 이를 통해 사용처에서 error.is(ErrorCode.XXX)로 에러 유형 판단 가능
      return Promise.reject(
        new ApiError(code ?? 'UNKNOWN', message ?? error.message, error.response?.status ?? 500)
      )
    }
  )

  // ========================================
  // Response 인터셉터 #2: Retry
  // ========================================
  // 나중에 등록되므로 먼저 실행됩니다.
  // 에러 발생 시 AxiosError 상태에서 재시도 여부를 판단합니다.
  // 멱등성 메서드(GET, HEAD, OPTIONS, PUT)에 대해서만 재시도합니다.
  setupRetryInterceptor(apiClient)

  isInitialized = true
}
