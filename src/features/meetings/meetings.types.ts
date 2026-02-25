/**
 * @file types.ts
 * @description Meeting API 관련 타입 정의
 */

import type { CreateBookBody } from '@/features/book'

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

/**
 * 약속 장소 타입
 */
export type MeetingLocation = {
  name: string
  address: string
  latitude: number
  longitude: number
}

/**
 * 약속 생성 요청 타입
 */
export type CreateMeetingRequest = {
  /** 모임 ID */
  gatheringId: number
  /** 책 정보 */
  book: CreateBookBody
  /** 약속 이름 */
  meetingName: string
  /** 약속 시작 일시 (ISO 8601 형식) */
  meetingStartDate: string
  /** 약속 종료 일시 (ISO 8601 형식) */
  meetingEndDate: string
  /** 최대 참가 인원 */
  maxParticipants: number
  /** 장소 (선택 사항) */
  location: MeetingLocation | null
}

/**
 * 약속 생성 응답 타입 Todo:실제 응답값이랑 비교해봐야 함
 */
export type CreateMeetingResponse = {
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
    authors: string
    publisher: string
  }
  /** 일정 정보 */
  schedule: {
    date: string
    time: string
    startDateTime: string
    endDateTime: string
  }
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
    }>
  }
}

/**
 * 약속 수정 요청 타입
 */
export type UpdateMeetingRequest = {
  /** 약속 이름 */
  meetingName: string
  /** 약속 시작 일시 (ISO 8601 형식) */
  startDate: string
  /** 약속 종료 일시 (ISO 8601 형식) */
  endDate: string
  /** 장소 (선택 사항) */
  location: MeetingLocation | null
  /** 최대 참가 인원 */
  maxParticipants: number
}

/**
 * 약속 수정 응답 타입
 */
export type UpdateMeetingResponse = {
  /** 약속 ID */
  meetingId: number
  /** 약속 이름 */
  meetingName: string
  /** 약속 시작 일시 (ISO 8601 형식) */
  startDate: string
  /** 약속 종료 일시 (ISO 8601 형식) */
  endDate: string
  /** 장소 (선택 사항) */
  location: MeetingLocation | null
  /** 최대 참가 인원 */
  maxParticipants: number
}

/**
 * 약속 일정 타입
 */
export type MeetingSchedule = {
  startDateTime: string
  endDateTime: string
  displayDate: string
}

/**
 * 약속 상세 조회 액션 상태 타입
 */
export type MeetingDetailActionStateType =
  | 'CAN_EDIT'
  | 'EDIT_TIME_EXPIRED'
  | 'CAN_JOIN'
  | 'CAN_CANCEL'
  | 'RECRUITMENT_CLOSED'
  | 'DONE'
  | 'REJECTED'
  | 'CANCEL_TIME_EXPIRED'
  | 'JOIN_TIME_EXPIRED'

export type MeetingProgressStatus = 'PRE' | 'ONGOING' | 'POST'
/**
 * 약속 상세 조회 응답 타입
 */
export type GetMeetingDetailResponse = {
  /** 약속 ID */
  meetingId: number
  /** 약속 이름 */
  meetingName: string
  /** 약속 승인 상태 */
  meetingStatus: MeetingStatus
  /** 약속 진행 상태 */
  progressStatus: MeetingProgressStatus
  /** 주제 확정 여부 */
  confirmedTopic: boolean
  /** 주제 확정 일시 */
  confirmedTopicDate: string | null
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
    authors: string
    publisher: string
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
      role: 'LEADER' | 'MEMBER'
    }>
  }
  /** 버튼 상태 */
  actionState: {
    type: MeetingDetailActionStateType
    buttonLabel: string
    enabled: boolean
  }
}

// ============================================================
// 메인페이지 내 약속 리스트 관련 타입
// ============================================================

/** 메인페이지 약속 진행 상태 (시간 기준) */
export type MyMeetingProgressStatus = 'UPCOMING' | 'ONGOING' | 'DONE' | 'UNKNOWN'

/** 메인페이지 내 역할 */
export type MyMeetingRole = 'LEADER' | 'GATHERING_LEADER' | 'MEMBER' | 'NONE'

/** 메인페이지 약속 필터 */
export type MyMeetingFilter = 'ALL' | 'UPCOMING' | 'DONE'

/** 메인페이지 내 약속 아이템 */
export interface MyMeetingListItem {
  meetingId: number
  meetingName: string
  gatheringId: number
  gatheringName: string
  meetingLeaderName: string
  bookName: string
  startDateTime: string
  endDateTime: string
  meetingStatus: MeetingStatus | 'REJECTED' | 'DONE'
  myRole: MyMeetingRole
  progressStatus: MyMeetingProgressStatus
  preOpinionTemplateConfirmed: boolean
}

/** 메인페이지 내 약속 커서 */
export interface MyMeetingCursor {
  startDateTime: string
  meetingId: number
}

/** 메인페이지 내 약속 리스트 응답 */
export interface MyMeetingListResponse {
  items: MyMeetingListItem[]
  totalCount: number
  pageSize: number
  hasNext: boolean
  nextCursor: MyMeetingCursor | null
}

/** 메인페이지 내 약속 조회 파라미터 */
export interface GetMyMeetingsParams {
  filter: MyMeetingFilter
  startDateTime?: string
  meetingId?: number
  size?: number
}

/** 메인페이지 내 약속 탭 카운트 응답 */
export interface MyMeetingTabCountsResponse {
  all: number
  upcoming: number
  done: number
}
