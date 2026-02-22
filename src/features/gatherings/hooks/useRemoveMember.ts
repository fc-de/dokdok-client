import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { removeMember } from '../gatherings.api'
import { gatheringQueryKeys } from './gatheringQueryKeys'

type RemoveMemberVariables = {
  gatheringId: number
  userId: number
}

/**
 * 멤버 삭제(강퇴) mutation 훅
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<null>, ApiError, RemoveMemberVariables>({
    mutationFn: ({ gatheringId, userId }) => removeMember(gatheringId, userId),
    onSuccess: (_, { gatheringId }) => {
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.detail(gatheringId) })
    },
  })
}
