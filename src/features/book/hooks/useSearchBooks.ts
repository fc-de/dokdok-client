/**
 * @file useSearchBooks.ts
 * @description 도서 검색 훅 (무한스크롤 지원)
 */

import { useInfiniteQuery } from '@tanstack/react-query'

import { searchBooks } from '../book.api'

/** 도서 검색 쿼리 키 */
export const searchBooksKeys = {
  all: ['searchBooks'] as const,
  search: (query: string) => [...searchBooksKeys.all, query] as const,
}

/**
 * 도서를 검색하는 훅 (무한스크롤 지원)
 *
 * @param query - 검색어
 *
 * @example
 * ```tsx
 * function BookSearchModal() {
 *   const [query, setQuery] = useState('')
 *   const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetching,
 *   } = useSearchBooks(query)
 *
 *   const books = data?.pages.flatMap(page => page.items) ?? []
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={(e) => setQuery(e.target.value)} />
 *       {books.map(book => <BookItem key={book.isbn} book={book} />)}
 *     </div>
 *   )
 * }
 * ```
 */
export function useSearchBooks(query: string) {
  return useInfiniteQuery({
    queryKey: searchBooksKeys.search(query),
    queryFn: ({ pageParam }) =>
      searchBooks({
        query,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor?.page ?? undefined) : undefined,
    enabled: query.trim().length > 0,
  })
}
