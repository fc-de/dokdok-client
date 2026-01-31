import { Bell } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import LogoIcon from '@/shared/assets/images/logo-icon.png'
import LogoText from '@/shared/assets/images/logo-text.png'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'

const NAV_ITEMS = [
  { label: '홈', path: ROUTES.HOME },
  { label: '내 책장', path: ROUTES.BOOKS },
  { label: '독서모임', path: ROUTES.GATHERINGS },
] as const

export default function Header() {
  const handleNotificationClick = () => {
    alert('준비중입니다.')
  }
  return (
    <header className="h-gnb-height bg-white">
      <nav className="mx-auto flex h-full max-w-layout-max items-center justify-between px-layout-padding">
        {/* 좌측: 로고 + 네비게이션 */}
        <div className="flex items-center gap-11.75">
          {/* 로고 */}
          <Link to={ROUTES.HOME} className="flex items-center gap-xsmall">
            <img src={LogoIcon} alt="" className="h-5.25 w-6.75" />
            <img src={LogoText} alt="독크독크" className="h-5.25 w-19" />
          </Link>

          {/* 네비게이션 */}
          <div className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn('typo-subtitle2 text-grey-700', isActive && 'font-semibold text-black')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* 우측: 알림 + 프로필 */}
        <div className="flex items-center gap-large">
          {/* 알림 아이콘 */}
          <button type="button" className="size-6 cursor-pointer" onClick={handleNotificationClick}>
            <Bell className="size-full fill-grey-600 stroke-grey-600" />
          </button>

          {/* 프로필 아바타 */}
          <Avatar className="size-8">
            <AvatarImage src="" alt="프로필" />
            <AvatarFallback />
          </Avatar>
        </div>
      </nav>
    </header>
  )
}
