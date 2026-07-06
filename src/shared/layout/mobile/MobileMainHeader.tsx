import { Bell } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import { MyPageDropdown, useUserProfile } from '@/features/user'
import UserAvatarIcon from '@/shared/assets/icon/UserAvatar.svg'
import LogoIcon from '@/shared/assets/images/logo-icon.png'
import LogoText from '@/shared/assets/images/logo-text.png'
import { ROUTES } from '@/shared/constants/routes'
import { useScrollShadow } from '@/shared/hooks'
import { showToast } from '@/shared/lib/toast'
import { cn } from '@/shared/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui'

export type MobileMainHeaderProps = {
  onNotificationClick?: () => void
  preview?: boolean
  className?: string
}

export default function MobileMainHeader({
  onNotificationClick,
  preview = false,
  className,
}: MobileMainHeaderProps) {
  const [isMyPageOpen, setIsMyPageOpen] = useState(false)
  const isScrolled = useScrollShadow()
  const { data: authUser } = useAuth()
  const isLoggedIn = !!authUser
  const { data: user } = useUserProfile({ enabled: isLoggedIn })

  return (
    <header
      className={cn(
        preview ? 'relative z-10 bg-white' : 'fixed inset-x-0 top-0 z-50 bg-white lg:hidden',
        'transition-shadow',
        isScrolled && 'shadow-drop',
        className
      )}
    >
      <div className="flex h-13 items-center justify-between px-5">
        <Link to={ROUTES.HOME} className="flex items-center gap-xsmall" aria-label="홈으로 이동">
          <img src={LogoIcon} alt="" className="h-5.25 w-6.75" />
          <img src={LogoText} alt="독크독크" className="h-5.25 w-19" />
        </Link>

        <div className="flex items-center">
          <button
            type="button"
            className="flex size-11 -mr-0.5 items-center justify-center rounded-full text-grey-600 transition-colors hover:text-grey-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={onNotificationClick ?? (() => showToast('준비중입니다.'))}
            aria-label="알림"
          >
            <Bell aria-hidden className="size-6 fill-current stroke-current" />
          </button>

          <Popover open={isMyPageOpen} onOpenChange={setIsMyPageOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex size-11 -mr-2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="마이페이지 메뉴"
              >
                <Avatar className="size-7">
                  <AvatarImage src={user?.profileImageUrl ?? ''} alt="프로필 이미지" />
                  <AvatarFallback>
                    <img src={UserAvatarIcon} alt="기본 프로필 이미지" className="size-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            {isLoggedIn && (
              <PopoverContent align="end" sideOffset={8} className="w-auto border-0 p-0">
                <MyPageDropdown onClose={() => setIsMyPageOpen(false)} />
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>
    </header>
  )
}
