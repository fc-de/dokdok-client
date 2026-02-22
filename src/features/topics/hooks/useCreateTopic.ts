/**
 * @file useCreateTopic.ts
 * @description 주제 제안 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

import { createTopic } from '../topics.api'
import type { CreateTopicParams, CreateTopicResponse } from '../topics.types'
import { topicQueryKeys } from './topicQueryKeys'

/**
 * 주제 제안 mutation 훅
 *
 * @description
 * 주제를 제안하고 관련 쿼리 캐시를 무효화합니다.
 * - 제안된 주제 리스트 캐시 무효화
 *
 * @example
 * ```tsx
 * const createMutation = useCreateTopic()
 * createMutation.mutate(
 *   { gatheringId: 1, meetingId: 2, body: { title: '주제 제목', topicType: 'FREE' } },
 *   {
 *     onSuccess: () => {
 *       console.log('주제가 제안되었습니다.')
 *     },
 *     onError: (error) => {
 *       console.error('제안 실패:', error.userMessage)
 *     },
 *   }
 * )
 * ```
 */
export const useCreateTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateTopicResponse, ApiError, CreateTopicParams>({
    mutationFn: (params: CreateTopicParams) => createTopic(params),
    onSuccess: (_, variables) => {
      // 제안된 주제 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: topicQueryKeys.proposedList({
          gatheringId: variables.gatheringId,
          meetingId: variables.meetingId,
        }),
      })
    },
  })
}
