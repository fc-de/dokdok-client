/**
 * @file useDeleteBook.ts
 * @description 책 삭제 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteBook } from '../book.api'
import { bookListKeys } from './useBooks'

/**
 * 책을 삭제하는 뮤테이션 훅
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync } = useDeleteBook()
 * mutate(bookId)
 *
 * // 여러 책 삭제
 * await Promise.all(bookIds.map(id => mutateAsync(id)))
 * ```
 */
export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookId: number) => deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookListKeys.all })
    },
  })
}
