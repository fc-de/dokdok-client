/**
 * @file useBooks.ts
 * @description 책 목록 조회 훅 (무한스크롤 지원)
 */

import { useInfiniteQuery } from '@tanstack/react-query'

import { getBooks } from '../book.api'
import type { GetBooksParams, GetBooksResponse } from '../book.types'
import { bookKeys } from './useBookDetail'

/** 책 목록 쿼리 키 확장 */
export const bookListKeys = {
  ...bookKeys,
  list: (params?: Omit<GetBooksParams, 'cursorAddedAt' | 'cursorBookId'>) =>
    [...bookKeys.all, 'list', params ?? {}] as const,
}

/**
 * 책 목록을 조회하는 훅 (무한스크롤 지원)
 *
 * @param params - 필터링/정렬 파라미터 (status, gatheringId, rating, sort)
 *
 * @example
 * ```tsx
 * function BookListPage() {
 *   const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 *   } = useBooks({ status: 'READING' })
 *
 *   const books = data?.pages.flatMap(page => page.items) ?? []
 *   const totalCount = data?.pages[0]?.totalCount ?? 0
 *
 *   return (
 *     <div>
 *       <p>전체: {totalCount}권</p>
 *       {books.map(book => <BookCard key={book.bookId} book={book} />)}
 *       {hasNextPage && (
 *         <button onClick={() => fetchNextPage()}>더 보기</button>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useBooks(params?: Omit<GetBooksParams, 'cursorAddedAt' | 'cursorBookId'>) {
  return useInfiniteQuery({
    queryKey: bookListKeys.list(params),
    queryFn: ({ pageParam }) =>
      getBooks({
        ...params,
        cursorAddedAt: pageParam?.addedAt,
        cursorBookId: pageParam?.bookId,
      }),
    initialPageParam: undefined as GetBooksResponse['nextCursor'] | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  })
}
