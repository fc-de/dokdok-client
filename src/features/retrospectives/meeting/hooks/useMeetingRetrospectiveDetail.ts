/**
 * @file useMeetingRetrospectiveDetail.ts
 * @description 약속회고 상세 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getMeetingRetrospectiveDetail } from '../retrospectives.api'
import type { MeetingRetrospectiveDetailResponse } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

/**
 * 약속회고 상세 조회 훅
 *
 * @description
 * TanStack Query의 useQuery를 사용하여 발행된 약속회고의 상세 내용을 조회합니다.
 * 약속 정보, 모임 정보, 주제별 요약 및 주요 포인트를 포함합니다.
 *
 * @param meetingId - 약속 식별자
 *
 * @returns TanStack Query 결과 객체
 */
export const useMeetingRetrospectiveDetail = (meetingId: number) => {
  return useQuery<MeetingRetrospectiveDetailResponse, ApiError>({
    queryKey: retrospectiveQueryKeys.detail(meetingId),
    queryFn: () => getMeetingRetrospectiveDetail({ meetingId }),
    enabled: meetingId > 0,
  })
}
