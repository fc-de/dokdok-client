/**
 * @file useMeetingApprovals.ts
 * @description 약속 승인 리스트 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'
import type { PaginatedResponse } from '@/api/types'
import {
  getMeetingApprovals,
  type GetMeetingApprovalsParams,
  type MeetingApprovalItemType,
} from '@/features/meetings'

import { meetingQueryKeys } from './meetingQueryKeys'

/**
 * 약속 승인 리스트 조회 훅
 *
 * @description
 * TanStack Query를 사용하여 약속 승인 리스트를 조회합니다.
 * 페이지네이션과 상태(PENDING/CONFIRMED) 필터링을 지원합니다.
 *
 * @param params - 조회 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.status - 약속 상태 (PENDING: 확정 대기, CONFIRMED: 확정 완료)
 * @param params.page - 페이지 번호 (기본값: 0)
 * @param params.size - 페이지 크기 (기본값: 10)
 * @param params.sort - 정렬 기준 배열
 *
 * @returns TanStack Query 결과 객체
 *
 * @example
 * const { data, isLoading } = useMeetingApprovals({
 *   gatheringId: 1,
 *   status: 'PENDING',
 *   page: 0,
 *   size: 10,
 * })
 */
export const useMeetingApprovals = (params: GetMeetingApprovalsParams) => {
  const isValidGatheringId =
    !Number.isNaN(params.gatheringId) && params.gatheringId > 0

  return useQuery<PaginatedResponse<MeetingApprovalItemType>, ApiError>({
    queryKey: meetingQueryKeys.approvalList(params),
    queryFn: () => getMeetingApprovals(params),
    // gatheringId가 유효할 때만 쿼리 실행
    enabled: isValidGatheringId,
    // 캐시 데이터 10분간 유지 (전역 설정 staleTime: 5분 사용)
    gcTime: 10 * 60 * 1000,
  })
}
