import { API_PATHS } from '@/api'

export const PERSONAL_RETROSPECTIVE_ENDPOINTS = {
  // 개인 회고 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/retrospective/personal)
  DETAIL: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/retrospective/personal`,
} as const
