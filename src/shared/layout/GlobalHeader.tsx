import { useLocation } from 'react-router-dom'

import { shouldHideGlobalHeaderOnMobile } from '@/routes/routeLayoutPolicy'
import { cn } from '@/shared/lib/utils'

import { Header } from './components'

// 전역 Header의 렌더링 정책을 route 설정과 연결하는 wrapper
export default function GlobalHeader() {
  const location = useLocation()
  const hideOnMobile = shouldHideGlobalHeaderOnMobile(location.pathname, location.search)

  return <Header className={cn(hideOnMobile && 'max-lg:hidden')} />
}
