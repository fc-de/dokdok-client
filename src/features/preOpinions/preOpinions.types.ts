/**
 * @file preOpinions.types.ts
 * @description 사전 의견 API 관련 타입 정의
 */

import type { KeywordType } from '@/features/keywords/keywords.types'
import type { TopicType } from '@/features/topics/topics.types'

/** 멤버 역할 타입 */
export type MemberRole = 'GATHERING_LEADER' | 'MEETING_LEADER' | 'MEMBER'

/** 사전 의견 키워드 */
export type PreOpinionKeyword = {
  id: number
  name: string
  type: KeywordType
}

/** 책 평가 정보 */
export type BookReviewSummary = {
  rating: number
  keywordInfo: PreOpinionKeyword[]
}

/** 멤버 정보 */
export type PreOpinionMemberInfo = {
  userId: number
  nickname: string
  profileImage: string
  role: MemberRole
}

/** 주제별 의견 */
export type TopicOpinion = {
  topicId: number
  content: string | null
}

/** 확정된 주제 항목 */
export type PreOpinionTopic = {
  topicId: number
  title: string
  description: string
  topicType: TopicType
  topicTypeLabel: string
  confirmOrder: number
}

/** 멤버별 사전 의견 */
export type PreOpinionMember = {
  memberInfo: PreOpinionMemberInfo
  isSubmitted: boolean
  bookReview: BookReviewSummary | null
  topicOpinions: TopicOpinion[]
}

/** 사전 의견 목록 조회 응답 데이터 */
export type PreOpinionAnswersData = {
  topics: PreOpinionTopic[]
  members: PreOpinionMember[]
}

/** 사전 의견 목록 조회 파라미터 */
export type GetPreOpinionAnswersParams = {
  gatheringId: number
  meetingId: number
}

/** 내 사전 의견 삭제 파라미터 */
export type DeleteMyPreOpinionAnswerParams = {
  gatheringId: number
  meetingId: number
}
