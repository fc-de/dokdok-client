import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { joinGathering } from '../gatherings.api'
import type { GatheringJoinResponse } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 모임 가입 신청 mutation 훅
 */
export const useJoinGathering = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<GatheringJoinResponse>, ApiError, string>({
    mutationFn: joinGathering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.all })
    },
  })
}
