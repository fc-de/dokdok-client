import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

import { completeOnboarding } from '../user.api'

/**
 * 온보딩 완료 (닉네임 설정) mutation 훅
 *
 * @description
 * - 신규 사용자의 닉네임을 설정하고 온보딩을 완료합니다
 * - 성공 시 auth 쿼리를 무효화하여 needsOnboarding 상태를 갱신합니다
 * - 성공 후 홈 페이지로 자동 리다이렉트됩니다
 *
 * @example
 * ```tsx
 * const { mutate, isPending, error } = useOnboarding()
 *
 * const handleSubmit = () => {
 *   mutate(nickname)
 * }
 * ```
 */
type OnboardingInput = {
  nickname: string
  profileImage?: File
}

export function useOnboarding() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ nickname, profileImage }: OnboardingInput) =>
      completeOnboarding(nickname, profileImage),
    onSuccess: () => {
      // auth 쿼리 무효화하여 needsOnboarding 상태 갱신
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      // 메인 페이지로 리다이렉트
      navigate(ROUTES.HOME)
    },
  })
}
