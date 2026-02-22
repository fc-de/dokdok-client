import { useQuery } from '@tanstack/react-query'

import { getGatheringDetail } from '../gatherings.api'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 모임 상세 정보 조회 훅
 *
 * @param gatheringId - 모임 ID
 * @returns 모임 상세 정보 쿼리 결과
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useGatheringDetail(gatheringId)
 *
 * if (data) {
 *   const { gatheringName, currentUserRole, members } = data
 * }
 * ```
 */
export const useGatheringDetail = (gatheringId: number) => {
  return useQuery({
    queryKey: gatheringQueryKeys.detail(gatheringId),
    queryFn: async () => {
      const response = await getGatheringDetail(gatheringId)
      return response.data
    },
    enabled: gatheringId > 0,
  })
}
