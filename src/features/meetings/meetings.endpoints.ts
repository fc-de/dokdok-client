import { API_PATHS } from '@/api'

export const MEETINGS_ENDPOINTS = {
  // 약속 승인 리스트 조회 (GET /api/gatherings/{gatheringId}/meetings/approvals)
  APPROVALS: (gatheringId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/approvals`,

  // 약속 상세 조회 (GET /api/meetings/{meetingId})
  DETAIL: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}`,

  // 약속 거부 (POST /api/meetings/{meetingId}/reject)
  REJECT: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/reject`,

  // 약속 승인 (POST /api/meetings/{meetingId}/confirm)
  CONFIRM: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/confirm`,

  // 약속 삭제 (DELETE /api/meetings/{meetingId})
  DELETE: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}`,

  // 약속 참가신청 (POST /api/meetings/{meetingId}/join)
  JOIN: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/join`,

  // 약속 참가취소 (DELETE /api/meetings/{meetingId}/join)
  CANCEL_JOIN: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/join`,
} as const
