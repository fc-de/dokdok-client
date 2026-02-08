import { Outlet } from 'react-router-dom'

import { Header } from './components'

/**
 * FullWidthLayout (전체 너비 레이아웃)
 *
 * - MainLayout과 다르게 main에 패딩/max-width를 적용하지 않음
 * - 페이지 내부에서 sticky 헤더가 전체 너비를 사용할 수 있도록 함
 * - 컨텐츠 영역 패딩은 페이지 컴포넌트에서 직접 처리
 */
export default function FullWidthLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
