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
  gatheringName: string
  isFavorite: boolean
  gatheringStatus: GatheringStatus
  totalMembers: number
  totalMeetings: number
  currentUserRole: GatheringUserRole
  daysFromJoined: number
}

/** 모임 목록 조회 요청 파라미터 */
export interface GetGatheringsParams {
  pageSize?: number
  nextCursor?: string | null
}

/** 모임 목록 조회 응답 */
export interface GetGatheringsResponse {
  items: Gathering[]
  pageSize: number
  hasNext: boolean
  nextCursor: string | null
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
  page?: string
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

/** 모임 공동 회고 - 핵심 포인트 */
export interface MeetingKeyPoint {
  title: string
  details: string[]
}

/** 모임 공동 회고 - 토픽 */
export interface MeetingTopic {
  topicId: number
  confirmOrder: number
  topicTitle: string
  topicDescription: string
  summary: string
  keyPoints: MeetingKeyPoint[]
  comments: MeetingComment[]
}

/** 모임 공동 회고 - 소속 모임 정보 */
export interface MeetingGathering {
  gatheringId: number
  gatheringName: string
}

/** 모임 공동 회고 */
export interface MeetingGroupRecord {
  meetingId: number
  meetingName: string
  meetingDate: string
  meetingTime: string
  gathering: MeetingGathering
  topics: MeetingTopic[]
}

/** 모임 개인 회고 - 생각 변화 */
export interface RetrospectiveChangedThought {
  keyIssue: string
  postOpinion: string
}

/** 모임 개인 회고 - 타인 관점 */
export interface RetrospectiveOthersPerspective {
  meetingMemberId: number
  memberNickname: string
  opinionContent: string
  impressiveReason: string
}

/** 모임 개인 회고 - 토픽 그룹 */
export interface RetrospectiveTopicGroup {
  topicId: number
  topicTitle: string
  confirmOrder: number
  changedThoughts: RetrospectiveChangedThought
  othersPerspectives: RetrospectiveOthersPerspective[]
}

/** 모임 개인 회고 - 자유 텍스트 */
export interface RetrospectiveFreeText {
  title: string
  content: string
}

/** 모임 개인 회고 */
export interface MeetingPersonalRecord {
  retrospectiveId: number
  gatheringName: string
  recordType: string
  createdAt: string
  topicGroups: RetrospectiveTopicGroup[]
  freeTexts: RetrospectiveFreeText[]
}

/** 사전의견 토픽 */
export interface PreOpinionTopic {
  confirmOrder: number
  topicTitle: string
  topicDescription: string
  answer: string
}

/** 모임 사전의견 */
export interface MeetingPreOpinion {
  type: 'PRE_OPINION'
  gatheringName: string
  sharedAt: string
  topics: PreOpinionTopic[]
}

// ============================================================
// Book Review History (평가 히스토리) 관련 타입
// ============================================================

/** 책 평가 히스토리 항목 */
export interface BookReviewHistoryItem {
  bookReviewHistoryId: number
  createdAt: string
  rating: number
  bookKeywords: ReviewKeyword[]
  impressionKeywords: ReviewKeyword[]
}

/** 책 평가 히스토리 조회 요청 파라미터 */
export interface GetBookReviewHistoryParams {
  pageSize?: number
  cursorHistoryId?: number
}

/** 책 평가 히스토리 조회 응답 */
export interface GetBookReviewHistoryResponse {
  items: BookReviewHistoryItem[]
  pageSize: number
  hasNext: boolean
  nextCursor: {
    historyId: number | null
  }
}

/** 감상 기록 생성 요청 바디 */
export interface CreateBookRecordBody {
  recordType: RecordType
  recordContent: string
  meta?: {
    page?: string
    excerpt?: string
  }
}

/** 감상 기록 수정 요청 바디 */
export interface UpdateBookRecordBody {
  recordType: RecordType
  recordContent: string
  meta?: {
    page?: string
    excerpt?: string
  }
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
  meetingPreOpinions: MeetingPreOpinion[]
}
