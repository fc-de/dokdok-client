/**
 * @file errors.ts
 * @description API 에러 코드 및 에러 클래스 정의
 *
 * 서버에서 반환하는 에러 코드를 상수로 관리하고,
 * AxiosError를 래핑하는 ApiError 클래스를 제공합니다.
 */

/**
 * 서버 에러 코드 상수
 *
 * @description
 * 백엔드에서 정의한 에러 코드입니다. 수정하지 마세요.
 * 에러 코드 체계:
 * - E0xx, G0xx: Global 기본 에러
 * - G1xx: 인증/인가 에러
 * - G2xx: 파일 업로드 에러
 * - G3xx: 외부 API 에러
 * - U0xx: User 에러
 * - B0xx: Book 에러
 * - R0xx: Record 에러
 * - GA0xx: Gathering 에러
 * - M0xx: Meeting 에러
 * - E1xx: Topic 에러
 * - R1xx: Retrospective 에러
 * - O0xx, O1xx: OAuth2 에러
 */
export const ErrorCode = {
  // Global - 기본 에러
  INVALID_ENUM_VALUE: 'E001',
  INVALID_REQUEST_FORMAT: 'E002',
  STATUS_ALREADY_SET: 'E003',
  JSON_SERIALIZATION_ERROR: 'E004',
  INTERNAL_SERVER_ERROR: 'G001',
  INVALID_INPUT_VALUE: 'G002',
  INVALID_TYPE_VALUE: 'G003',
  METHOD_NOT_ALLOWED: 'G004',

  // Global - 인증/인가
  ACCESS_DENIED: 'G101',
  UNAUTHORIZED: 'G102',
  INVALID_TOKEN: 'G103',
  EXPIRED_TOKEN: 'G104',
  REFRESH_TOKEN_NOT_FOUND: 'G105',

  // Global - 파일 업로드
  FILE_UPLOAD_FAILED: 'G201',
  INVALID_FILE_TYPE: 'G202',
  FILE_SIZE_EXCEEDED: 'G203',

  // Global - 외부 API
  EXTERNAL_API_ERROR: 'G301',
  KAKAO_API_ERROR: 'G302',

  // User
  USER_NOT_FOUND: 'U001',
  NICKNAME_ALREADY_EXISTS: 'U002',
  NICKNAME_EMPTY: 'U003',
  NICKNAME_LENGTH_INVALID: 'U004',
  NICKNAME_FORMAT_INVALID: 'U005',

  // Book
  BOOK_NOT_FOUND: 'B001',
  BOOK_ALREADY_EXISTS: 'B002',
  BOOK_NOT_IN_SHELF: 'B003',
  BOOK_REVIEW_NOT_FOUND: 'B004',
  BOOK_REVIEW_ALREADY_EXISTS: 'B005',
  KEYWORD_NOT_FOUND: 'B006',
  KEYWORD_NOT_SELECTABLE: 'B007',
  BOOK_REVIEW_INVALID_RATING: 'B008',
  BOOK_REVIEW_DELETED: 'B009',

  // Record
  INVALID_RECORD_REQUEST: 'R001',
  INVALID_RECORD_TYPE: 'R002',
  RECORD_NOT_FOUND: 'R003',

  // Gathering
  GATHERING_NOT_FOUND: 'GA001',
  NOT_GATHERING_MEMBER: 'GA002',
  NOT_GATHERING_LEADER: 'GA003',
  ALREADY_INACTIVE: 'GA004',
  CANNOT_REMOVE_LEADER: 'GA005',
  ALREADY_REMOVED_MEMBER: 'GA006',
  INVITATION_CODE_GENERATION_FAILED: 'GA007',
  ALREADY_GATHERING_MEMBER: 'GA008',
  JOIN_REQUEST_ALREADY_PENDING: 'GA009',
  INVALID_INVITATION_LINK: 'GA010',
  NOT_PENDING_STATUS: 'GA011',
  INVALID_APPROVE_TYPE: 'GA012',

  // Meeting
  MEETING_NOT_FOUND: 'M001',
  MEETING_GATHERING_NOT_FOUND: 'M002',
  NOT_GATHERING_MEETING: 'M003',
  NOT_MEETING_MEMBER: 'M004',
  MEETING_MEMBER_NOT_FOUND: 'M005',
  NOT_MEETING_LEADER: 'M006',
  MEETING_ALREADY_CONFIRMED: 'M007',
  MEETING_FULL: 'M008',
  INVALID_MEETING_STATUS_CHANGE: 'M009',
  MEETING_ALREADY_JOINED: 'M010',
  MEETING_ALREADY_CANCELED: 'M011',
  MEETING_CANCEL_NOT_ALLOWED: 'M012',
  INVALID_MAX_PARTICIPANTS: 'M013',
  MAX_PARTICIPANTS_LESS_THAN_CURRENT: 'M014',

  // Topic
  TOPIC_NOT_FOUND: 'E101',
  TOPIC_NOT_IN_MEETING: 'E102',
  TOPIC_ANSWER_NOT_FOUND: 'E103',
  TOPIC_ANSWER_ALREADY_SUBMITTED: 'E104',
  TOPIC_USER_CANNOT_DELETE: 'E105',
  TOPIC_ALREADY_DELETED: 'E106',
  TOPIC_ANSWER_ALREADY_EXISTS: 'E107',

  // Retrospective
  RETROSPECTIVE_ALREADY_EXISTS: 'R101',

  // OAuth2
  INVALID_OAUTH_PROVIDER: 'O001',
  OAUTH_AUTHENTICATION_FAILED: 'O002',
  INVALID_USER_PRINCIPAL: 'O003',
  INVALID_KAKAO_ID: 'O101',
  INVALID_KAKAO_EMAIL: 'O102',
  INVALID_KAKAO_RESPONSE: 'O103',
} as const

/** 에러 코드 타입 (타입 가드에 사용) */
export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * API 에러 클래스
 *
 * @description
 * Axios 응답 에러를 래핑하여 일관된 에러 처리를 가능하게 합니다.
 * interceptors.ts에서 AxiosError를 ApiError로 변환합니다.
 *
 * @example
 * ```typescript
 * try {
 *   await api.patch('/api/users/me', { nickname: 'ab' })
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     // 단일 에러 코드 확인
 *     if (error.is(ErrorCode.NICKNAME_LENGTH_INVALID)) {
 *       showToast('닉네임은 2자 이상이어야 합니다.')
 *     }
 *
 *     // 여러 에러 코드 중 하나인지 확인
 *     if (error.isOneOf(ErrorCode.UNAUTHORIZED, ErrorCode.ACCESS_DENIED)) {
 *       redirectToLogin()
 *     }
 *   }
 * }
 * ```
 */
export class ApiError extends Error {
  /** 서버에서 반환한 에러 코드 */
  code: string
  /** HTTP 상태 코드 */
  status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }

  /**
   * 특정 에러 코드인지 확인
   * @param code - 비교할 에러 코드
   */
  is(code: ErrorCodeType): boolean {
    return this.code === code
  }

  /**
   * 여러 에러 코드 중 하나인지 확인
   * @param codes - 비교할 에러 코드들
   */
  isOneOf(...codes: ErrorCodeType[]): boolean {
    return codes.includes(this.code as ErrorCodeType)
  }
}
