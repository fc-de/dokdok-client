import { apiClient, type ApiResponse } from '@/api'

import { AUTH_ENDPOINTS } from './auth.endpoints'
import type { CurrentUser } from './auth.types'

export const getKakaoLoginUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const feOrigin = import.meta.env.VITE_APP_URL

  if (!apiUrl || !feOrigin) {
    throw new Error('Missing required environment variables: VITE_API_URL or VITE_APP_URL')
  }

  return `${apiUrl}/oauth2/authorization/kakao?fe_origin=${feOrigin}`
}

export const loginWithKakao = () => {
  window.location.href = getKakaoLoginUrl()
}

/**
 * 현재 로그인 사용자 정보 조회 - 인증 상태 및 온보딩 필요 여부 확인용
 */
export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get<ApiResponse<CurrentUser>>(AUTH_ENDPOINTS.ME)
  return data.data
}

export const logout = async () => {
  const { data } = await apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.LOGOUT)
  return data
}
