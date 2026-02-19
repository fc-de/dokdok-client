/**
 * @file preOpinion.types.ts
 * @description 사전 의견 API 관련 타입 정의
 */

import type { ReviewKeyword } from '@/features/book/book.types'

import type { TopicType } from '../topics'

/**
 * 사전 의견 주제 항목
 */
export type PreOpinionTopic = {
  /** 주제 ID */
  topicId: number
  /** 주제 이름 */
  topicTitle: string
  /** 주제 설명 */
  topicDescription: string
  /** 주제 유형 */
  topicType: TopicType
  /** 주제 유형 라벨 */
  topicTypeLabel: string
  /** 확정 순서 */
  confirmOrder: number
  /** 작성한 내용 (미작성 시 null) */
  content: string | null
}

/**
 * 사전 의견 응답 내 책 정보
 */
export type PreOpinionBook = {
  /** 책 ID */
  bookId: number
  /** 책 제목 */
  title: string
  /** 저자 */
  author: string
}

/**
 * 사전 의견 데이터
 */
export type PreOpinionData = {
  /** 마지막 수정 일시 */
  updatedAt: string | null
  /** 주제 목록 */
  topics: PreOpinionTopic[]
}

/**
 * 사전 의견 응답 내 리뷰(평가) 정보
 */
export type PreOpinionReview = {
  /** 리뷰 ID */
  reviewId: number
  /** 책 ID */
  bookId: number
  /** 사용자 ID */
  userId: number
  /** 평점 */
  rating: number
  /** 키워드 목록 */
  keywords: ReviewKeyword[]
}

/**
 * 사전 의견 조회 요청 파라미터
 */
export type GetPreOpinionParams = {
  /** 모임 ID */
  gatheringId: number
  /** 약속 ID */
  meetingId: number
}

/**
 * 사전 의견 조회 응답 타입
 */
export type GetPreOpinionResponse = {
  /** 책 정보 */
  book: PreOpinionBook
  /** 리뷰(평가) 정보 (평가 전적이 없으면 null) */
  review: PreOpinionReview | null
  /** 사전 의견 데이터 */
  preOpinion: PreOpinionData
}

/**
 * 사전 의견 저장 요청 바디
 */
export type SavePreOpinionBody = {
  /** 리뷰(평가) 정보 */
  review: {
    rating: number
    keywordIds: number[]
  }
  /** 주제별 답변 목록 */
  answers: {
    topicId: number
    content: string | null
  }[]
}

/**
 * 사전 의견 저장 요청 파라미터
 */
export type SavePreOpinionParams = {
  /** 모임 ID */
  gatheringId: number
  /** 약속 ID */
  meetingId: number
  /** 최초 저장 여부 (updatedAt이 null이면 true) */
  isFirstSave: boolean
}

/**
 * 사전 의견 공유(제출) 요청 바디
 */
export type SubmitPreOpinionBody = {
  /** 리뷰(평가) 정보 */
  review: {
    rating: number
    keywordIds: number[]
  }
  /** 제출할 주제 ID 목록 */
  topicIds: number[]
}
