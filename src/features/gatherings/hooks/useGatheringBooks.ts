import { useInfiniteQuery } from '@tanstack/react-query'

import { PAGE_SIZES } from '@/shared/constants'

import { getGatheringBooks } from '../gatherings.api'
import { gatheringQueryKeys } from './gatheringQueryKeys'

interface UseGatheringBooksOptions {
  gatheringId: number
  size?: number
}

/**
 * 모임 책장 조회 훅 (무한 스크롤)
 *
 * @param options - 조회 옵션
 * @param options.gatheringId - 모임 ID
 * @param options.size - 페이지 크기 (기본: 12)
 * @returns 책장 목록 무한 쿼리 결과
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGatheringBooks({
 *   gatheringId: 1,
 * })
 *
 * const books = data?.pages.flatMap(page => page.items) ?? []
 * ```
 */
export const useGatheringBooks = ({
  gatheringId,
  size = PAGE_SIZES.GATHERING_BOOKS,
}: UseGatheringBooksOptions) => {
  return useInfiniteQuery({
    queryKey: [...gatheringQueryKeys.books(gatheringId), size],
    queryFn: async ({ pageParam }) => {
      const response = await getGatheringBooks({ gatheringId, page: pageParam, size })
      return response.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage >= lastPage.totalPages - 1) return undefined
      return lastPage.currentPage + 1
    },
    enabled: gatheringId > 0,
  })
}
