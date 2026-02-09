/**
 * @file keywords.api.ts
 * @description 키워드 API 함수
 */

import { api } from '@/api'

import { KEYWORDS_ENDPOINTS } from './keywords.endpoints'
import { getMockKeywords } from './keywords.mock'
import type { GetKeywordsResponse } from './keywords.types'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ============================================================
// API Functions
// ============================================================

/**
 * 키워드 목록 조회
 *
 * @returns 전체 키워드 목록 (카테고리 및 선택 가능한 키워드)
 *
 * @example
 * ```typescript
 * const { keywords } = await getKeywords()
 * const categories = keywords.filter(k => k.level === 1)
 * const selectableKeywords = keywords.filter(k => k.isSelectable)
 * ```
 */
export async function getKeywords(): Promise<GetKeywordsResponse> {
  if (USE_MOCK) {
    return getMockKeywords()
  }

  return api.get<GetKeywordsResponse>(KEYWORDS_ENDPOINTS.LIST)
}
