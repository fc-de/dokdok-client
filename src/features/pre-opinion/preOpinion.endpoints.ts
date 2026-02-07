import { API_PATHS } from '@/api'

export const PRE_OPINION_ENDPOINTS = {
  // TODO: 백엔드 사전의견 조회 API 응답 구조 확정 후 반영 예정
  // 사전 의견 조회 (GET /api/meetings/{meetingId}/pre-opinions/me)
  DETAIL: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/pre-opinions/me`,
} as const
