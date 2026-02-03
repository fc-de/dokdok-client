import { useQuery } from '@tanstack/react-query'

import { getKeywords } from '../keywords.api'

/**
 * 키워드 목록 조회 훅
 *
 * @description 전체 키워드 목록을 조회합니다. 카테고리와 선택 가능한 키워드를 모두 포함합니다.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useKeywords()
 *
 * // 책 카테고리만 필터링
 * const bookCategories = data?.keywords.filter(
 *   k => k.type === 'BOOK' && k.level === 1
 * )
 *
 * // 선택 가능한 책 키워드만 필터링
 * const selectableBookKeywords = data?.keywords.filter(
 *   k => k.type === 'BOOK' && k.isSelectable
 * )
 * ```
 */
export function useKeywords() {
  return useQuery({
    queryKey: ['keywords'],
    queryFn: getKeywords,
    staleTime: 1000 * 60 * 60, // 1시간 - 키워드는 자주 변경되지 않으므로
  })
}
