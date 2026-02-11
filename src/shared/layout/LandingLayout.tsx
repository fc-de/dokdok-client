import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import LandingBg from '@/shared/assets/images/landing-bg.png'
import LogoIcon from '@/shared/assets/images/logo-icon.png'
import LogoText from '@/shared/assets/images/logo-text.png'
import { ROUTES } from '@/shared/constants'
import { Button } from '@/shared/ui'

export default function LandingLayout() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: user, isPending } = useAuth()
  const isLoggedIn = !!user

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="w-full min-w-lending-max bg-repeat-x"
      style={{ backgroundImage: `url(${LandingBg})` }}
    >
      <header
        className={`sticky top-0 z-20 h-gnb-height bg-white transition-shadow ${isScrolled ? 'shadow-drop' : ''}`}
      >
        <nav className="mx-auto h-full max-w-layout-max px-layout-padding flex items-center justify-between">
          <h1 className="flex items-center gap-xsmall">
            <img src={LogoIcon} alt="" className="h-5.25 w-6.75" />
            <img src={LogoText} alt="독크독크" className="h-5.25 w-19" />
          </h1>
          {!isPending && !isLoggedIn && (
            <Button onClick={() => navigate(ROUTES.LOGIN)}>로그인</Button>
          )}
        </nav>
      </header>
      <main className="mx-auto w-lending-max">
        <Outlet />
      </main>
    </div>
  )
}
