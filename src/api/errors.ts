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

  // Global - 공통 시스템 에러
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
  BOOK_REVIEW_ACCESS_DENIED_NOT_WRITTEN: 'B010',

  // Record
  INVALID_RECORD_REQUEST: 'R001',
  INVALID_RECORD_TYPE: 'R002',
  RECORD_NOT_FOUND: 'R003',
  RECORD_ALREADY_DELETED: 'R004',

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
  FAVORITE_LIMIT_EXCEEDED: 'GA013',

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
  MEETING_DELETE_NOT_ALLOWED: 'M015',

  // Topic
  TOPIC_NOT_FOUND: 'E101',
  TOPIC_NOT_IN_MEETING: 'E102',
  TOPIC_ANSWER_NOT_FOUND: 'E103',
  TOPIC_ANSWER_ALREADY_SUBMITTED: 'E104',
  TOPIC_USER_CANNOT_DELETE: 'E105',
  TOPIC_ALREADY_DELETED: 'E106',
  TOPIC_ANSWER_ALREADY_DELETED: 'E107',
  TOPIC_ANSWER_ALREADY_EXISTS: 'E108',

  // Retrospective
  RETROSPECTIVE_ALREADY_EXISTS: 'R101',
  RETROSPECTIVE_NOT_FOUND: 'R102',
  MEETING_RETROSPECTIVE_NOT_FOUND: 'R103',
  RETROSPECTIVE_ALREADY_DELETED: 'R104',
  NO_ACCESS_RETROSPECTIVE: 'R105',

  // Storage
  STORAGE_FILE_UPLOAD_FAILED: 'S001',
  STORAGE_FILE_DELETE_FAILED: 'S002',
  STORAGE_INVALID_FILE_TYPE: 'S003',
  STORAGE_FILE_SIZE_EXCEEDED: 'S004',
  STORAGE_BUCKET_NOT_FOUND: 'S005',
  STORAGE_PRESIGNED_URL_GENERATION_FAILED: 'S006',

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
  [ErrorCode.INVALID_ENUM_VALUE]: '유효하지 않은 값입니다.',
  [ErrorCode.INVALID_REQUEST_FORMAT]: '잘못된 요청 형식입니다.',
  [ErrorCode.STATUS_ALREADY_SET]: '이미 해당 상태입니다.',
  [ErrorCode.JSON_SERIALIZATION_ERROR]: 'JSON 직렬화 처리 중 오류가 발생했습니다.',

  // Global - 공통 시스템 에러
  [ErrorCode.INTERNAL_SERVER_ERROR]: '서버 내부 오류가 발생했습니다.',
  [ErrorCode.INVALID_INPUT_VALUE]: '입력값이 올바르지 않습니다.',
  [ErrorCode.INVALID_TYPE_VALUE]: '타입이 올바르지 않습니다.',
  [ErrorCode.METHOD_NOT_ALLOWED]: '지원하지 않는 HTTP 메서드입니다.',

  // Global - 인증/인가
  [ErrorCode.ACCESS_DENIED]: '접근 권한이 없습니다.',
  [ErrorCode.UNAUTHORIZED]: '인증이 필요합니다.',
  [ErrorCode.INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [ErrorCode.EXPIRED_TOKEN]: '만료된 토큰입니다.',
  [ErrorCode.REFRESH_TOKEN_NOT_FOUND]: '리프레시 토큰을 찾을 수 없습니다.',

  // Global - 파일 업로드
  [ErrorCode.FILE_UPLOAD_FAILED]: '파일 업로드에 실패했습니다.',
  [ErrorCode.INVALID_FILE_TYPE]: '지원하지 않는 파일 형식입니다.',
  [ErrorCode.FILE_SIZE_EXCEEDED]: '파일 크기가 제한을 초과했습니다.',

  // Global - 외부 API
  [ErrorCode.EXTERNAL_API_ERROR]: '외부 API 호출에 실패했습니다.',
  [ErrorCode.KAKAO_API_ERROR]: '카카오 API 호출에 실패했습니다.',

  // User
  [ErrorCode.USER_NOT_FOUND]: '존재하지 않는 사용자입니다.',
  [ErrorCode.NICKNAME_ALREADY_EXISTS]: '이미 존재하는 사용자 닉네임입니다.',
  [ErrorCode.NICKNAME_EMPTY]: '닉네임은 필수 입력 항목입니다.',
  [ErrorCode.NICKNAME_LENGTH_INVALID]: '닉네임은 2자 이상 20자 이하로 입력해주세요.',
  [ErrorCode.NICKNAME_FORMAT_INVALID]: '닉네임은 한글, 영문, 숫자만 사용 가능합니다.',

  // Book
  [ErrorCode.BOOK_NOT_FOUND]: '책을 찾을 수 없습니다.',
  [ErrorCode.BOOK_ALREADY_EXISTS]: '이미 등록된 책입니다.',
  [ErrorCode.BOOK_NOT_IN_SHELF]: '책장에 해당 책이 존재하지 않습니다.',
  [ErrorCode.BOOK_REVIEW_NOT_FOUND]: '책 리뷰를 찾을 수 없습니다.',
  [ErrorCode.BOOK_REVIEW_ALREADY_EXISTS]: '이미 책 리뷰가 존재합니다.',
  [ErrorCode.KEYWORD_NOT_FOUND]: '키워드를 찾을 수 없습니다.',
  [ErrorCode.KEYWORD_NOT_SELECTABLE]: '선택할 수 없는 키워드입니다.',
  [ErrorCode.BOOK_REVIEW_INVALID_RATING]: '별점은 0.5 단위의 5점 만점 값이어야 합니다.',
  [ErrorCode.BOOK_REVIEW_DELETED]: '삭제된 책 리뷰입니다.',
  [ErrorCode.BOOK_REVIEW_ACCESS_DENIED_NOT_WRITTEN]: '평가를 작성한 사용자만 조회할 수 있습니다.',

  // Record
  [ErrorCode.INVALID_RECORD_REQUEST]: '기록 타입에 필요한 입력값이 누락되었습니다.',
  [ErrorCode.INVALID_RECORD_TYPE]: '존재하지 않는 타입입니다.',
  [ErrorCode.RECORD_NOT_FOUND]: '기록을 찾을 수 없습니다.',
  [ErrorCode.RECORD_ALREADY_DELETED]: '이미 삭제된 기록입니다.',

  // Gathering
  [ErrorCode.GATHERING_NOT_FOUND]: '모임을 찾을 수 없습니다.',
  [ErrorCode.NOT_GATHERING_MEMBER]: '모임의 멤버가 아닙니다.',
  [ErrorCode.NOT_GATHERING_LEADER]: '리더만 가능한 작업입니다.',
  [ErrorCode.ALREADY_INACTIVE]: '이미 비활성 상태인 모임은 삭제할 수 없습니다.',
  [ErrorCode.CANNOT_REMOVE_LEADER]: '유일한 리더는 강퇴할 수 없습니다.',
  [ErrorCode.ALREADY_REMOVED_MEMBER]: '이미 제거된 멤버입니다.',
  [ErrorCode.INVITATION_CODE_GENERATION_FAILED]:
    '초대 코드 생성에 실패했습니다. 다시 시도해주세요.',
  [ErrorCode.ALREADY_GATHERING_MEMBER]: '이미 가입된 모임입니다.',
  [ErrorCode.JOIN_REQUEST_ALREADY_PENDING]: '이미 가입 요청이 진행 중입니다.',
  [ErrorCode.INVALID_INVITATION_LINK]: '초대링크는 필수입니다.',
  [ErrorCode.NOT_PENDING_STATUS]: '대기 중인 가입 요청만 처리할 수 있습니다.',
  [ErrorCode.INVALID_APPROVE_TYPE]: '승인 상태는 ACTIVE 또는 REJECTED만 가능합니다.',
  [ErrorCode.FAVORITE_LIMIT_EXCEEDED]: '즐겨찾기는 최대 4개까지만 등록할 수 있습니다.',

  // Meeting
  [ErrorCode.MEETING_NOT_FOUND]: '약속을 찾을 수 없습니다.',
  [ErrorCode.MEETING_GATHERING_NOT_FOUND]: '모임을 찾을 수 없습니다.',
  [ErrorCode.NOT_GATHERING_MEETING]: '모임에 속한 약속이 아닙니다.',
  [ErrorCode.NOT_MEETING_MEMBER]: '약속의 멤버가 아닙니다.',
  [ErrorCode.MEETING_MEMBER_NOT_FOUND]: '해당 약속의 멤버들을 찾을 수 없습니다.',
  [ErrorCode.NOT_MEETING_LEADER]: '약속장만 수정할 수 있습니다.',
  [ErrorCode.MEETING_ALREADY_CONFIRMED]: '약속이 확정된 경우에는 주제를 제안할 수 없습니다.',
  [ErrorCode.MEETING_FULL]: '약속 정원이 마감되었습니다.',
  [ErrorCode.INVALID_MEETING_STATUS_CHANGE]: '약속 상태를 변경할 수 없습니다.',
  [ErrorCode.MEETING_ALREADY_JOINED]: '이미 참가한 약속입니다.',
  [ErrorCode.MEETING_ALREADY_CANCELED]: '이미 취소된 약속입니다.',
  [ErrorCode.MEETING_CANCEL_NOT_ALLOWED]: '약속 시작 24시간 이내에는 취소할 수 없습니다.',
  [ErrorCode.INVALID_MAX_PARTICIPANTS]:
    '최대 참가 인원은 1명 이상이어야 하며, 모임 전체 인원을 초과할 수 없습니다.',
  [ErrorCode.MAX_PARTICIPANTS_LESS_THAN_CURRENT]:
    '현재 참가 확정된 인원 수보다 적게 수정할 수 없습니다.',
  [ErrorCode.MEETING_DELETE_NOT_ALLOWED]: '약속 시작 24시간 이내에는 삭제할 수 없습니다.',

  // Topic
  [ErrorCode.TOPIC_NOT_FOUND]: '주제를 찾을 수 없습니다.',
  [ErrorCode.TOPIC_NOT_IN_MEETING]: '해당 주제는 지정한 약속에 속하지 않습니다.',
  [ErrorCode.TOPIC_ANSWER_NOT_FOUND]: '답변을 찾을 수 없습니다.',
  [ErrorCode.TOPIC_ANSWER_ALREADY_SUBMITTED]: '이미 제출된 답변입니다.',
  [ErrorCode.TOPIC_USER_CANNOT_DELETE]: '사용자에게 주제 삭제 권한이 없습니다.',
  [ErrorCode.TOPIC_ALREADY_DELETED]: '이미 삭제된 주제입니다.',
  [ErrorCode.TOPIC_ANSWER_ALREADY_DELETED]: '이미 삭제된 답변입니다.',
  [ErrorCode.TOPIC_ANSWER_ALREADY_EXISTS]: '이미 답변이 존재합니다.',

  // Retrospective
  [ErrorCode.RETROSPECTIVE_ALREADY_EXISTS]: '이미 해당 약속에 대한 회고가 존재합니다.',
  [ErrorCode.RETROSPECTIVE_NOT_FOUND]: '회고를 찾을 수 없습니다.',
  [ErrorCode.MEETING_RETROSPECTIVE_NOT_FOUND]: '공동 회고 내용을 찾을 수 없습니다.',
  [ErrorCode.RETROSPECTIVE_ALREADY_DELETED]: '이미 삭제된 개인 회고입니다.',
  [ErrorCode.NO_ACCESS_RETROSPECTIVE]: '회고에 접근할 권한이 없습니다.',

  // Storage
  [ErrorCode.STORAGE_FILE_UPLOAD_FAILED]: '파일 업로드에 실패했습니다.',
  [ErrorCode.STORAGE_FILE_DELETE_FAILED]: '파일 삭제에 실패했습니다.',
  [ErrorCode.STORAGE_INVALID_FILE_TYPE]: '지원하지 않는 파일 형식입니다.',
  [ErrorCode.STORAGE_FILE_SIZE_EXCEEDED]: '파일 크기가 제한을 초과했습니다.',
  [ErrorCode.STORAGE_BUCKET_NOT_FOUND]: '스토리지 버킷을 찾을 수 없습니다.',
  [ErrorCode.STORAGE_PRESIGNED_URL_GENERATION_FAILED]: 'Presigned URL 생성에 실패했습니다.',

  // OAuth2
  [ErrorCode.INVALID_OAUTH_PROVIDER]: '지원하지 않는 소셜 로그인입니다.',
  [ErrorCode.OAUTH_AUTHENTICATION_FAILED]: 'OAuth 인증에 실패했습니다.',
  [ErrorCode.INVALID_USER_PRINCIPAL]: '사용자 인증 정보를 추출할 수 없습니다.',
  [ErrorCode.INVALID_KAKAO_ID]: '카카오 ID를 추출할 수 없습니다.',
  [ErrorCode.INVALID_KAKAO_EMAIL]: '카카오 이메일 정보가 올바르지 않습니다.',
  [ErrorCode.INVALID_KAKAO_RESPONSE]: '카카오 응답 데이터가 올바르지 않습니다.',
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
