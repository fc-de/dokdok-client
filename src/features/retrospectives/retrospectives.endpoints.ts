import { API_PATHS } from '@/api'

export const RETROSPECTIVES_ENDPOINTS = {
  // 수집된 사전 의견 조회 (GET /api/meetings/{meetingId}/retrospectives/collected-answers)
  COLLECTED_ANSWERS: (meetingId: number) =>
    `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/collected-answers`,
} as const
