/**
 * @file useMeetingDetail.ts
 * @description 약속 상세 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'
import { getMeetingDetail, type GetMeetingDetailResponse } from '@/features/meetings'

import { meetingQueryKeys } from './meetingQueryKeys'

/**
 * 약속 상세 조회 훅
 *
 * @description
 * TanStack Query를 사용하여 약속의 상세 정보를 조회합니다.
 * 모임 정보, 책 정보, 일정, 장소, 참가자 목록 등을 포함합니다.
 *
 * @param meetingId - 약속 ID
 *
 * @returns TanStack Query 결과 객체
 *
 */
export const useMeetingDetail = (meetingId: number) => {
  const isValidMeetingId = !Number.isNaN(meetingId) && meetingId > 0

  // 유효하지 않은 meetingId는 detail 키 대신 details 키 사용
  // NaN이 null로 직렬화되어 캐시 충돌하는 것을 방지
  const queryKey = isValidMeetingId
    ? meetingQueryKeys.detail(meetingId)
    : meetingQueryKeys.details()

  return useQuery<GetMeetingDetailResponse, ApiError>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: () => getMeetingDetail(meetingId),
    // meetingId가 유효할 때만 쿼리 실행
    enabled: isValidMeetingId,
    // 캐시 데이터 10분간 유지 (전역 설정 staleTime: 5분 사용)
    gcTime: 10 * 60 * 1000,
  })
}
