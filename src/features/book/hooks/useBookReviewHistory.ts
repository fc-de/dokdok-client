/**
 * @file useBookReviewHistory.ts
 * @description 책 평가 히스토리 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import { getBookReviewHistory } from '../book.api'

/** 책 평가 히스토리 쿼리 키 팩토리 */
export const bookReviewHistoryKeys = {
  all: ['bookReviewHistory'] as const,
  list: (bookId: number) => [...bookReviewHistoryKeys.all, 'list', bookId] as const,
}

/**
 * 책 평가 히스토리를 조회하는 훅
 *
 * @param bookId - 조회할 책 ID
 *
 * @example
 * ```tsx
 * function ReviewHistoryList() {
 *   const { data, isLoading } = useBookReviewHistory(1)
 *
 *   if (isLoading) return <div>로딩 중...</div>
 *
 *   return data?.items.map((item) => (
 *     <ReviewHistoryCard key={item.bookReviewHistoryId} item={item} />
 *   ))
 * }
 * ```
 */
export function useBookReviewHistory(bookId: number) {
  return useQuery({
    queryKey: bookReviewHistoryKeys.list(bookId),
    queryFn: () => getBookReviewHistory(bookId),
    enabled: bookId > 0,
  })
}
