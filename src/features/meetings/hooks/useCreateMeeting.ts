/**
 * @file useCreateMeeting.ts
 * @description 약속 생성 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'
import type { ApiResponse } from '@/api/types'
import { gatheringQueryKeys } from '@/features/gatherings'
import {
  createMeeting,
  type CreateMeetingRequest,
  type CreateMeetingResponse,
} from '@/features/meetings'

import { meetingQueryKeys } from './meetingQueryKeys'

/**
 * 약속 생성 mutation 훅
 *
 * @description
 * 새로운 약속을 생성하고 관련 쿼리 캐시를 무효화합니다.
 */
export const useCreateMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<CreateMeetingResponse>, ApiError, CreateMeetingRequest>({
    mutationFn: (data: CreateMeetingRequest) => createMeeting(data),
    onSuccess: (_data, variables) => {
      // 약속 승인 관련 모든 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: meetingQueryKeys.approvals(),
      })
      // 모임 책장 캐시 무효화 (약속 생성 시 책이 모임 책장에 추가됨)
      queryClient.invalidateQueries({
        queryKey: gatheringQueryKeys.books(variables.gatheringId),
      })
    },
  })
}
