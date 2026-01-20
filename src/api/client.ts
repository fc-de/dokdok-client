/**
 * @file client.ts
 * @description Axios 인스턴스 및 API 래퍼 함수
 *
 * 이 모듈은 API 통신을 위한 핵심 클라이언트를 제공합니다:
 * - apiClient: 기본 Axios 인스턴스 (세션 쿠키 자동 포함)
 * - api: ApiResponse를 자동으로 unwrap하는 래퍼 함수
 */

import axios, { type AxiosRequestConfig } from 'axios'

import type { ApiResponse } from './types'

/**
 * 기본 Axios 인스턴스
 *
 * @description
 * 모든 API 요청에 사용되는 공통 Axios 인스턴스입니다.
 *
 * @config
 * - baseURL: 환경 변수에서 API 서버 URL을 가져옵니다.
 * - withCredentials: true로 설정하여 JSESSIONID 쿠키가 자동으로 포함됩니다.
 * - timeout: 10초 후 요청 타임아웃
 * - Content-Type: JSON 형식으로 요청
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * ApiResponse를 자동으로 unwrap하는 API 래퍼
 *
 * @description
 * 서버 응답의 `data.data`를 자동으로 추출하여 반환합니다.
 * 이를 통해 호출부에서 중복 코드를 줄일 수 있습니다.
 *
 * @benefits
 * - 타입 추론이 더 명확해짐
 * - 매번 response.data.data 접근할 필요 없음
 * - 일관된 API 호출 패턴 제공
 *
 * @example
 * ```typescript
 * return api.get<User>('/api/users/me')
 * ```
 */
export const api = {
  /**
   * GET 요청
   *
   * @param url - 요청 URL (baseURL에 상대적)
   * @param config - Axios 요청 설정 (선택적)
   * @returns 서버 응답의 data 필드
   *
   * @example
   * ```typescript
   * // 단일 리소스 조회
   * const user = await api.get<User>('/api/users/me')
   *
   * // 쿼리 파라미터와 함께 조회
   * const books = await api.get<Book[]>('/api/books', {
   *   params: { page: 1, size: 10 }
   * })
   * ```
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config)
    return response.data.data
  },

  /**
   * POST 요청
   *
   * @param url - 요청 URL (baseURL에 상대적)
   * @param data - 요청 본문 데이터 (선택적)
   * @param config - Axios 요청 설정 (선택적)
   * @returns 서버 응답의 data 필드
   *
   * @example
   * ```typescript
   * // 리소스 생성
   * const newBook = await api.post<Book>('/api/books', {
   *   isbn: '9788966262373'
   * })
   *
   * // 데이터 없이 POST (로그아웃 등)
   * await api.post<void>('/api/auth/logout')
   * ```
   */
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  /**
   * PUT 요청
   *
   * @param url - 요청 URL (baseURL에 상대적)
   * @param data - 요청 본문 데이터 (선택적)
   * @param config - Axios 요청 설정 (선택적)
   * @returns 서버 응답의 data 필드
   *
   * @example
   * ```typescript
   * // 리소스 전체 수정
   * const updatedUser = await api.put<User>('/api/users/me', {
   *   nickname: 'newNickname',
   *   profileImageUrl: 'https://...'
   * })
   * ```
   */
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  /**
   * PATCH 요청
   *
   * @param url - 요청 URL (baseURL에 상대적)
   * @param data - 요청 본문 데이터 (선택적)
   * @param config - Axios 요청 설정 (선택적)
   * @returns 서버 응답의 data 필드
   *
   * @example
   * ```typescript
   * // 리소스 부분 수정
   * const updatedUser = await api.patch<User>('/api/users/me', {
   *   nickname: 'newNickname'
   * })
   * ```
   */
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  /**
   * DELETE 요청
   *
   * @param url - 요청 URL (baseURL에 상대적)
   * @param config - Axios 요청 설정 (선택적)
   * @returns 서버 응답의 data 필드 (보통 void)
   *
   * @example
   * ```typescript
   * // 리소스 삭제 (응답 데이터 없음)
   * await api.delete('/api/books/123')
   *
   * // 응답 데이터가 있는 경우
   * const result = await api.delete<DeleteResult>('/api/gatherings/1/members/2')
   * ```
   */
  delete: async <T = void>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config)
    return response.data.data
  },
}
