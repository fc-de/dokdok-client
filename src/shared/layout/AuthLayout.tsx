import { Outlet } from 'react-router-dom'

/**
 * 인증 관련 페이지 레이아웃
 *
 * @description
 * - LoginPage와 OnboardingPage의 공통 레이아웃 제공
 */
export default function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-grey-100">
      <Outlet />
    </main>
  )
}
