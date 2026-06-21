/**
 * @file useSavePersonalRetrospective.ts
 * @description 개인 회고 저장 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'
import { myMeetingQueryKeys } from '@/features/meetings/hooks/myMeetingQueryKeys'

import { savePersonalRetrospective } from '../personalRetrospective.api'
import type { SavePersonalRetrospectiveParams } from '../personalRetrospective.types'

/**
 * 개인 회고 저장 mutation 훅
 *
 * @description
 * 작성한 개인 회고를 서버에 저장합니다.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useSavePersonalRetrospective()
 * mutate({ meetingId, body })
 * ```
 */
export function useSavePersonalRetrospective() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, SavePersonalRetrospectiveParams>({
    mutationFn: (params) => savePersonalRetrospective(params),
    onSuccess: () => {
      // 홈 '내 약속' 카드의 개인회고 작성여부(hasPersonalRetrospective) 갱신
      queryClient.invalidateQueries({ queryKey: myMeetingQueryKeys.all })
    },
  })
}
