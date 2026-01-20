/**
 * @file logger.ts
 * @description 개발 환경용 API 로깅 유틸리티
 *
 * 개발 환경에서만 API 요청/응답을 콘솔에 로깅합니다.
 * 프로덕션 환경에서는 아무 동작도 하지 않습니다.
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/** 개발 환경 여부 */
const isDev = import.meta.env.DEV

/**
 * API 로거 객체
 *
 * @description
 * 개발 환경에서 API 요청/응답/에러를 콘솔에 로깅합니다.
 * 디버깅 시 네트워크 탭 대신 콘솔에서 빠르게 확인할 수 있습니다.
 */
export const logger = {
  /**
   * API 요청 로깅
   * @param config - Axios 요청 설정
   */
  request: (config: AxiosRequestConfig) => {
    if (isDev) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      })
    }
  },

  /**
   * API 응답 로깅
   * @param response - Axios 응답 객체
   */
  response: (response: AxiosResponse) => {
    if (isDev) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
  },

  /**
   * API 에러 로깅
   * @param error - 에러 객체
   */
  error: (error: unknown) => {
    if (isDev) {
      console.error('❌ API Error:', error)
    }
  },
}
