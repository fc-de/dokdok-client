import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '@/api'
import { authQueryKeys } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'

import { completeOnboarding } from '../user.api'
import type { OnboardingInput, User } from '../user.types'
import { userQueryKeys } from './userQueryKeys'

/**
 * 온보딩 완료 (닉네임 설정) mutation 훅
 *
 * @description
 * - 신규 사용자의 닉네임을 설정하고 온보딩을 완료합니다
 * - 성공 시 user 프로필 캐시 갱신 + auth 캐시 무효화 (needsOnboarding 갱신)
 * - 성공 후 홈 페이지로 자동 리다이렉트됩니다
 *
 * @example
 * ```tsx
 * const { mutate, isPending, error } = useOnboarding()
 *
 * const handleSubmit = () => {
 *   mutate({ nickname, profileImage })
 * }
 * ```
 */
export function useOnboarding() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, OnboardingInput>({
    mutationFn: ({ nickname, profileImage }) => completeOnboarding(nickname, profileImage),
    onSuccess: async () => {
      // auth 캐시 무효화 (needsOnboarding: false로 갱신)
      // 프로필 캐시 무효화하여 홈에서 새로 fetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.me() }),
        queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() }),
      ])
      navigate(ROUTES.HOME)
    },
  })
}
