/**
 * @file useUpdatePersonalRetrospective.ts
 * @description 개인 회고 수정 mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

import { updatePersonalRetrospective } from '../personalRetrospective.api'
import type { UpdatePersonalRetrospectiveParams } from '../personalRetrospective.types'
import { personalRetrospectiveQueryKeys } from './personalRetrospectiveQueryKeys'

/**
 * 개인 회고 수정 mutation 훅
 *
 * @description
 * 작성한 개인 회고를 서버에 수정(PUT)합니다.
 * 성공 시 view 쿼리 캐시를 무효화하여 최신 데이터를 반영합니다.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdatePersonalRetrospective()
 * mutate({ meetingId, body })
 * ```
 */
export function useUpdatePersonalRetrospective() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, UpdatePersonalRetrospectiveParams>({
    mutationFn: (params) => updatePersonalRetrospective(params),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({
        queryKey: personalRetrospectiveQueryKeys.view(meetingId),
      })
    },
  })
}
