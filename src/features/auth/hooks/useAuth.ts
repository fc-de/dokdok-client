import { useQuery } from '@tanstack/react-query'

import { fetchCurrentUser } from '../auth.api'

/**
 * 현재 로그인 사용자 정보를 조회하는 훅
 *
 * @description
 * - CurrentUser 타입 반환: { userId, nickname, profileImageUrl, needsOnboarding }
 * - 401 에러 시 재시도하지 않음 (로그인 페이지로 리다이렉트)
 * - 5분 동안 stale 데이터로 유지
 *
 * @example
 * ```tsx
 * const { data: user, isLoading } = useAuth()
 *
 * if (user?.needsOnboarding) {
 *   return <Navigate to="/onboarding" />
 * }
 * ```
 */
export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    retry: false, // 401 에러는 재시도하지 않음
    staleTime: 5 * 60 * 1000, // 5분
  })
}
