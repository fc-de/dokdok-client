/**
 * @file usePreOpinion.ts
 * @description 사전 의견 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import { getPreOpinion } from '@/features/pre-opinion/preOpinion.api'
import type { GetPreOpinionResponse } from '@/features/pre-opinion/preOpinion.types'

import { preOpinionQueryKeys } from './preOpinionQueryKeys'

/**
 * 사전 의견 조회 훅
 *
 * @description
 * TanStack Query를 사용하여 사전 의견 정보를 조회합니다.
 * 책 정보와 주제별 사전 의견 내용을 포함합니다.
 *
 * @param meetingId - 약속 ID
 *
 * @returns TanStack Query 결과 객체
 *
 * @example
 * ```tsx
 * const { data, isLoading } = usePreOpinion(1)
 * ```
 */
export const usePreOpinion = (meetingId: number) => {
  const isValidMeetingId = !Number.isNaN(meetingId) && meetingId > 0

  return useQuery<GetPreOpinionResponse>({
    queryKey: preOpinionQueryKeys.detail(meetingId),
    queryFn: () => getPreOpinion(meetingId),
    enabled: isValidMeetingId,
    gcTime: 10 * 60 * 1000,
  })
}
