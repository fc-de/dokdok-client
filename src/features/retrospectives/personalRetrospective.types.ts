/**
 * @file personalRetrospective.types.ts
 * @description 개인 회고 API 관련 타입 정의
 */

/**
 * 개인 회고 - 사전 의견 항목
 */
export type PersonalRetrospectivePreOpinion = {
  /** 주제 ID */
  topicId: number
  /** 주제 이름 */
  topicName: string
  /** 작성한 사전 의견 내용 */
  content: string
}

/**
 * 개인 회고 - 확정된 토픽 항목
 */
export type PersonalRetrospectiveTopic = {
  /** 주제 ID */
  topicId: number
  /** 주제 이름 */
  topicName: string
  /** 확정 순서 */
  confirmOrder: number
}

/**
 * 개인 회고 - 모임 멤버 항목
 */
export type PersonalRetrospectiveMember = {
  /** 모임 멤버 ID */
  meetingMemberId: number
  /** 닉네임 */
  nickname: string
  /** 프로필 이미지 URL */
  profileImage: string | null
}

/**
 * 개인 회고 조회 요청 파라미터
 */
export type GetPersonalRetrospectiveParams = {
  /** 모임 ID */
  gatheringId: number
  /** 약속 ID */
  meetingId: number
}

/**
 * 개인 회고 조회 응답 타입
 */
export type GetPersonalRetrospectiveResponse = {
  /** 모임 이름 */
  gatheringName: string
  /** 책 제목 */
  bookTitle: string
  /** 저자 */
  bookAuthor: string
  /** 약속 ID */
  meetingId: number
  /** 내 사전 의견 목록 */
  preOpinions: PersonalRetrospectivePreOpinion[]
  /** 확정된 토픽 목록 */
  topics: PersonalRetrospectiveTopic[]
  /** 약속 참여 멤버 목록 */
  meetingMembers: PersonalRetrospectiveMember[]
}
