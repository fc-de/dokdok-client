/**
 * @file topics.types.ts
 * @description Topic API 관련 타입 정의
 */

import type { CursorPaginatedResponse } from '@/api/types'

/**
 * 주제 상태 타입
 */
export type TopicStatus = 'PROPOSED' | 'CONFIRMED'

/**
 * 주제 타입
 */
export type TopicType =
  | 'FREE'
  | 'DISCUSSION'
  | 'EMOTION'
  | 'EXPERIENCE'
  | 'CHARACTER_ANALYSIS'
  | 'COMPARISON'
  | 'STRUCTURE'
  | 'IN_DEPTH'
  | 'CREATIVE'
  | 'CUSTOM'

/**
 * 주제 아이템 타입 (제안된 주제)
 */
export type ProposedTopicItem = {
  /** 주제 ID */
  topicId: number
  /** 약속 ID */
  meetingId: number
  /** 주제 제목 */
  title: string
  /** 주제 설명 (Todo : 없을떄 null인지 빈값인지 체크해야함)*/
  description: string
  /** 주제 타입 */
  topicType: TopicType
  /** 주제 타입 라벨 (한국어) */
  topicTypeLabel: string
  /** 주제 상태 */
  topicStatus: TopicStatus
  /** 좋아요 수 */
  likeCount: number
  /** 좋아요 여부 */
  isLiked: boolean
  /** 삭제 가능 여부 */
  canDelete: boolean
  /** 생성자 정보 */
  createdByInfo: {
    userId: number
    nickname: string
  }
}

/**
 * 확정된 주제 아이템 타입
 */
export type ConfirmedTopicItem = {
  /** 주제 ID */
  topicId: number
  /** 주제 제목 */
  title: string
  /** 주제 설명 (Todo : 없을떄 null인지 빈값인지 체크해야함)*/
  description: string
  /** 주제 타입 */
  topicType: TopicType
  /** 주제 타입 라벨 (한국어) */
  topicTypeLabel: string
  /** 확정 순서 */
  confirmOrder: number
  /** 좋아요 수 */
  likeCount: number
  /** 생성자 정보 */
  createdByInfo: {
    userId: number
    nickname: string
  }
}

/**
 * 커서 타입 (제안된 주제용)
 */
export type ProposedTopicCursor = {
  likeCount: number
  topicId: number
}

/**
 * 커서 타입 (확정된 주제용)
 */
export type ConfirmedTopicCursor = {
  confirmOrder: number
  topicId: number
}

// CursorPaginatedResponse는 @/api/types에서 import하여 사용

/**
 * 제안된 주제 조회 요청 파라미터
 */
export type GetProposedTopicsParams = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 식별자 */
  meetingId: number
  /** 페이지 크기 (기본값: 10) */
  pageSize?: number
  /** 커서: 이전 페이지 마지막 항목의 좋아요 수 */
  cursorLikeCount?: number
  /** 커서: 이전 페이지 마지막 항목의 주제 ID */
  cursorTopicId?: number
}

/**
 * 확정된 주제 조회 요청 파라미터
 */
export type GetConfirmedTopicsParams = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 식별자 */
  meetingId: number
  /** 페이지 크기 (기본값: 10) */
  pageSize?: number
  /** 커서: 이전 페이지 마지막 항목의 확정 순서 */
  cursorConfirmOrder?: number
  /** 커서: 이전 페이지 마지막 항목의 주제 ID */
  cursorTopicId?: number
}

/**
 * 제안된 주제 조회 응답 타입
 */
export type GetProposedTopicsResponse = CursorPaginatedResponse<
  ProposedTopicItem,
  ProposedTopicCursor
> & {
  /** 액션 권한 정보 */
  actions: {
    /** 주제 확정 가능 여부 */
    canConfirm: boolean
    /** 주제 제안 가능 여부 */
    canSuggest: boolean
  }
}

/**
 * 확정된 주제 조회 응답 타입
 */
export type GetConfirmedTopicsResponse = CursorPaginatedResponse<
  ConfirmedTopicItem,
  ConfirmedTopicCursor
> & {
  /** 액션 권한 정의 */
  actions: {
    /** 사전 의견 조회 가능 여부 */
    canViewPreOpinions: boolean
    /** 사전 의견 작성 가능 여부 */
    canWritePreOpinions: boolean
  }
}

/**
 * 주제 삭제 요청 파라미터
 */
export type DeleteTopicParams = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 식별자 */
  meetingId: number
  /** 주제 식별자 */
  topicId: number
}

/**
 * 주제 좋아요 토글 요청 파라미터
 */
export type LikeTopicParams = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 식별자 */
  meetingId: number
  /** 주제 식별자 */
  topicId: number
}

/**
 * 주제 좋아요 토글 응답
 */
export type LikeTopicResponse = {
  /** 주제 식별자 */
  topicId: number
  /** 좋아요 상태 */
  liked: boolean
  /** 새로운 좋아요 수 */
  newCount: number
}

/**
 * 주제 확정 요청 파라미터
 */
export type ConfirmTopicsParams = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 식별자 */
  meetingId: number
  /** 확정할 주제 ID 목록 (순서대로) */
  topicIds: number[]
}

/**
 * 주제 확정 응답
 */
export type ConfirmTopicsResponse = {
  /** 약속 식별자 */
  meetingId: number
  /** 주제 상태 */
  topicStatus: TopicStatus
  /** 확정된 주제 목록 */
  topics: Array<{
    topicId: number
    confirmOrder: number
  }>
}

/**
 * 주제 제안 요청 파라미터
 */
export type CreateTopicParams = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 식별자 */
  meetingId: number
  /** 요청 바디 */
  body: CreateTopicRequest
}

/**
 * 주제 제안 요청 바디
 */
export type CreateTopicRequest = {
  /** 주제 제목 */
  title: string
  /** 주제 설명 (Todo: 없을때 어떻게 보낼지 체크해야 함)*/
  description: string | null
  /** 주제 타입 */
  topicType: TopicType
}

/**
 * 주제 제안 응답
 */
export type CreateTopicResponse = {
  /** 주제 ID */
  topicId: number
  /** 주제 제목 */
  title: string
  /** 주제 설명 (Todo: 없을때 null인지 빈값인지 체크해야 함)*/
  description: string | null
  /** 주제 타입 */
  topicType: TopicType
}
