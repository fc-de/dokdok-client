import { API_PATHS } from '@/api'

export const PRE_OPINION_ENDPOINTS = {
  // 사전 의견 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/answers/me)
  DETAIL: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/answers/me`,
  // 사전 의견 최초 저장 (POST /api/gatherings/{gatheringId}/meetings/{meetingId}/answers)
  CREATE: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/answers`,
  // 사전 의견 수정 (PATCH /api/gatherings/{gatheringId}/meetings/{meetingId}/answers/me)
  UPDATE: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/answers/me`,
  // 사전 의견 공유(제출) (PATCH /api/gatherings/{gatheringId}/meetings/{meetingId}/answers/submit)
  SUBMIT: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/answers/submit`,
} as const
