/**
 * @file useMeetingApprovalsCount.ts
 * @description 약속 승인 카운트 조회 훅
 */

import { useQueries } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/api/types'
import { getMeetingApprovals } from '@/features/meetings/meetings.api'
import type { MeetingApprovalItem } from '@/features/meetings/meetings.types'

import { meetingQueryKeys } from './meetingQueryKeys'

/**
 * 약속 승인 카운트 일괄 조회 훅
 *
 * @description
 * PENDING과 CONFIRMED 상태의 카운트를 병렬로 조회합니다.
 * size=1로 요청하여 totalCount만 효율적으로 가져옵니다.
 * 두 개의 쿼리를 useQueries로 한 번에 처리하여 코드 간결성을 높입니다.
 *
 * @param gatheringId - 모임 식별자 (유효하지 않은 경우 쿼리 비활성화)
 *
 * @returns 카운트 및 로딩/에러 상태 객체
 * - pendingCount: PENDING 상태 카운트
 * - confirmedCount: CONFIRMED 상태 카운트
 * - isPendingLoading: PENDING 로딩 상태
 * - isConfirmedLoading: CONFIRMED 로딩 상태
 * - isLoading: 둘 중 하나라도 로딩 중인지 여부
 * - pendingError: PENDING 에러 객체
 * - confirmedError: CONFIRMED 에러 객체
 * - isError: 둘 중 하나라도 에러가 발생했는지 여부
 *
 * @example
 * const { pendingCount, confirmedCount, isLoading, isError } = useMeetingApprovalsCount(1)
 */
export const useMeetingApprovalsCount = (gatheringId: number) => {
  const isValidGatheringId = !Number.isNaN(gatheringId) && gatheringId > 0

  const results = useQueries({
    queries: [
      {
        queryKey: meetingQueryKeys.approvalCount(gatheringId, 'PENDING'),
        queryFn: () =>
          getMeetingApprovals({
            gatheringId,
            status: 'PENDING',
            page: 0,
            size: 1,
          }),
        enabled: isValidGatheringId,
        select: (data: PaginatedResponse<MeetingApprovalItem>) => data.totalCount,
        gcTime: 10 * 60 * 1000,
      },
      {
        queryKey: meetingQueryKeys.approvalCount(gatheringId, 'CONFIRMED'),
        queryFn: () =>
          getMeetingApprovals({
            gatheringId,
            status: 'CONFIRMED',
            page: 0,
            size: 1,
          }),
        enabled: isValidGatheringId,
        select: (data: PaginatedResponse<MeetingApprovalItem>) => data.totalCount,
        gcTime: 10 * 60 * 1000,
      },
    ],
  })

  return {
    pendingCount: results[0].data,
    confirmedCount: results[1].data,
    isPendingLoading: results[0].isLoading,
    isConfirmedLoading: results[1].isLoading,
    isLoading: results[0].isLoading || results[1].isLoading,
    pendingError: results[0].error,
    confirmedError: results[1].error,
    isError: results[0].isError || results[1].isError,
  }
}
