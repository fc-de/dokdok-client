/**
 * @file usePersonalRetrospectiveEditForm.ts
 * @description 개인 회고 수정 폼 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getPersonalRetrospectiveEditForm } from '../personalRetrospective.api'
import type { GetPersonalRetrospectiveEditFormResponse } from '../personalRetrospective.types'
import { personalRetrospectiveQueryKeys } from './personalRetrospectiveQueryKeys'

/**
 * 개인 회고 수정 폼 조회 훅
 *
 * @description
 * 수정 화면에 채워 넣을 기존 저장값을 조회합니다.
 *
 * @param meetingId - 약속 ID
 * @param enabled - 쿼리 활성화 여부 (수정 모드일 때만 true)
 *
 * @example
 * ```tsx
 * const { data, isLoading } = usePersonalRetrospectiveEditForm(meetingId, isEditMode)
 * ```
 */
export const usePersonalRetrospectiveEditForm = (meetingId: number, enabled: boolean) => {
  const isValid = !Number.isNaN(meetingId) && meetingId > 0

  return useQuery<GetPersonalRetrospectiveEditFormResponse, ApiError>({
    queryKey: personalRetrospectiveQueryKeys.editForm(meetingId),
    queryFn: () => getPersonalRetrospectiveEditForm(meetingId),
    enabled: isValid && enabled,
    gcTime: 0,
    staleTime: 0,
  })
}
