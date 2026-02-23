import { API_PATHS } from '@/api'

export const RETROSPECTIVES_ENDPOINTS = {
  /** STT Job 생성 (POST) */
  STT_JOBS: (gatheringId: number, meetingId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/meetings/${meetingId}/stt/jobs`,

  /** 회고 요약 조회/수정 (GET/PATCH) */
  SUMMARY: (meetingId: number) => `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/summary`,

  /** 회고 요약 발행 (POST) */
  PUBLISH: (meetingId: number) =>
    `${API_PATHS.MEETINGS}/${meetingId}/retrospectives/summary/publish`,
} as const
