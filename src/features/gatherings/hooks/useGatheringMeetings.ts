import { useQuery } from '@tanstack/react-query'

import { getGatheringMeetings } from '../gatherings.api'
import type { MeetingFilter } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

const DEFAULT_PAGE_SIZE = 50

interface UseGatheringMeetingsOptions {
  gatheringId: number
  filter?: MeetingFilter
  size?: number
}

/**
 * 모임 약속 목록 조회 훅 (페이지 기반)
 *
 * @param options - 조회 옵션
 * @param options.gatheringId - 모임 ID
 * @param options.filter - 필터 (기본: ALL)
 * @param options.size - 페이지 크기 (기본: 50)
 * @returns 약속 목록 쿼리 결과
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGatheringMeetings({
 *   gatheringId: 1,
 *   filter: 'UPCOMING',
 * })
 *
 * const meetings = data?.items ?? []
 * ```
 */
export const useGatheringMeetings = ({
  gatheringId,
  filter = 'ALL',
  size = DEFAULT_PAGE_SIZE,
}: UseGatheringMeetingsOptions) => {
  return useQuery({
    queryKey: [...gatheringQueryKeys.meetingsByFilter(gatheringId, filter), size],
    queryFn: async () => {
      const response = await getGatheringMeetings({
        gatheringId,
        filter,
        size,
        page: 0,
      })
      return response.data
    },
    enabled: gatheringId > 0,
  })
}
