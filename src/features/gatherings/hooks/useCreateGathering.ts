import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { createGathering } from '../gatherings.api'
import type { CreateGatheringRequest, CreateGatheringResponse } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 모임 생성 mutation 훅
 */
export const useCreateGathering = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<CreateGatheringResponse>, ApiError, CreateGatheringRequest>({
    mutationFn: createGathering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.all })
    },
  })
}
