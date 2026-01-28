import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants'

export function PrivateRoute() {
  const { data: user, isLoading } = useAuth()
  const location = useLocation()

  const isOnboardingPage = location.pathname === ROUTES.ONBOARDING

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // 인증되지 않은 사용자 → 로그인 페이지로
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // 온보딩이 필요한 사용자
  if (user.needsOnboarding) {
    // 온보딩 페이지가 아니면 온보딩으로 리다이렉트
    if (!isOnboardingPage) {
      return <Navigate to={ROUTES.ONBOARDING} replace />
    }
    // 온보딩 페이지면 그대로 렌더링
    return <Outlet />
  }

  // 온보딩 완료된 사용자가 온보딩 페이지 접근 시 → 메인으로 리다이렉트
  if (isOnboardingPage) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
