import { apiClient, ApiError, type ApiResponse, ErrorCode } from '@/api'

import { USER_ENDPOINTS } from './user.endpoints'
import type { User, UserUpdateInput } from './user.types'

export const fetchCurrentUserProfile = async () => {
  const { data } = await apiClient.get<ApiResponse<User>>(USER_ENDPOINTS.ME)
  return data.data
}

export const updateUser = async (input: UserUpdateInput) => {
  const { data } = await apiClient.patch<ApiResponse<User>>(USER_ENDPOINTS.ME, input)
  return data.data
}

export const deleteUser = async () => {
  const { data } = await apiClient.delete<ApiResponse<null>>(USER_ENDPOINTS.ME)
  return data
}

export const completeOnboarding = async (nickname: string, profileImage?: File) => {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify({ nickname })], { type: 'application/json' }))

  if (profileImage) {
    formData.append('profileImage', profileImage)
  }

  const { data } = await apiClient.patch<ApiResponse<User>>(USER_ENDPOINTS.ONBOARDING, formData, {
    headers: {
      'Content-Type': undefined, // FormData 사용 시 axios가 자동으로 multipart/form-data 설정
    },
  })
  return data.data
}

export const checkNickname = async (nickname: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<null>>(USER_ENDPOINTS.CHECK_NICKNAME, {
      params: { nickname },
    })
    return { available: data.code === 'SUCCESS' }
  } catch (error) {
    // U002(NICKNAME_ALREADY_EXISTS)만 중복으로 처리, 그 외 에러는 re-throw
    if (error instanceof ApiError && error.is(ErrorCode.NICKNAME_ALREADY_EXISTS)) {
      return { available: false }
    }
    throw error
  }
}
