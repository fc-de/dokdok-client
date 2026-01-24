/**
 * @file useBookDetail.ts
 * @description 책 상세 정보 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import { getBookDetail } from '../book.api'

/** 책 상세 쿼리 키 팩토리 */
export const bookKeys = {
  all: ['books'] as const,
  detail: (bookId: number) => [...bookKeys.all, 'detail', bookId] as const,
}

/**
 * 책 상세 정보를 조회하는 훅
 *
 * @param bookId - 조회할 책 ID
 *
 * @example
 * ```tsx
 * function BookDetailPage() {
 *   const { data: book, isLoading, error } = useBookDetail(1)
 *
 *   if (isLoading) return <div>로딩 중...</div>
 *   if (error) return <div>에러 발생</div>
 *
 *   return <div>{book.title}</div>
 * }
 * ```
 */
export function useBookDetail(bookId: number) {
  return useQuery({
    queryKey: bookKeys.detail(bookId),
    queryFn: () => getBookDetail(bookId),
    enabled: bookId > 0,
  })
}
