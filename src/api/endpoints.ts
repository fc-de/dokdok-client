/**
 * API 엔드포인트 Base Paths
 *
 * @description
 * 각 feature의 endpoints.ts에서 사용하는 공통 경로 상수입니다.
 * 하드코딩을 줄이고 일관성을 유지하기 위해 사용합니다.
 */
export const API_BASE = '/api' as const

export const API_PATHS = {
  AUTH: `${API_BASE}/auth`,
  USERS: `${API_BASE}/users`,
  BOOK: `${API_BASE}/book`,
  GATHERINGS: `${API_BASE}/gatherings`,
  MEETINGS: `${API_BASE}/meetings`,
} as const
