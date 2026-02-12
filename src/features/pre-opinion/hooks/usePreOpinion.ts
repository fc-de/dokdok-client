/**
 * @file usePreOpinion.ts
 * @description 사전 의견 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import { getPreOpinion } from '@/features/pre-opinion/preOpinion.api'
import type {
  GetPreOpinionParams,
  GetPreOpinionResponse,
} from '@/features/pre-opinion/preOpinion.types'

import { preOpinionQueryKeys } from './preOpinionQueryKeys'

/**
 * 사전 의견 조회 훅
 *
 * @description
 * TanStack Query를 사용하여 사전 의견 정보를 조회합니다.
 * 책 정보, 리뷰(평가), 주제별 사전 의견 내용을 포함합니다.
 *
 * @param params - 모임 ID와 약속 ID
 *
 * @returns TanStack Query 결과 객체
 *
 * @example
 * ```tsx
 * const { data, isLoading } = usePreOpinion({ gatheringId: 1, meetingId: 2 })
 * ```
 */
export const usePreOpinion = (params: GetPreOpinionParams) => {
  const { gatheringId, meetingId } = params
  const isValidParams =
    !Number.isNaN(gatheringId) &&
    gatheringId > 0 &&
    !Number.isNaN(meetingId) &&
    meetingId > 0

  return useQuery<GetPreOpinionResponse>({
    queryKey: preOpinionQueryKeys.detail(params),
    queryFn: () => getPreOpinion(params),
    enabled: isValidParams,
    gcTime: 10 * 60 * 1000,
  })
}
