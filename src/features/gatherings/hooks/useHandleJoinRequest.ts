import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { handleJoinRequest } from '../gatherings.api'
import type { ApproveType } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

type HandleJoinRequestVariables = {
  gatheringId: number
  memberId: number
  approveType: ApproveType
}

/**
 * 가입 요청 승인/거절 mutation 훅
 */
export const useHandleJoinRequest = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<null>, ApiError, HandleJoinRequestVariables>({
    mutationFn: ({ gatheringId, memberId, approveType }) =>
      handleJoinRequest(gatheringId, memberId, approveType),
    onSuccess: (_, { gatheringId }) => {
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.detail(gatheringId) })
    },
  })
}
