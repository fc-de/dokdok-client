/**
 * @file useCreateBook.ts
 * @description 책 등록 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createBook } from '../book.api'
import type { CreateBookBody } from '../book.types'
import { bookListKeys } from './useBooks'

/**
 * 책을 등록하는 뮤테이션 훅
 *
 * @example
 * ```tsx
 * function BookSearchModal() {
 *   const { mutateAsync: registerBook, isPending } = useCreateBook()
 *
 *   const handleSelect = async (book: SearchBookItem) => {
 *     await registerBook({
 *       title: book.title,
 *       authors: book.authors.join(', '),
 *       publisher: book.publisher,
 *       isbn: book.isbn,
 *       thumbnail: book.thumbnail,
 *     })
 *   }
 *
 *   return (...)
 * }
 * ```
 */
export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBookBody) => createBook(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookListKeys.all })
    },
  })
}
