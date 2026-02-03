import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createBookReview } from '../book.api'
import type { CreateBookReviewBody } from '../book.types'
import { bookReviewKeys } from './useBookReview'
import { bookReviewHistoryKeys } from './useBookReviewHistory'

/**
 * 책 평가 생성 훅
 *
 * @description 책에 대한 평가를 생성하고, 성공 시 관련 쿼리를 무효화합니다.
 *
 * @example
 * ```tsx
 * const { mutate: submitReview, isPending } = useCreateBookReview(bookId)
 *
 * submitReview(
 *   { rating: 4.5, keywordIds: [3, 7] },
 *   {
 *     onSuccess: () => {
 *       console.log('평가 제출 완료')
 *     },
 *   }
 * )
 * ```
 */
export function useCreateBookReview(bookId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBookReviewBody) => createBookReview(bookId, body),
    onSuccess: () => {
      // 책 평가 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: bookReviewKeys.detail(bookId) })
      // 책 평가 히스토리 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: bookReviewHistoryKeys.list(bookId) })
    },
  })
}
