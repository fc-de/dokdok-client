/**
 * @file retrospectives.types.ts
 * @description 약속 회고 AI 요약 관련 타입 정의
 */

// ─── STT Job ───

/** STT Job 상태 */
export type SttJobStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED'

/** STT Job 생성 요청 파라미터 */
export type CreateSttJobParams = {
  gatheringId: number
  meetingId: number
  file?: File
}

/** STT Job 응답 */
export interface SttJobResponse {
  jobId: number
  meetingId: number
  userId: number
  status: SttJobStatus
  summary: string | null
  highlights: string[] | null
  errorMessage: string | null
  createdAt: string
}

// ─── Retrospective Summary ───

/** 주요 포인트 항목 */
export interface KeyPoint {
  title: string
  details: string[]
}

/** 토픽별 요약 */
export interface SummaryTopic {
  topicId: number
  confirmOrder: number
  topicTitle: string
  topicDescription: string
  summary: string
  keyPoints: KeyPoint[]
}

/** 회고 요약 응답 (GET, PATCH, POST publish 공통) */
export interface RetrospectiveSummaryResponse {
  meetingId: number
  isPublished: boolean
  publishedAt: string | null
  topics: SummaryTopic[]
}

// ─── Request Types ───

/** 주요 포인트 수정 요청 */
export type KeyPointUpdateRequest = {
  title: string
  details: string[]
}

/** 토픽 요약 수정 요청 */
export type UpdateSummaryTopicRequest = {
  topicId: number
  summary: string
  keyPoints: KeyPointUpdateRequest[]
}

/** 회고 요약 수정 요청 바디 */
export type UpdateSummaryRequest = {
  topics: UpdateSummaryTopicRequest[]
}

// ─── Hook Params ───

/** 요약 수정 훅 파라미터 */
export type UpdateSummaryParams = {
  meetingId: number
  data: UpdateSummaryRequest
}

/** 요약 발행 훅 파라미터 */
export type PublishSummaryParams = {
  meetingId: number
}
