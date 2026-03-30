import { API_PATHS } from '@/api'

export const AUTH_ENDPOINTS = {
  ME: `${API_PATHS.AUTH}/me`,
  LOGOUT: `${API_PATHS.AUTH}/logout`,
  INTERNAL_LOGIN: `${API_PATHS.AUTH}/login`,
} as const
