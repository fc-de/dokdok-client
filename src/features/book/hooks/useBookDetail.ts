/**
 * @file useBookDetail.ts
 * @description 책 상세 정보 조회 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getBookDetail, toggleBookReadingStatus } from '../book.api'

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

/**
 * 책 읽기 상태를 토글하는 mutation 훅
 *
 * @param bookId - 토글할 책 ID
 *
 * @example
 * ```tsx
 * const { mutate: toggleStatus } = useToggleBookReadingStatus(bookId)
 * <Switch onCheckedChange={() => toggleStatus()} />
 * ```
 */
export function useToggleBookReadingStatus(bookId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleBookReadingStatus(bookId),
    onSuccess: (data) => {
      queryClient.setQueryData(bookKeys.detail(bookId), data)
    },
  })
}
