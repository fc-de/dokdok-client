import { Bell } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import { MyPageDropdown, useUserProfile } from '@/features/user'
import UserAvatarIcon from '@/shared/assets/icon/UserAvatar.svg'
import LogoIcon from '@/shared/assets/images/logo-icon.png'
import LogoText from '@/shared/assets/images/logo-text.png'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui'

const NAV_ITEMS = [
  { label: '홈', path: ROUTES.HOME },
  { label: '내 책장', path: ROUTES.BOOKS },
  { label: '독서모임', path: ROUTES.GATHERINGS },
] as const

export default function Header() {
  const location = useLocation()
  const [isMyPageOpen, setIsMyPageOpen] = useState(false)

  // 초대 페이지에서는 비로그인 사용자도 접근 가능
  // useAuth로 로그인 상태 확인 후, 로그인 시에만 useUserProfile 호출
  const isInvitePage = location.pathname.startsWith(ROUTES.INVITE_BASE)
  const { data: authUser } = useAuth()
  const isLoggedIn = !!authUser

  // 초대 페이지 + 비로그인이면 프로필 API 호출 안함
  const { data: user } = useUserProfile({ enabled: !isInvitePage || isLoggedIn })

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

          {/* 프로필 아바타 + 마이페이지 드롭다운 */}
          <Popover
            open={isMyPageOpen}
            onOpenChange={(open) => {
              // 초대 페이지 + 비로그인이면 드롭다운 열지 않음
              if (isInvitePage && !isLoggedIn) return
              setIsMyPageOpen(open)
            }}
          >
            <PopoverTrigger asChild>
              <button type="button" className="cursor-pointer">
                <Avatar className="size-8">
                  <AvatarImage src={user?.profileImageUrl ?? ''} alt="프로필 이미지" />
                  <AvatarFallback>
                    <img src={UserAvatarIcon} alt="기본 프로필 이미지" className="size-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={16} className="w-auto border-0 p-0">
              <MyPageDropdown onClose={() => setIsMyPageOpen(false)} />
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </header>
  )
}
