/**
 * @file useMyGatherings.ts
 * @description 내 모임 목록 조회 훅 (무한 스크롤)
 */

import { useInfiniteQuery } from '@tanstack/react-query'

import { getMyGatherings } from '../book.api'
import type { GetGatheringsParams } from '../book.types'

/** 모임 쿼리 키 팩토리 */
export const gatheringKeys = {
  all: ['gatherings'] as const,
  list: (params?: Omit<GetGatheringsParams, 'nextCursor'>) =>
    [...gatheringKeys.all, 'list', params] as const,
}

/**
 * 내 모임 목록을 무한 스크롤로 조회하는 훅
 *
 * @param params - 조회 파라미터 (pageSize)
 *
 * @example
 * ```tsx
 * function GatheringFilter() {
 *   const { data, isLoading, fetchNextPage, hasNextPage } = useMyGatherings()
 *
 *   const gatherings = data?.pages.flatMap((page) => page.items) ?? []
 *
 *   return (
 *     <div>
 *       {gatherings.map((g) => (
 *         <div key={g.gatheringId}>{g.gatheringName}</div>
 *       ))}
 *       {hasNextPage && <button onClick={() => fetchNextPage()}>더 보기</button>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMyGatherings(params?: Omit<GetGatheringsParams, 'nextCursor'>) {
  return useInfiniteQuery({
    queryKey: gatheringKeys.list(params),
    queryFn: ({ pageParam }) =>
      getMyGatherings({ ...params, nextCursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  })
}
