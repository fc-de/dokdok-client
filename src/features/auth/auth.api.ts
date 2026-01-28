import { apiClient, type ApiResponse } from '@/api'

import { AUTH_ENDPOINTS } from './auth.endpoints'

export type CurrentUser = {
  userId: number
  nickname: string
  profileImageUrl: string | null
  needsOnboarding: boolean
}

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

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get<ApiResponse<CurrentUser>>(AUTH_ENDPOINTS.ME)
  return data.data
}

export const logout = async () => {
  const { data } = await apiClient.post<ApiResponse<null>>(AUTH_ENDPOINTS.LOGOUT)
  return data
}
