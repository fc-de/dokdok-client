/**
 * @file useRejectMeeting.ts
 * @description 약속 거부 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError, ApiResponse } from '@/api'
import { rejectMeeting, type RejectMeetingResponse } from '@/features/meetings'

import { meetingQueryKeys } from './meetingQueryKeys'

/**
 * 약속 거부 mutation 훅
 *
 * @description
 * 약속을 거부하고 관련 쿼리 캐시를 무효화합니다.
 * - 약속 승인 리스트 캐시 무효화
 * - 약속 승인 카운트 캐시 무효화
 *
 * @example
 * const rejectMutation = useRejectMeeting()
 * rejectMutation.mutate(meetingId)
 */
export const useRejectMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<RejectMeetingResponse>, ApiError, number>({
    mutationFn: (meetingId: number) => rejectMeeting(meetingId),
    onSuccess: () => {
      // 약속 승인 관련 모든 캐시 무효화 (리스트 + 카운트)
      queryClient.invalidateQueries({
        queryKey: meetingQueryKeys.approvals(),
      })
    },
  })
}
