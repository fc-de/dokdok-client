import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { deleteProfileImage } from '../user.api'
import type { User } from '../user.types'
import { userQueryKeys } from './userQueryKeys'

/**
 * 프로필 이미지 삭제 훅
 *
 * @description
 * - 프로필 이미지를 기본 이미지로 초기화
 * - 성공 시 user 프로필 캐시의 profileImageUrl을 null로 설정
 */
export function useDeleteProfileImage() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<null>, ApiError, void>({
    mutationFn: deleteProfileImage,
    onSuccess: () => {
      queryClient.setQueryData<User>(userQueryKeys.profile(), (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, profileImageUrl: null }
      })
    },
  })
}
