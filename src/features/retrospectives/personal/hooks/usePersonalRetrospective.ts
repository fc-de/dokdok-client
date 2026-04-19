/**
 * @file usePersonalRetrospective.ts
 * @description 개인 회고 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getPersonalRetrospective } from '../personalRetrospective.api'
import type {
  GetPersonalRetrospectiveParams,
  GetPersonalRetrospectiveResponse,
} from '../personalRetrospective.types'
import { personalRetrospectiveQueryKeys } from './personalRetrospectiveQueryKeys'

/**
 * 개인 회고 조회 훅
 *
 * @description
 * TanStack Query를 사용하여 개인 회고 정보를 조회합니다.
 * 모임명, 책 정보, 내 사전 의견, 확정된 토픽, 참여 멤버 목록을 포함합니다.
 *
 * @param params - 모임 ID와 약속 ID
 *
 * @returns TanStack Query 결과 객체
 *
 * @example
 * ```tsx
 * const { data, isLoading } = usePersonalRetrospective({ gatheringId: 1, meetingId: 2 })
 * ```
 */
export const usePersonalRetrospective = (
  params: GetPersonalRetrospectiveParams,
  enabled = true
) => {
  const { meetingId } = params
  const isValidParams = !Number.isNaN(meetingId) && meetingId > 0

  return useQuery<GetPersonalRetrospectiveResponse, ApiError>({
    queryKey: personalRetrospectiveQueryKeys.detail(params),
    queryFn: () => getPersonalRetrospective(params),
    enabled: isValidParams && enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
