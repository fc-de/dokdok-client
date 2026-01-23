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
 * 에러 코드별 사용자 친화적 메시지
 *
 * @description
 * 서버에서 반환하는 메시지와 별개로, 프론트엔드에서 일관된 UX를 위해 사용합니다.
 * - 서버 메시지: 기술적/디버깅 용도
 * - 클라이언트 메시지: 사용자 친화적 표현
 *
 * @example
 * ```typescript
 * const message = ErrorMessage[ErrorCode.NICKNAME_ALREADY_EXISTS]
 * // → '이미 사용 중인 닉네임입니다.'
 * ```
 */
export const ErrorMessage: Record<ErrorCodeType, string> = {
  // Global - 기본 에러
  [ErrorCode.INVALID_ENUM_VALUE]: '올바르지 않은 값입니다.',
  [ErrorCode.INVALID_REQUEST_FORMAT]: '요청 형식이 올바르지 않습니다.',
  [ErrorCode.STATUS_ALREADY_SET]: '이미 처리된 요청입니다.',
  [ErrorCode.JSON_SERIALIZATION_ERROR]: '데이터 처리 중 오류가 발생했습니다.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.INVALID_INPUT_VALUE]: '입력값이 올바르지 않습니다.',
  [ErrorCode.INVALID_TYPE_VALUE]: '입력 형식이 올바르지 않습니다.',
  [ErrorCode.METHOD_NOT_ALLOWED]: '허용되지 않은 요청입니다.',

  // Global - 인증/인가
  [ErrorCode.ACCESS_DENIED]: '접근 권한이 없습니다.',
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.INVALID_TOKEN]: '인증 정보가 유효하지 않습니다.',
  [ErrorCode.EXPIRED_TOKEN]: '인증이 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCode.REFRESH_TOKEN_NOT_FOUND]: '인증 정보를 찾을 수 없습니다.',

  // Global - 파일 업로드
  [ErrorCode.FILE_UPLOAD_FAILED]: '파일 업로드에 실패했습니다.',
  [ErrorCode.INVALID_FILE_TYPE]: '지원하지 않는 파일 형식입니다.',
  [ErrorCode.FILE_SIZE_EXCEEDED]: '파일 크기가 너무 큽니다.',

  // Global - 외부 API
  [ErrorCode.EXTERNAL_API_ERROR]: '외부 서비스 연결에 실패했습니다.',
  [ErrorCode.KAKAO_API_ERROR]: '카카오 서비스 연결에 실패했습니다.',

  // User
  [ErrorCode.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
  [ErrorCode.NICKNAME_ALREADY_EXISTS]: '이미 사용 중인 닉네임입니다.',
  [ErrorCode.NICKNAME_EMPTY]: '닉네임을 입력해주세요.',
  [ErrorCode.NICKNAME_LENGTH_INVALID]: '닉네임은 2자 이상 20자 이하로 입력해주세요.',
  [ErrorCode.NICKNAME_FORMAT_INVALID]: '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.',

  // Book
  [ErrorCode.BOOK_NOT_FOUND]: '책을 찾을 수 없습니다.',
  [ErrorCode.BOOK_ALREADY_EXISTS]: '이미 책장에 등록된 책입니다.',
  [ErrorCode.BOOK_NOT_IN_SHELF]: '책장에 없는 책입니다.',
  [ErrorCode.BOOK_REVIEW_NOT_FOUND]: '리뷰를 찾을 수 없습니다.',
  [ErrorCode.BOOK_REVIEW_ALREADY_EXISTS]: '이미 리뷰를 작성했습니다.',
  [ErrorCode.KEYWORD_NOT_FOUND]: '키워드를 찾을 수 없습니다.',
  [ErrorCode.KEYWORD_NOT_SELECTABLE]: '선택할 수 없는 키워드입니다.',
  [ErrorCode.BOOK_REVIEW_INVALID_RATING]: '별점은 0.5 단위로 5점까지 입력할 수 있습니다.',
  [ErrorCode.BOOK_REVIEW_DELETED]: '삭제된 리뷰입니다.',

  // Record
  [ErrorCode.INVALID_RECORD_REQUEST]: '기록 정보가 올바르지 않습니다.',
  [ErrorCode.INVALID_RECORD_TYPE]: '올바르지 않은 기록 유형입니다.',
  [ErrorCode.RECORD_NOT_FOUND]: '기록을 찾을 수 없습니다.',

  // Gathering
  [ErrorCode.GATHERING_NOT_FOUND]: '모임을 찾을 수 없습니다.',
  [ErrorCode.NOT_GATHERING_MEMBER]: '모임 멤버가 아닙니다.',
  [ErrorCode.NOT_GATHERING_LEADER]: '모임장만 할 수 있는 작업입니다.',
  [ErrorCode.ALREADY_INACTIVE]: '이미 비활성화된 모임입니다.',
  [ErrorCode.CANNOT_REMOVE_LEADER]: '모임장은 강퇴할 수 없습니다.',
  [ErrorCode.ALREADY_REMOVED_MEMBER]: '이미 강퇴된 멤버입니다.',
  [ErrorCode.INVITATION_CODE_GENERATION_FAILED]:
    '초대 코드 생성에 실패했습니다. 다시 시도해주세요.',
  [ErrorCode.ALREADY_GATHERING_MEMBER]: '이미 가입된 모임입니다.',
  [ErrorCode.JOIN_REQUEST_ALREADY_PENDING]: '이미 가입 요청 중입니다.',
  [ErrorCode.INVALID_INVITATION_LINK]: '유효하지 않은 초대 링크입니다.',
  [ErrorCode.NOT_PENDING_STATUS]: '대기 중인 요청만 처리할 수 있습니다.',
  [ErrorCode.INVALID_APPROVE_TYPE]: '올바르지 않은 승인 상태입니다.',

  // Meeting
  [ErrorCode.MEETING_NOT_FOUND]: '약속을 찾을 수 없습니다.',
  [ErrorCode.MEETING_GATHERING_NOT_FOUND]: '약속의 모임을 찾을 수 없습니다.',
  [ErrorCode.NOT_GATHERING_MEETING]: '해당 모임의 약속이 아닙니다.',
  [ErrorCode.NOT_MEETING_MEMBER]: '약속 참가자가 아닙니다.',
  [ErrorCode.MEETING_MEMBER_NOT_FOUND]: '약속 참가자를 찾을 수 없습니다.',
  [ErrorCode.NOT_MEETING_LEADER]: '약속장만 할 수 있는 작업입니다.',
  [ErrorCode.MEETING_ALREADY_CONFIRMED]: '이미 확정된 약속입니다.',
  [ErrorCode.MEETING_FULL]: '약속 정원이 마감되었습니다.',
  [ErrorCode.INVALID_MEETING_STATUS_CHANGE]: '약속 상태를 변경할 수 없습니다.',
  [ErrorCode.MEETING_ALREADY_JOINED]: '이미 참가한 약속입니다.',
  [ErrorCode.MEETING_ALREADY_CANCELED]: '이미 취소된 약속입니다.',
  [ErrorCode.MEETING_CANCEL_NOT_ALLOWED]: '약속 시작 24시간 이내에는 취소할 수 없습니다.',
  [ErrorCode.INVALID_MAX_PARTICIPANTS]: '참가 인원 설정이 올바르지 않습니다.',
  [ErrorCode.MAX_PARTICIPANTS_LESS_THAN_CURRENT]:
    '현재 참가 인원보다 적게 설정할 수 없습니다.',

  // Topic
  [ErrorCode.TOPIC_NOT_FOUND]: '주제를 찾을 수 없습니다.',
  [ErrorCode.TOPIC_NOT_IN_MEETING]: '해당 약속의 주제가 아닙니다.',
  [ErrorCode.TOPIC_ANSWER_NOT_FOUND]: '답변을 찾을 수 없습니다.',
  [ErrorCode.TOPIC_ANSWER_ALREADY_SUBMITTED]: '이미 제출한 답변입니다.',
  [ErrorCode.TOPIC_USER_CANNOT_DELETE]: '주제를 삭제할 권한이 없습니다.',
  [ErrorCode.TOPIC_ALREADY_DELETED]: '이미 삭제된 주제입니다.',
  [ErrorCode.TOPIC_ANSWER_ALREADY_EXISTS]: '이미 답변이 존재합니다.',

  // Retrospective
  [ErrorCode.RETROSPECTIVE_ALREADY_EXISTS]: '이미 회고를 작성했습니다.',

  // OAuth2
  [ErrorCode.INVALID_OAUTH_PROVIDER]: '지원하지 않는 로그인 방식입니다.',
  [ErrorCode.OAUTH_AUTHENTICATION_FAILED]: '로그인에 실패했습니다.',
  [ErrorCode.INVALID_USER_PRINCIPAL]: '사용자 정보를 확인할 수 없습니다.',
  [ErrorCode.INVALID_KAKAO_ID]: '카카오 계정 정보를 확인할 수 없습니다.',
  [ErrorCode.INVALID_KAKAO_EMAIL]: '카카오 이메일 정보가 올바르지 않습니다.',
  [ErrorCode.INVALID_KAKAO_RESPONSE]: '카카오 응답이 올바르지 않습니다.',
} as const

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

  /**
   * 사용자 친화적 에러 메시지 반환
   *
   * @description
   * ErrorMessage 상수에서 메시지를 조회하고, 없으면 서버 메시지를 반환합니다.
   *
   * @example
   * ```typescript
   * catch (error) {
   *   if (error instanceof ApiError) {
   *     showToast(error.userMessage)
   *   }
   * }
   * ```
   */
  get userMessage(): string {
    return ErrorMessage[this.code as ErrorCodeType] ?? this.message
  }
}
