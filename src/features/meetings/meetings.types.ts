/**
 * @file types.ts
 * @description Meeting API 관련 타입 정의
 */

/**
 * 약속 상태 타입
 */
export type MeetingStatus = 'PENDING' | 'CONFIRMED'

/**
 * 약속 승인 아이템 타입
 */
export type MeetingApprovalItem = {
  /** 약속 ID */
  meetingId: number
  /** 약속 이름 */
  meetingName: string
  /** 책 이름 */
  bookName: string
  /** 약속 신청자 닉네임 */
  nickname: string
  /** 시작 일시 (ISO 8601 형식) */
  startDateTime: string
  /** 종료 일시 (ISO 8601 형식) */
  endDateTime: string
  /** 약속 상태 */
  meetingStatus: MeetingStatus
}

/**
 * 약속 승인 리스트 조회 요청 파라미터
 */
export type GetMeetingApprovalsParams = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 상태 */
  status: MeetingStatus
  /** 페이지 번호 (0부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 */
  sort?: string[]
}

/**
 * 약속 거부 응답 타입
 */
export type RejectMeetingResponse = {
  /** 약속 ID */
  meetingId: number
  /** 약속 상태 */
  meetingStatus: 'REJECTED'
  /** 확정 시각 */
  confirmedAt: null
}

/**
 * 약속 승인 응답 타입
 */
export type ConfirmMeetingResponse = {
  /** 약속 ID */
  meetingId: number
  /** 약속 상태 */
  meetingStatus: 'CONFIRMED'
  /** 확정 시각 (ISO 8601 형식) */
  confirmedAt: string
}

type MeetingLocation = {
  name: string
  address: string
  latitude: number
  longitude: number
}

/**
 * 약속 상세 응답 타입
 */
export type MeetingDetailActionStateType =
  | 'CAN_EDIT'
  | 'EDIT_TIME_EXPIRED'
  | 'CAN_JOIN'
  | 'CAN_CANCEL'
  | 'RECRUITMENT_CLOSED'
  | 'DONE'
  | 'REJECTED'

export type MeetingSchedule = {
  startDateTime: string
  endDateTime: string
  displayDate: string
}

export type GetMeetingDetailResponse = {
  /** 약속 ID */
  meetingId: number
  /** 약속 이름 */
  meetingName: string
  /** 약속 상태 */
  meetingStatus: MeetingStatus
  /** 모임 정보 */
  gathering: {
    gatheringId: number
    gatheringName: string
  }
  /** 책 정보 */
  book: {
    bookId: number
    bookName: string
    thumbnail: string
  }
  /** 일정 정보 */
  schedule: MeetingSchedule
  /** 장소 */
  location: MeetingLocation | null
  /** 참가자 정보 */
  participants: {
    currentCount: number
    maxCount: number
    members: Array<{
      userId: number
      nickname: string
      profileImageUrl: string
      role: 'LEADER' | 'MEMBER' | 'HOST'
    }>
  }
  /** 버튼 상태 */
  actionState: {
    type: MeetingDetailActionStateType
    buttonLabel: string
    enabled: boolean
  }
}
