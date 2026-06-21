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
