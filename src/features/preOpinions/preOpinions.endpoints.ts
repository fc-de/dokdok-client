import { API_PATHS } from '@/api'

export const PRE_OPINIONS_ENDPOINTS = {
  // 사전 의견 목록 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/answers)
  ANSWERS: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/answers`,
} as const
