import { API_PATHS } from '@/api'

export const PRE_OPINION_ENDPOINTS = {
  // 사전 의견 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/answers/me)
  DETAIL: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/answers/me`,
} as const
