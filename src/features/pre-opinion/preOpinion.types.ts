/**
 * @file preOpinion.types.ts
 * @description 사전 의견 API 관련 타입 정의
 */

/**
 * 주제 유형
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
 * 사전 의견 조회 응답 타입
 */
export type GetPreOpinionResponse = {
  /** 책 정보 */
  book: PreOpinionBook
  /** 사전 의견 데이터 */
  preOpinion: PreOpinionData
}
