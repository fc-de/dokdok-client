/**
 * @file types.ts
 * @description API 응답 공통 타입 정의
 */

/**
 * API 성공 응답 타입
 *
 * @template T - 응답 데이터의 타입
 *
 * @example
 * ```typescript
 * // 서버 응답 예시
 * {
 *   "code": "SUCCESS",
 *   "message": "사용자 정보를 조회했습니다.",
 *   "data": { "userId": 1, "nickname": "독서왕" }
 * }
 * ```
 */
export type ApiResponse<T> = {
  /** 응답 코드 (예: 'SUCCESS', 'CREATED', 'DELETED') */
  code: string
  /** 응답 메시지 */
  message: string
  /** 응답 데이터 */
  data: T
}

/**
 * API 에러 응답 타입
 *
 * @example
 * ```typescript
 * // 서버 에러 응답 예시
 * {
 *   "code": "U001",
 *   "message": "존재하지 않는 사용자입니다.",
 *   "data": null
 * }
 * ```
 */
export type ApiErrorResponse = {
  /** 에러 코드 (예: 'U001', 'G001') */
  code: string
  /** 에러 메시지 */
  message: string
  /** 에러 시 data는 null */
  data: null
}

/**
 * 페이지네이션 응답 타입
 *
 * @template T - 아이템의 타입
 *
 * @example
 * ```typescript
 * // 페이지네이션 응답 예시
 * {
 *   "items": [{ "id": 1, "title": "책1" }, { "id": 2, "title": "책2" }],
 *   "totalCount": 50,
 *   "currentPage": 0,
 *   "pageSize": 10,
 *   "totalPages": 5
 * }
 * ```
 */
export type PaginatedResponse<T> = {
  /** 현재 페이지의 아이템 배열 */
  items: T[]
  /** 전체 아이템 수 */
  totalCount: number
  /** 현재 페이지 번호 (0부터 시작) */
  currentPage: number
  /** 페이지 크기 (한 페이지당 아이템 수) */
  pageSize: number
  /** 전체 페이지 수 */
  totalPages: number
}

/**
 * 커서 기반 페이지네이션 응답 타입
 *
 * @template T - 아이템의 타입
 * @template C - 커서 타입
 *
 * @example
 * ```typescript
 * // 커서 기반 페이지네이션 응답 예시
 * {
 *   "items": [{ "id": 1, "title": "주제1" }, { "id": 2, "title": "주제2" }],
 *   "pageSize": 10,
 *   "hasNext": true,
 *   "nextCursor": { "likeCount": 5, "topicId": 2 },
 *   "totalCount": 25
 * }
 * ```
 */
export type CursorPaginatedResponse<T, C = unknown> = {
  /** 현재 페이지의 아이템 배열 */
  items: T[]
  /** 페이지 크기 (한 페이지당 아이템 수) */
  pageSize: number
  /** 다음 페이지 존재 여부 */
  hasNext: boolean
  /** 다음 페이지 커서 (hasNext가 false면 null) */
  nextCursor: C | null
  /** 전체 아이템 수 (첫 요청 시만 포함, 이후 요청에서는 생략) */
  totalCount?: number
}
