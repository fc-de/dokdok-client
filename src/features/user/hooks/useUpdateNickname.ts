import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api'

import { updateNickname } from '../user.api'
import type { User } from '../user.types'
import { userQueryKeys } from './userQueryKeys'

/**
 * 닉네임 수정 mutation 훅
 *
 * @description
 * - 성공 시 프로필 캐시를 무효화하여 최신 데이터를 다시 가져옵니다
 */
export function useUpdateNickname() {
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, string>({
    mutationFn: (nickname) => updateNickname(nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })
    },
  })
}
