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
