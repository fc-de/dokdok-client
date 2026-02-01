import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants'

/**
 * 비로그인 사용자만 접근 가능한 라우트
 *
 * @description
 * 이미 로그인된 사용자가 로그인 페이지 등에 접근하면
 * 홈 페이지로 리다이렉트합니다.
 */
export function PublicRoute() {
  const { data: user, isLoading, isError } = useAuth()

  // 로딩 중 또는 에러(401) → 로그인 페이지 표시
  if (isLoading || isError || !user) {
    return <Outlet />
  }

  // 이미 로그인된 사용자 → 홈으로 리다이렉트
  return <Navigate to={ROUTES.HOME} replace />
}
