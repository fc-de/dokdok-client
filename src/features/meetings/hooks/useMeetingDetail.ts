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
 * @example
 * const { data, isLoading, error } = useMeetingDetail(1)
 *
 * if (isLoading) return <div>로딩 중...</div>
 * if (error) return <div>에러 발생</div>
 * if (data) return <div>{data.meetingName}</div>
 */
export const useMeetingDetail = (meetingId: number) => {
  const isValidMeetingId = !Number.isNaN(meetingId) && meetingId > 0

  return useQuery<GetMeetingDetailResponse, ApiError>({
    queryKey: meetingQueryKeys.detail(meetingId),
    queryFn: () => getMeetingDetail(meetingId),
    // meetingId가 유효할 때만 쿼리 실행
    enabled: isValidMeetingId,
    // 캐시 데이터 10분간 유지 (전역 설정 staleTime: 5분 사용)
    gcTime: 10 * 60 * 1000,
  })
}
