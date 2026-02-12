import type { CursorPaginatedResponse, PaginatedResponse } from '@/api'
import type { MeetingStatus } from '@/features/meetings'

/** 모임 기본 정보 (공통) */
export interface GatheringBase {
  /** 모임 이름 */
  gatheringName: string
  /** 모임 설명 */
  gatheringDescription?: string
  /** 전체 멤버 수 */
  totalMembers: number
  /** 모임 생성 후 경과 일수 */
  daysFromCreation: number
  /** 전체 약속 수 */
  totalMeetings: number
  /** 초대 링크 (초대 코드) */
  invitationLink: string
}

/** 모임 생성 요청 */
export interface CreateGatheringRequest {
  /** 모임 이름 (최대 12자) */
  gatheringName: string
  /** 모임 설명 (최대 150자) */
  gatheringDescription?: string
}

/** 모임 생성 응답 */
export interface CreateGatheringResponse extends GatheringBase {
  /** 모임 ID */
  gatheringId: number
}

/** 초대 코드로 모임 정보 조회 응답 */
export type GatheringByInviteCodeResponse = GatheringBase

/** 모임 가입 상태 */
export type GatheringMemberStatus = 'PENDING' | 'ACTIVE' | 'REJECTED'

/** 모임 가입 응답 */
export interface GatheringJoinResponse {
  /** 모임 ID */
  gatheringId: number
  /** 모임 이름 */
  gatheringName: string
  /** 가입 상태 */
  memberStatus: GatheringMemberStatus
}

/** 모임 상태 */
export type GatheringStatus = 'ACTIVE' | 'INACTIVE'

/** 모임 내 사용자 역할 */
export type GatheringUserRole = 'LEADER' | 'MEMBER'

/** 모임 목록 아이템 */
export interface GatheringListItem {
  /** 모임 ID */
  gatheringId: number
  /** 모임 이름 */
  gatheringName: string
  /** 즐겨찾기 여부 */
  isFavorite: boolean
  /** 모임 상태 */
  gatheringStatus: GatheringStatus
  /** 전체 멤버 수 */
  totalMembers: number
  /** 전체 약속 수 */
  totalMeetings: number
  /** 현재 사용자 역할 */
  currentUserRole: GatheringUserRole
  /** 가입 후 경과 일수 */
  daysFromJoined: number
}

/** 커서 정보 (서버 응답) */
export interface GatheringCursor {
  joinedAt: string
  gatheringMemberId: number
}

/** 모임 목록 응답 (커서 기반 페이지네이션) */
export type GatheringListResponse = CursorPaginatedResponse<GatheringListItem, GatheringCursor>

/** 즐겨찾기 모임 목록 응답 */
export interface FavoriteGatheringListResponse {
  /** 즐겨찾기 모임 목록 */
  gatherings: GatheringListItem[]
}

/** 모임 목록 조회 파라미터 */
export interface GetGatheringsParams {
  /** 페이지 크기 (기본: 9) */
  pageSize?: number
  /** 커서 - 마지막 항목의 가입일시 (ISO 8601) */
  cursorJoinedAt?: string
  /** 커서 - 마지막 항목의 ID */
  cursorId?: number
}

// ========== 모임 상세 조회 ==========

/** 모임 멤버 정보 */
export interface GatheringMember {
  /** 모임 멤버 ID */
  gatheringMemberId: number
  /** 사용자 ID */
  userId: number
  /** 닉네임 */
  nickname: string
  /** 프로필 이미지 URL */
  profileImageUrl: string | null
  /** 역할 */
  role: GatheringUserRole
  /** 멤버 상태 (멤버 목록 API에서만 제공) */
  memberStatus?: GatheringMemberStatus
  /** 가입일 (ISO 8601, 멤버 목록 API에서만 제공, PENDING이면 null) */
  joinedAt?: string | null
}

/** 모임 상세 응답 */
export interface GatheringDetailResponse {
  /** 모임 ID */
  gatheringId: number
  /** 모임 이름 */
  gatheringName: string
  /** 모임 설명 */
  description: string | null
  /** 모임 상태 */
  gatheringStatus: GatheringStatus
  /** 즐겨찾기 여부 */
  isFavorite: boolean
  /** 초대 링크 (초대 코드) */
  invitationLink: string
  /** 모임 생성 후 경과 일수 */
  daysFromCreation: number
  /** 현재 사용자 역할 */
  currentUserRole: GatheringUserRole
  /** 멤버 목록 */
  members: GatheringMember[]
  /** 전체 멤버 수 */
  totalMembers: number
  /** 전체 약속 수 */
  totalMeetings: number
}

// ========== 모임 약속 목록 ==========

/** 약속 필터 타입 */
export type MeetingFilter = 'ALL' | 'UPCOMING' | 'DONE' | 'JOINED'

/** 모임 약속 아이템 */
export interface GatheringMeetingItem {
  /** 약속 ID */
  meetingId: number
  /** 약속 이름 */
  meetingName: string
  /** 약속장 이름 */
  meetingLeaderName: string
  /** 책 이름 */
  bookName: string
  /** 시작 일시 (ISO 8601) */
  startDateTime: string
  /** 종료 일시 (ISO 8601) */
  endDateTime: string
  /** 약속 상태 */
  meetingStatus: MeetingStatus
}

/** 모임 약속 목록 응답 (페이지 기반) */
export type GatheringMeetingListResponse = PaginatedResponse<GatheringMeetingItem>

/** 모임 약속 목록 조회 파라미터 */
export interface GetGatheringMeetingsParams {
  /** 모임 ID */
  gatheringId: number
  /** 필터 */
  filter?: MeetingFilter
  /** 페이지 번호 (0부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
}

/** 약속 탭별 카운트 응답 */
export interface MeetingTabCountsResponse {
  /** 전체 확정된 약속 수 */
  all: number
  /** 다가오는 약속 수 (3일 이내) */
  upcoming: number
  /** 완료된 약속 수 */
  done: number
  /** 내가 참여한 완료 약속 수 */
  joined: number
}

// ========== 모임 책장 ==========

/** 모임 책장 아이템 */
export interface GatheringBookItem {
  /** 책 ID */
  bookId: number
  /** 책 이름 */
  bookName: string
  /** 저자 */
  author: string
  /** 책 표지 URL */
  thumbnail: string | null
  /** 평균 평점 (없으면 null) */
  ratingAverage: number | null
}

/** 모임 책장 응답 (페이지 기반) */
export type GatheringBookListResponse = PaginatedResponse<GatheringBookItem>

/** 모임 책장 조회 파라미터 */
export interface GetGatheringBooksParams {
  /** 모임 ID */
  gatheringId: number
  /** 페이지 번호 (0부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
}

// ========== 모임 설정 (수정/삭제/멤버 관리) ==========

/** 모임 수정 요청 */
export interface GatheringUpdateRequest {
  /** 모임 이름 (필수, 최대 12자, 공백만 불가) */
  gatheringName: string
  /** 모임 설명 (선택, 최대 150자) */
  description?: string
}

/** 모임 수정 응답 */
export interface GatheringUpdateResponse {
  /** 모임 ID */
  gatheringId: number
  /** 모임 이름 */
  gatheringName: string
  /** 모임 설명 */
  description: string | null
  /** 수정 일시 (ISO 8601) */
  updatedAt: string
}

// ========== 모임 멤버 목록 조회 ==========

/** 멤버 목록 필터 상태 (GatheringMemberStatus에서 파생) */
export type MemberStatusFilter = Extract<GatheringMemberStatus, 'PENDING' | 'ACTIVE'>

/** 멤버 목록 커서 */
export interface GatheringMemberListCursor {
  gatheringMemberId: number
}

/** 멤버 목록 응답 (커서 기반 페이지네이션) */
export type GatheringMemberListResponse = CursorPaginatedResponse<
  GatheringMember,
  GatheringMemberListCursor
>

/** 멤버 목록 조회 파라미터 */
export interface GetGatheringMembersParams {
  /** 모임 ID */
  gatheringId: number
  /** 멤버 상태 필터 */
  status: MemberStatusFilter
  /** 페이지 크기 (기본: 10) */
  pageSize?: number
  /** 커서 - 마지막 항목의 모임 멤버 ID */
  cursorId?: number
}

/** 가입 요청 승인/거절 타입 (GatheringMemberStatus에서 파생) */
export type ApproveType = Extract<GatheringMemberStatus, 'ACTIVE' | 'REJECTED'>
