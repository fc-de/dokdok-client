/**
 * @file book.types.ts
 * @description Book 도메인 관련 타입 정의
 */

/** 책 읽기 상태 */
export type BookReadingStatus = 'READING' | 'COMPLETED' | 'PENDING'

/** 책 상세 정보 */
export interface BookDetail {
  bookId: number
  title: string
  publisher: string
  authors: string
  bookReadingStatus: BookReadingStatus
  thumbnail: string
}

/** 리뷰 키워드 종류 */
type ReviewKeywordType = 'BOOK' | 'IMPRESSION'

/** 리뷰 키워드 */
export interface ReviewKeyword {
  id: number
  name: string
  type: ReviewKeywordType
}

/** 책 평가 정보 */
export interface BookReview {
  reviewId: number
  bookId: number
  userId: number
  rating: number
  keywords: ReviewKeyword[]
  createdAt: string
}

// ============================================================
// Gathering (모임) 관련 타입
// ============================================================

/** 모임 상태 */
export type GatheringStatus = 'ACTIVE' | 'INACTIVE'

/** 현재 사용자 역할 */
export type GatheringUserRole = 'LEADER' | 'MEMBER'

/** 모임 정보 */
export interface Gathering {
  gatheringId: number
  name: string
  gatheringStatus: GatheringStatus
  currentUserRole: GatheringUserRole
  joinedAt: string
}

/** 모임 목록 조회 요청 파라미터 */
export interface GetGatheringsParams {
  pageSize?: number
  cursorJoinedAt?: string
  cursorId?: number
}

/** 모임 목록 조회 응답 */
export interface GetGatheringsResponse {
  gatherings: Gathering[]
  nextCursor: {
    cursorJoinedAt: string | null
    cursorId: number | null
  }
  hasNext: boolean
}

// ============================================================
// Book Records (감상 기록) 관련 타입
// ============================================================

/** 기록 유형 */
export type RecordType = 'MEMO' | 'QUOTE'

/** 정렬 방식 */
export type RecordSortType = 'LATEST' | 'OLDEST'

/** 개인 회고 메타 정보 */
export interface PersonalRecordMeta {
  page?: number
  excerpt?: string
}

/** 개인 회고 */
export interface PersonalRecord {
  recordId: number
  recordType: RecordType
  recordContent: string
  meta: PersonalRecordMeta
  bookId: number
  createdAt: string
}

/** 모임 공동 회고 - 댓글 */
export interface MeetingComment {
  meetingRetrospectiveId: number
  userId: number
  nickname: string
  profileImageUrl: string
  comment: string
  createdAt: string
}

/** 모임 공동 회고 - 토픽 */
export interface MeetingTopic {
  topicId: number
  topicName: string
  summarizedOpinions: string[]
  comments: MeetingComment[]
}

/** 모임 공동 회고 */
export interface MeetingGroupRecord {
  meetingId: number
  meetingName: string
  meetingDate: string
  meetingTime: string
  topics: MeetingTopic[]
}

/** 모임 개인 회고 내용 */
export interface MeetingPersonalRetrospective {
  changedThoughts: string[]
  othersPerspectives: string[]
  freeTexts: string[]
}

/** 모임 개인 회고 */
export interface MeetingPersonalRecord {
  retrospectiveId: number
  retrospective: MeetingPersonalRetrospective
}

/** 감상 기록 조회 요청 파라미터 */
export interface GetBookRecordsParams {
  gatheringId?: number
  recordType?: RecordType
  sort?: RecordSortType
}

/** 감상 기록 조회 응답 */
export interface GetBookRecordsResponse {
  personalRecords: PersonalRecord[]
  meetingGroupRecords: MeetingGroupRecord[]
  meetingPersonalRecords: MeetingPersonalRecord[]
}
