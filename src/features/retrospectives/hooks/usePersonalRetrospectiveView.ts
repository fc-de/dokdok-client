/**
 * @file usePersonalRetrospectiveView.ts
 * @description 개인 회고 뷰 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getPersonalRetrospectiveView } from '../personalRetrospective.api'
import type { GetPersonalRetrospectiveViewResponse } from '../personalRetrospective.types'
import { personalRetrospectiveQueryKeys } from './personalRetrospectiveQueryKeys'

/**
 * 개인 회고 뷰 조회 훅
 *
 * @description
 * 작성 완료된 개인 회고를 조회합니다. (바뀐 나의 생각, 타인의 관점, 자유 기록)
 *
 * @param meetingId - 약속 ID
 *
 * @example
 * ```tsx
 * const { data, isLoading } = usePersonalRetrospectiveView(meetingId)
 * ```
 */
export const usePersonalRetrospectiveView = (meetingId: number) => {
  const isValid = !Number.isNaN(meetingId) && meetingId > 0

  return useQuery<GetPersonalRetrospectiveViewResponse, ApiError>({
    queryKey: personalRetrospectiveQueryKeys.view(meetingId),
    queryFn: () => getPersonalRetrospectiveView(meetingId),
    enabled: isValid,
    gcTime: 10 * 60 * 1000,
  })
}
