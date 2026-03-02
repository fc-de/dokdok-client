import { Outlet } from 'react-router-dom'

/**
 * RootLayout (앱 전체 래퍼)
 *
 * - 전역 관심사만 담당 (Provider, 에러바운더리, 토스트 등)
 * - 시각적 레이아웃은 MainLayout, AuthLayout에서 담당
 */
export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}
