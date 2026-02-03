/**
 * @file useBookReview.ts
 * @description 책 평가 정보 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import { getBookReview } from '../book.api'

/** 책 평가 쿼리 키 팩토리 */
export const bookReviewKeys = {
  all: ['bookReviews'] as const,
  detail: (bookId: number) => [...bookReviewKeys.all, 'detail', bookId] as const,
}

/**
 * 책 평가 정보를 조회하는 훅
 *
 * @param bookId - 조회할 책 ID
 *
 * @example
 * ```tsx
 * function BookReviewCard() {
 *   const { data: review, isLoading, error } = useBookReview(1)
 *
 *   if (isLoading) return <div>로딩 중...</div>
 *   if (error) return <div>에러 발생</div>
 *   if (!review) return <div>평가 없음</div>
 *
 *   return <div>별점: {review.rating}</div>
 * }
 * ```
 */
export function useBookReview(bookId: number) {
  return useQuery({
    queryKey: bookReviewKeys.detail(bookId),
    queryFn: () => getBookReview(bookId),
    enabled: bookId > 0,
  })
}
