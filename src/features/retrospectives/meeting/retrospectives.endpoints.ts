import { API_PATHS } from '@/api'

export const RETROSPECTIVES_ENDPOINTS = {
  /** 수집된 사전 의견 조회 (GET) */
  COLLECTED_ANSWERS: (meetingId: number) =>
    `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/collected-answers`,

  /** STT Job 생성 (POST) */
  STT_JOBS: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/stt/jobs`,

  /** 회고 요약 조회/수정 (GET/PATCH) */
  SUMMARY: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/summary`,

  /** 회고 요약 발행 (POST) */
  PUBLISH: (meetingId: number) =>
    `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/summary/publish`,

  /** 약속회고 상세 조회 (GET) */
  DETAIL: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/retrospectives`,

  /** 댓글 조회/작성 (GET/POST) */
  COMMENTS: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/comments`,

  /** 댓글 삭제 (DELETE) */
  COMMENT_DELETE: (meetingId: number, commentId: number) =>
    `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/${commentId}`,
} as const
