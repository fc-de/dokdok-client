/**
 * @file useUpdateMeeting.ts
 * @description 약속 수정 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'
import type { ApiResponse } from '@/api/types'
import {
  updateMeeting,
  type UpdateMeetingRequest,
  type UpdateMeetingResponse,
} from '@/features/meetings'

import { meetingQueryKeys } from './meetingQueryKeys'

type UpdateMeetingVariables = {
  meetingId: number
  data: UpdateMeetingRequest
}

/**
 * 약속 수정 mutation 훅
 *
 * @description
 * 약속 정보를 수정하고 관련 쿼리 캐시를 무효화합니다.
 */
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<UpdateMeetingResponse>, ApiError, UpdateMeetingVariables>({
    mutationFn: ({ meetingId, data }: UpdateMeetingVariables) => updateMeeting(meetingId, data),
    onSuccess: (_, variables) => {
      // 수정된 약속의 상세 정보 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: meetingQueryKeys.detail(variables.meetingId),
      })

      // 약속 승인 관련 모든 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: meetingQueryKeys.approvals(),
      })
    },
  })
}
