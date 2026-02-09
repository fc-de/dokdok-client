import { API_PATHS } from '@/api'

export const PRE_OPINIONS_ENDPOINTS = {
  // 사전 의견 목록 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/answers)
  ANSWERS: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/answers`,

  // 내 사전 의견 삭제 (DELETE /api/gatherings/{gatheringId}/meetings/{meetingId}/topics/answers/me)
  DELETE_MY_ANSWER: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/topics/answers/me`,
} as const
