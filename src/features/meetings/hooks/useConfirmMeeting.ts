/**
 * @file useConfirmMeeting.ts
 * @description 약속 승인 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError, ApiResponse } from '@/api'
import { gatheringQueryKeys } from '@/features/gatherings'
import { confirmMeeting, type ConfirmMeetingResponse } from '@/features/meetings'

import { meetingQueryKeys } from './meetingQueryKeys'

/**
 * 약속 승인 mutation 훅
 *
 * @description
 * 약속을 승인하고 관련 쿼리 캐시를 무효화합니다.
 * - 약속 승인 리스트 캐시 무효화
 * - 약속 승인 카운트 캐시 무효화
 * - 모임 약속 리스트 캐시 무효화
 *
 * @example
 * const confirmMutation = useConfirmMeeting(gatheringId)
 * confirmMutation.mutate(meetingId)
 */
export const useConfirmMeeting = (gatheringId: number) => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<ConfirmMeetingResponse>, ApiError, number>({
    mutationFn: (meetingId: number) => confirmMeeting(meetingId),
    onSuccess: () => {
      // 약속 승인 관련 모든 캐시 무효화 (리스트 + 카운트)
      queryClient.invalidateQueries({
        queryKey: meetingQueryKeys.approvals(),
      })
      // 모임 약속 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.meetings(gatheringId) })
    },
  })
}
