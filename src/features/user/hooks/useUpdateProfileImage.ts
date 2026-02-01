import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api'

import { updateProfileImage } from '../user.api'
import type { User } from '../user.types'
import { userQueryKeys } from './userQueryKeys'

/**
 * 프로필 이미지 업로드 훅
 *
 * @description
 * - 프로필 이미지만 즉시 업로드
 * - 성공 시 user 프로필 캐시를 API 응답으로 즉시 갱신
 */
export function useUpdateProfileImage() {
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, File>({
    mutationFn: updateProfileImage,
    onSuccess: (data) => {
      queryClient.setQueryData<User>(userQueryKeys.profile(), data)
    },
  })
}
