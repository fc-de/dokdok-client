/**
 * @file retrospectives.types.ts
 * @description Retrospectives API 관련 타입 정의
 */

import type { CursorPaginatedResponse } from '@/api/types'

// ─── 수집된 사전 의견 ───

/**
 * 주제별 사전 의견 타입
 */
export type TopicAnswer = {
  /** 주제 ID */
  topicId: number
  /** 주제 제목 */
  title: string
  /** 확정 순서 */
  confirmOrder: number
  /** 답변 ID */
  answerId: number
  /** 답변 내용 */
  content: string
}

/**
 * 수집된 사전 의견 아이템 타입
 */
export type CollectedAnswerItem = {
  /** 사용자 ID */
  userId: number
  /** 닉네임 */
  nickname: string
  /** 프로필 이미지 URL */
  profileImageUrl: string
  /** 주제별 답변 목록 */
  topics: TopicAnswer[]
}

/**
 * 커서 타입 (수집된 사전 의견용)
 */
export type CollectedAnswerCursor = {
  userId: number
}

/**
 * 수집된 사전 의견 조회 요청 파라미터
 */
export type GetCollectedAnswersParams = {
  /** 약속 식별자 */
  meetingId: number
  /** 페이지 크기 (기본값: 10) */
  pageSize?: number
  /** 커서: 이전 페이지 마지막 항목의 사용자 ID */
  cursorUserId?: number
}

/**
 * 수집된 사전 의견 조회 응답 타입
 */
export type GetCollectedAnswersResponse = CursorPaginatedResponse<
  CollectedAnswerItem,
  CollectedAnswerCursor
>

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

/** 주요 포인트 수정 요청 (KeyPoint와 동일 형태) */
export type KeyPointUpdateRequest = KeyPoint

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
