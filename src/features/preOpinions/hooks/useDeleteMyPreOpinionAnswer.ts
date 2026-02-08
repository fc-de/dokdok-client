/**
 * @file useDeleteMyPreOpinionAnswer.ts
 * @description 내 사전 의견 삭제 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { deleteMyPreOpinionAnswer } from '../preOpinions.api'
import type { DeleteMyPreOpinionAnswerParams } from '../preOpinions.types'
import { preOpinionQueryKeys } from './preOpinionQueryKeys'

/**
 * 내 사전 의견을 삭제하는 뮤테이션 훅
 *
 * @example
 * ```tsx
 * const deleteMutation = useDeleteMyPreOpinionAnswer({ gatheringId, meetingId })
 * deleteMutation.mutate()
 * ```
 */
export function useDeleteMyPreOpinionAnswer(params: DeleteMyPreOpinionAnswerParams) {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError>({
    mutationFn: () => deleteMyPreOpinionAnswer(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preOpinionQueryKeys.answers() })
    },
  })
}
