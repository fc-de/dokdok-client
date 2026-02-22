/**
 * @file useDeleteTopic.ts
 * @description 주제 삭제 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

import { deleteTopic } from '../topics.api'
import type { DeleteTopicParams } from '../topics.types'
import { topicQueryKeys } from './topicQueryKeys'

/**
 * 주제 삭제 mutation 훅
 *
 * @description
 * 주제를 삭제하고 관련 쿼리 캐시를 무효화합니다.
 * - 제안된 주제 리스트 캐시 무효화
 *
 * @example
 * ```tsx
 * const deleteMutation = useDeleteTopic()
 * deleteMutation.mutate(
 *   { gatheringId: 1, meetingId: 2, topicId: 3 },
 *   {
 *     onSuccess: () => {
 *       console.log('주제가 삭제되었습니다.')
 *     },
 *     onError: (error) => {
 *       console.error('삭제 실패:', error.userMessage)
 *     },
 *   }
 * )
 * ```
 */
export const useDeleteTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, DeleteTopicParams>({
    mutationFn: (params: DeleteTopicParams) => deleteTopic(params),
    onSuccess: (_, variables) => {
      // 제안된 주제 무효화
      queryClient.invalidateQueries({
        queryKey: topicQueryKeys.proposedList({
          gatheringId: variables.gatheringId,
          meetingId: variables.meetingId,
        }),
      })
    },
  })
}
