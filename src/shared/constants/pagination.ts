/**
 * 페이지네이션 관련 상수
 */

/**
 * 기본 페이지 사이즈
 * - 대부분의 리스트에서 사용하는 기본값
 */
export const DEFAULT_PAGE_SIZE = 5

/**
 * 페이지네이션에 표시할 페이지 번호 개수
 * - 한 번에 표시되는 페이지 버튼 수 (예: 1 2 3 4 5)
 */
export const DEFAULT_SHOW_PAGES = 5

/**
 * Feature별 페이지 사이즈
 */
export const PAGE_SIZES = {
  /** 약속 승인 관리 리스트 페이지 사이즈 */
  MEETING_APPROVALS: 10,
} as const
