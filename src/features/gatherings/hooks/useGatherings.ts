import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { getGatherings } from '../gatherings.api'
import type { GatheringCursor, GatheringListResponse } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/** 초기 로드 개수 (3열 × 4행) */
const INITIAL_PAGE_SIZE = 12
/** 추가 로드 개수 (3열 × 3행) */
const NEXT_PAGE_SIZE = 9

/** 페이지 파라미터 타입: undefined = 첫 페이지, GatheringCursor = 다음 페이지 */
type PageParam = GatheringCursor | undefined

/**
 * 내 모임 전체 목록 조회 훅 (무한 스크롤)
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGatherings()
 *
 * // 모임 목록 접근
 * const gatherings = data?.pages.flatMap(page => page.items) ?? []
 *
 * // 다음 페이지 로드
 * if (hasNextPage) fetchNextPage()
 * ```
 */
export const useGatherings = () => {
  return useInfiniteQuery<
    GatheringListResponse,
    Error,
    InfiniteData<GatheringListResponse, PageParam>,
    readonly string[],
    PageParam
  >({
    queryKey: gatheringQueryKeys.lists(),
    queryFn: async ({ pageParam }: { pageParam: PageParam }) => {
      const isFirstPage = !pageParam
      const response = await getGatherings({
        pageSize: isFirstPage ? INITIAL_PAGE_SIZE : NEXT_PAGE_SIZE,
        cursorJoinedAt: pageParam?.joinedAt,
        cursorId: pageParam?.gatheringMemberId,
      })
      return response.data
    },
    initialPageParam: undefined as PageParam,
    getNextPageParam: (lastPage: GatheringListResponse): PageParam => {
      if (!lastPage.hasNext || !lastPage.nextCursor) return undefined
      return lastPage.nextCursor
    },
  })
}
