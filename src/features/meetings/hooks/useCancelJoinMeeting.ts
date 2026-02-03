/**
 * @file useCancelJoinMeeting.ts
 * @description 약속 참가취소 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'
import type { ApiResponse } from '@/api/types'
import { cancelJoinMeeting } from '@/features/meetings'

import { meetingQueryKeys } from './meetingQueryKeys'

/**
 * 약속 참가취소 mutation 훅
 *
 * @description
 * 약속 참가를 취소하고 관련 쿼리 캐시를 무효화합니다.
 * - 약속 상세 캐시 무효화
 *
 */
export const useCancelJoinMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<number>, ApiError, number>({
    mutationFn: (meetingId: number) => cancelJoinMeeting(meetingId),
    onSuccess: (data, variables) => {
      void data // 사용하지 않는 파라미터
      // 약속 상세 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: meetingQueryKeys.detail(variables),
      })
    },
  })
}
