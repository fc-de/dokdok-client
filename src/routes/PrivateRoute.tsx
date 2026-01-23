import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants'

export function PrivateRoute() {
  const { data: user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user.needsOnboarding) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  return <Outlet />
}
