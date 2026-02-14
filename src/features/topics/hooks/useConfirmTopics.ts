/**
 * @file useConfirmTopics.ts
 * @description 주제 확정 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'
import { meetingQueryKeys } from '@/features/meetings/hooks/meetingQueryKeys'

import { confirmTopics } from '../topics.api'
import type { ConfirmTopicsParams, ConfirmTopicsResponse } from '../topics.types'
import { topicQueryKeys } from './topicQueryKeys'

/**
 * 주제 확정 mutation 훅
 *
 * @description
 * 선택한 주제들을 순서대로 확정하고 관련 쿼리 캐시를 무효화합니다.
 * - 제안된 주제 리스트 캐시 무효화
 * - 확정된 주제 리스트 캐시 무효화
 *
 * @example
 * ```tsx
 * const confirmMutation = useConfirmTopics()
 * confirmMutation.mutate(
 *   { gatheringId: 1, meetingId: 2, topicIds: [3, 1, 2] },
 *   {
 *     onSuccess: () => {
 *       console.log('주제가 확정되었습니다.')
 *     },
 *     onError: (error) => {
 *       console.error('확정 실패:', error.userMessage)
 *     },
 *   }
 * )
 * ```
 */
export const useConfirmTopics = () => {
  const queryClient = useQueryClient()

  return useMutation<ConfirmTopicsResponse, ApiError, ConfirmTopicsParams>({
    mutationFn: (params: ConfirmTopicsParams) => confirmTopics(params),
    onSuccess: (_, variables) => {
      // 제안된 주제 무효화
      queryClient.invalidateQueries({
        queryKey: topicQueryKeys.proposedList({
          gatheringId: variables.gatheringId,
          meetingId: variables.meetingId,
        }),
      })
      // 확정된 주제 무효화
      queryClient.invalidateQueries({
        queryKey: topicQueryKeys.confirmedList({
          gatheringId: variables.gatheringId,
          meetingId: variables.meetingId,
        }),
      })
      // 약속 상세 무효화
      queryClient.invalidateQueries({
        queryKey: meetingQueryKeys.detail(variables.meetingId),
      })
    },
  })
}
