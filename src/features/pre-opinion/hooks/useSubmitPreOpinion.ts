/**
 * @file useSubmitPreOpinion.ts
 * @description 사전 의견 공유(제출) 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'
import { topicQueryKeys } from '@/features/topics/hooks/topicQueryKeys'

import { submitPreOpinion } from '../preOpinion.api'
import type { GetPreOpinionParams, SubmitPreOpinionBody } from '../preOpinion.types'
import { preOpinionQueryKeys } from './preOpinionQueryKeys'

/**
 * 사전 의견을 공유(제출)하는 뮤테이션 훅
 *
 * @description
 * 작성한 사전 의견을 멤버들에게 공유합니다.
 * 성공 시 사전 의견 조회 쿼리를 무효화합니다.
 *
 * @example
 * ```tsx
 * const { mutate: submit, isPending } = useSubmitPreOpinion({ gatheringId, meetingId })
 *
 * submit({ review: { rating: 4.5, keywordIds: [3, 7] }, topicIds: [1, 2, 3] })
 * ```
 */
export function useSubmitPreOpinion({ gatheringId, meetingId }: GetPreOpinionParams) {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, SubmitPreOpinionBody>({
    mutationFn: (body) => submitPreOpinion(gatheringId, meetingId, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: preOpinionQueryKeys.all }),
        // confirmed 전체 무효화: 제출 후 어떤 gatheringId/meetingId 조합이 영향 받는지
        // 특정할 수 없으므로 confirmed 범위 전체를 무효화합니다.
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.confirmed() }),
      ])
    },
  })
}
