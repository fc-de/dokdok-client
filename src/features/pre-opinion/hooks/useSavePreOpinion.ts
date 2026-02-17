/**
 * @file useSavePreOpinion.ts
 * @description 사전 의견 저장 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { savePreOpinion } from '../preOpinion.api'
import type { SavePreOpinionBody, SavePreOpinionParams } from '../preOpinion.types'
import { preOpinionQueryKeys } from './preOpinionQueryKeys'

/**
 * 사전 의견을 저장하는 뮤테이션 훅
 *
 * @description
 * updatedAt이 null이면 최초 저장(POST), 값이 있으면 수정(PATCH)으로 요청합니다.
 * 성공 시 사전 의견 조회 쿼리를 무효화합니다.
 *
 * @example
 * ```tsx
 * const { mutate: save, isPending } = useSavePreOpinion({
 *   gatheringId,
 *   meetingId,
 *   isFirstSave: preOpinion.preOpinion.updatedAt === null,
 * })
 *
 * save({ review: { rating: 4.5, keywordIds: [3, 7] }, answers: [{ topicId: 1, content: '...' }] })
 * ```
 */
export function useSavePreOpinion(params: SavePreOpinionParams) {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, SavePreOpinionBody>({
    mutationFn: (body) => savePreOpinion(params, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preOpinionQueryKeys.all })
    },
  })
}
