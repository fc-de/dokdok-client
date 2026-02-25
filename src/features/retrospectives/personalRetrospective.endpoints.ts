import { API_PATHS } from '@/api'

export const PERSONAL_RETROSPECTIVE_ENDPOINTS = {
  // 개인 회고 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/retrospective/personal)
  DETAIL: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/retrospective/personal`,
  // 개인 회고 저장 (POST /api/meetings/{meetingId}/retrospectives/personal)
  SAVE: (meetingId: number) =>
    `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/personal`,
  // 개인 회고 뷰 조회 (GET /api/meetings/{meetingId}/retrospectives/personal)
  VIEW: (meetingId: number) =>
    `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/personal`,
} as const
