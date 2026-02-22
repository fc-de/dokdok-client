/**
 * @file usePreOpinionAnswers.ts
 * @description 사전 의견 목록 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getPreOpinionAnswers } from '../preOpinions.api'
import type { GetPreOpinionAnswersParams, PreOpinionAnswersData } from '../preOpinions.types'
import { preOpinionQueryKeys } from './preOpinionQueryKeys'

/**
 * 사전 의견 목록 조회 훅
 *
 * @description
 * TanStack Query를 사용하여 약속의 사전 의견 목록을 조회합니다.
 * 멤버별 책 평가, 주제별 의견 등을 포함합니다.
 *
 * @param params - 조회 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 *
 * @returns TanStack Query 결과 객체
 */
export const usePreOpinionAnswers = (params: GetPreOpinionAnswersParams) => {
  const { gatheringId, meetingId } = params
  const isValidParams =
    !Number.isNaN(gatheringId) && gatheringId > 0 && !Number.isNaN(meetingId) && meetingId > 0

  return useQuery<PreOpinionAnswersData, ApiError>({
    queryKey: preOpinionQueryKeys.answerList({ gatheringId, meetingId }),
    queryFn: () => getPreOpinionAnswers({ gatheringId, meetingId }),
    enabled: isValidParams,
    gcTime: 10 * 60 * 1000,
  })
}
