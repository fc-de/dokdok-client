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

// ─── 개인 회고 작성 폼 타입 ───────────────────────────────────────────────────

/**
 * 바뀐 나의 생각 - 토픽별 폼 항목
 */
export type ChangedThoughtFormItem = {
  topicId: number
  /** 핵심 쟁점 요약 */
  coreSummary: string
  /** 모임 후 내 의견 */
  postOpinion: string
}

/**
 * 타인의 관점 - 동적 목록 항목
 */
export type OthersPerspectiveFormItem = {
  /** 로컬 식별 ID */
  id: string
  /** 발언자 멤버 ID */
  speakerMemberId: number | null
  /** 관련 토픽 ID */
  topicId: number | null
  /** 어떤 의견이었나요 */
  opinion: string
  /** 나에게 어떤 영향을 주었나요 */
  impact: string
}

/**
 * 자유 기록 - 항목 (title + content 쌍)
 */
export type FreeRecordEntryFormItem = {
  /** 로컬 식별 ID */
  id: string
  title: string
  content: string
}

// ─── 개인 회고 저장 API 타입 ──────────────────────────────────────────────────

/**
 * 개인 회고 저장 요청 - 바뀐 나의 생각 항목
 */
export type SaveChangedThoughtItem = {
  topicId: number
  /** 핵심 쟁점 요약 (미입력 시 null) */
  keyIssue: string | null
  /** 모임 후 내 의견 (미입력 시 null) */
  postOpinion: string | null
}

/**
 * 개인 회고 저장 요청 - 타인의 관점 항목
 */
export type SaveOthersPerspectiveItem = {
  topicId: number
  meetingMemberId: number
  /** 상대 의견 내용 */
  opinionContent: string
  /** 인상적이었던 이유 */
  impressiveReason: string
}

/**
 * 개인 회고 저장 요청 - 자유 기록 항목
 */
export type SaveFreeTextItem = {
  /** 제목 (미입력 시 null) */
  title: string | null
  /** 내용 (미입력 시 null) */
  content: string | null
}

/**
 * 개인 회고 저장 요청 바디
 */
export type SavePersonalRetrospectiveRequest = {
  changedThoughts: SaveChangedThoughtItem[]
  othersPerspectives: SaveOthersPerspectiveItem[]
  freeTexts: SaveFreeTextItem[]
}

/**
 * 개인 회고 저장 요청 파라미터
 */
export type SavePersonalRetrospectiveParams = {
  meetingId: number
  body: SavePersonalRetrospectiveRequest
}

// ──────────────────────────────────────────────────────────────────────────────

/**
 * 개인 회고 조회 응답 - 모임 헤더 정보
 */
export type MeetingHeaderInfo = {
  /** 모임 이름 */
  gatheringName: string
  /** 책 제목 */
  bookTitle: string
  /** 저자 */
  bookAuthor: string
}

/**
 * 개인 회고 조회 응답 타입
 */
export type GetPersonalRetrospectiveResponse = {
  /** 모임 헤더 정보 */
  meetingHeaderInfo: MeetingHeaderInfo
  /** 약속 ID */
  meetingId: number
  /** 내 사전 의견 목록 */
  preOpinions: PersonalRetrospectivePreOpinion[]
  /** 확정된 토픽 목록 */
  topics: PersonalRetrospectiveTopic[]
  /** 약속 참여 멤버 목록 */
  meetingMembers: PersonalRetrospectiveMember[]
}
