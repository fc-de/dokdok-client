import type { CursorPaginatedResponse } from '@/api'

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
