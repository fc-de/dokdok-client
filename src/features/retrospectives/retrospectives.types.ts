/**
 * @file retrospectives.types.ts
 * @description Retrospectives API 관련 타입 정의
 */

import type { CursorPaginatedResponse } from '@/api/types'

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
