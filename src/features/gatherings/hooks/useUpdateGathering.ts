import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { updateGathering } from '../gatherings.api'
import type { GatheringUpdateRequest, GatheringUpdateResponse } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

type UpdateGatheringVariables = {
  gatheringId: number
  data: GatheringUpdateRequest
}

/**
 * 모임 정보 수정 mutation 훅
 */
export const useUpdateGathering = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<GatheringUpdateResponse>, ApiError, UpdateGatheringVariables>({
    mutationFn: ({ gatheringId, data }) => updateGathering(gatheringId, data),
    onSuccess: (_, { gatheringId }) => {
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.detail(gatheringId) })
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.lists() })
    },
  })
}
