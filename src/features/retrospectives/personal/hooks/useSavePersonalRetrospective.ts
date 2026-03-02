/**
 * @file useSavePersonalRetrospective.ts
 * @description 개인 회고 저장 mutation 훅
 */

import { useMutation } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

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
  return useMutation<void, ApiError, SavePersonalRetrospectiveParams>({
    mutationFn: (params) => savePersonalRetrospective(params),
  })
}
