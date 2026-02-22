import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getFavoriteGatherings } from '../gatherings.api'
import type { FavoriteGatheringListResponse } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 즐겨찾기 모임 목록 조회 훅
 */
export const useFavoriteGatherings = () => {
  return useQuery<FavoriteGatheringListResponse, ApiError>({
    queryKey: gatheringQueryKeys.favorites(),
    queryFn: async () => {
      const response = await getFavoriteGatherings()
      return response.data
    },
  })
}
