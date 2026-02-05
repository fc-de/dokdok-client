import { useInfiniteQuery } from '@tanstack/react-query'

import { getGatheringMeetings } from '../gatherings.api'
import type { MeetingCursor, MeetingFilter } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

const DEFAULT_PAGE_SIZE = 10

interface UseGatheringMeetingsOptions {
  gatheringId: number
  filter?: MeetingFilter
}

/**
 * 모임 약속 목록 조회 훅 (무한 스크롤)
 *
 * @param options - 조회 옵션
 * @param options.gatheringId - 모임 ID
 * @param options.filter - 필터 (기본: ALL)
 * @returns 약속 목록 무한 쿼리 결과
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGatheringMeetings({
 *   gatheringId: 1,
 *   filter: 'UPCOMING',
 * })
 *
 * const meetings = data?.pages.flatMap(page => page.items) ?? []
 * ```
 */
export const useGatheringMeetings = ({
  gatheringId,
  filter = 'ALL',
}: UseGatheringMeetingsOptions) => {
  return useInfiniteQuery({
    queryKey: gatheringQueryKeys.meetingsByFilter(gatheringId, filter),
    queryFn: async ({ pageParam }) => {
      const response = await getGatheringMeetings({
        gatheringId,
        filter,
        size: DEFAULT_PAGE_SIZE,
        startDateTime: pageParam?.startDateTime,
        meetingId: pageParam?.meetingId,
      })
      return response.data
    },
    initialPageParam: undefined as MeetingCursor | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext || !lastPage.nextCursor) return undefined
      return lastPage.nextCursor
    },
    enabled: gatheringId > 0,
  })
}
