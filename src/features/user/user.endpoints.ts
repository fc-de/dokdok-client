import { API_PATHS } from '@/api'

export const USER_ENDPOINTS = {
  ME: `${API_PATHS.USERS}/me`,
  PROFILE_IMAGE: `${API_PATHS.USERS}/me/profile-image`,
  ONBOARDING: `${API_PATHS.USERS}/onboarding`,
  CHECK_NICKNAME: `${API_PATHS.USERS}/check-nickname`,
} as const
