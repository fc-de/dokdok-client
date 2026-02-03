/**
 * @file keywords.types.ts
 * @description 키워드 관련 타입 정의
 */

/** 키워드 타입 */
export type KeywordType = 'BOOK' | 'IMPRESSION'

/** 키워드 */
export interface Keyword {
  id: number
  name: string
  type: KeywordType
  parentId: number | null
  parentName: string | null
  level: number
  sortOrder: number
  isSelectable: boolean
}

/** 키워드 목록 조회 응답 */
export interface GetKeywordsResponse {
  keywords: Keyword[]
}
