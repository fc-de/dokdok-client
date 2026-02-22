import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { deleteGathering } from '../gatherings.api'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 모임 삭제 mutation 훅
 */
export const useDeleteGathering = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<null>, ApiError, number>({
    mutationFn: deleteGathering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.all })
    },
  })
}
