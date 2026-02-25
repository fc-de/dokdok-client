/**
 * @file useDeletePersonalRetrospective.ts
 * @description 개인 회고 삭제 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

import { deletePersonalRetrospective } from '../personalRetrospective.api'
import { personalRetrospectiveQueryKeys } from './personalRetrospectiveQueryKeys'

/**
 * 개인 회고 삭제 mutation 훅
 *
 * @description
 * 작성된 개인 회고를 삭제합니다.
 * 성공 시 해당 약속의 개인 회고 관련 캐시를 모두 무효화합니다.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeletePersonalRetrospective()
 * mutate(meetingId)
 * ```
 */
export function useDeletePersonalRetrospective() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, number>({
    mutationFn: (meetingId) => deletePersonalRetrospective(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: personalRetrospectiveQueryKeys.all,
      })
    },
  })
}
