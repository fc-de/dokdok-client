import { useQuery } from '@tanstack/react-query'

import { getMeetingTabCounts } from '../gatherings.api'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 모임 약속 탭별 카운트 조회 훅
 *
 * @param gatheringId - 모임 ID
 * @returns 탭별 약속 카운트
 *
 * @example
 * ```tsx
 * const { data: tabCounts } = useMeetingTabCounts(gatheringId)
 * // tabCounts?.all, tabCounts?.upcoming, tabCounts?.done, tabCounts?.joined
 * ```
 */
export const useMeetingTabCounts = (gatheringId: number) => {
  return useQuery({
    queryKey: gatheringQueryKeys.meetingTabCounts(gatheringId),
    queryFn: async () => {
      const response = await getMeetingTabCounts(gatheringId)
      return response.data
    },
    enabled: gatheringId > 0,
  })
}
