import { Outlet } from 'react-router-dom'

import { Header } from './components'

/**
 * MainLayout (GNB가 있는 페이지 레이아웃)
 *
 * - 피그마 디자인 스펙:
 *   - 전체 너비: 1440px (최대)
 *   - 좌우 패딩: 120px → 컨텐츠 영역 1200px
 *   - GNB 아래 여백: 페이지별로 다름 → 각 페이지에서 직접 설정
 */
export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-layout-max px-layout-padding">
        <Outlet />
      </main>
    </>
  )
}
