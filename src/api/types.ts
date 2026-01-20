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
 * 페이지네이션 응답 타입 (Spring Data JPA Page 형식)
 *
 * @template T - 컨텐츠 아이템의 타입
 *
 * @example
 * ```typescript
 * // 페이지네이션 응답 예시
 * {
 *   "content": [{ "id": 1, "title": "책1" }, { "id": 2, "title": "책2" }],
 *   "totalPages": 5,
 *   "totalElements": 50,
 *   "size": 10,
 *   "number": 0
 * }
 * ```
 */
export type PaginatedResponse<T> = {
  /** 현재 페이지의 컨텐츠 배열 */
  content: T[]
  /** 전체 페이지 수 */
  totalPages: number
  /** 전체 요소 수 */
  totalElements: number
  /** 페이지 크기 (한 페이지당 요소 수) */
  size: number
  /** 현재 페이지 번호 (0부터 시작) */
  number: number
}
