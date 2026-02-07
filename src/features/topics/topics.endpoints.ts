import { API_PATHS } from '@/api'

export const TOPICS_ENDPOINTS = {
  // 제안된 주제 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/topics)
  PROPOSED: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/topics`,

  // 확정된 주제 조회 (GET /api/gatherings/{gatheringId}/meetings/{meetingId}/confirm-topics)
  CONFIRMED: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/confirm-topics`,

  // 주제 삭제 (DELETE /api/gatherings/{gatheringId}/meetings/{meetingId}/topics/{topicId})
  DELETE: (gatheringId: number, meetingId: number, topicId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/topics/${topicId}`,

  // 주제 좋아요 토글 (POST /api/gatherings/{gatheringId}/meetings/{meetingId}/topics/{topicId}/likes)
  LIKE_TOGGLE: (gatheringId: number, meetingId: number, topicId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/topics/${topicId}/likes`,
} as const
