export const CHANGED_THOUGHTS_LIMITS = {
  CORE_ISSUE_MAX: 200,
  POST_OPINION_MAX: 10000,
} as const

export const OTHERS_PERSPECTIVE_LIMITS = {
  OPINION_MAX: 10_000,
  IMPRESSIVE_REASON_MAX: 5000,
} as const

export const FREE_RECORD_LIMITS = {
  LIST_MAX: 10,
  TITLE_MAX: 40,
  CONTENT_MAX: 100000,
} as const

export const PERSONAL_RETRO_SECTION_IDS = {
  changedThoughts: 'changed-thoughts',
  othersPerspective: 'others-perspective',
  freeRecord: 'free-record',
} as const

/** sticky 헤더 높이: GNB(64) + SubPageHeader(59) + 페이지 헤더 바(65) + 패딩(24) */
export const PERSONAL_RETRO_STICKY_OFFSET = 212

/**
 * 모바일 sticky 헤더 높이(클릭 시 스크롤 위치 계산용)
 * withSubtitle: 모바일 헤더(부제목 포함, 68) + 섹션 탭 바(약 55) + 여백(24)
 * withoutSubtitle: 모바일 헤더(부제목 없음, 49) + 섹션 탭 바(약 55) + 여백(24)
 */
export const PERSONAL_RETRO_SCROLL_OFFSET_MOBILE = {
  withSubtitle: 147,
  withoutSubtitle: 128,
} as const

/**
 * 모바일 섹션 구분선 활성화 기준
 * withSubtitle: 상단 헤더(부제목 포함, 68) + 20px
 * withoutSubtitle: 상단 헤더(부제목 없음, 49) + 20px
 */
export const PERSONAL_RETRO_ACTIVE_OFFSET_MOBILE = {
  withSubtitle: 88,
  withoutSubtitle: 69,
} as const

/** 모바일 섹션 탭 바의 sticky top 위치: 상단 모바일 헤더 높이에 맞춰 선택 */
export const PERSONAL_RETRO_MOBILE_TAB_TOP_CLASS = {
  withSubtitle: 'top-17',
  withoutSubtitle: 'top-mobile-header-height',
} as const
