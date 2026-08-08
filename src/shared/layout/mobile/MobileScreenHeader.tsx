import { ArrowLeft, X } from 'lucide-react'
import type * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { useScrollShadow } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

import type { MobileHeaderAction, MobileHeaderLeftAction } from './types'

export type MobileScreenHeaderProps = Omit<React.ComponentProps<'header'>, 'title'> & {
  title: string
  subtitle?: string
  leftAction?: MobileHeaderLeftAction
  headerAction?: MobileHeaderAction
  headerActionSlot?: React.ReactNode
  preview?: boolean
  /** 스크롤 시 하단 shadow 비활성화 (하위 sticky 헤더가 그림자를 대신 표시할 때 사용) */
  disableShadow?: boolean
}

export default function MobileScreenHeader({
  title,
  subtitle,
  leftAction = { type: 'back' },
  headerAction,
  headerActionSlot,
  preview = false,
  disableShadow = false,
  className,
  ...props
}: MobileScreenHeaderProps) {
  const navigate = useNavigate()
  const isScrolled = useScrollShadow()
  const LeftIcon = leftAction.type === 'close' ? X : ArrowLeft
  const defaultLeftLabel = leftAction.type === 'close' ? '닫기' : '이전 화면으로 이동'

  const handleLeftAction = () => {
    if (leftAction.onClick) {
      leftAction.onClick()
      return
    }

    if (leftAction.to) {
      navigate(leftAction.to)
      return
    }

    navigate(-1)
  }

  return (
    <header
      className={cn(
        preview ? 'relative z-10' : 'fixed inset-x-0 top-0 z-50 lg:hidden',
        !preview && 'mobile-frame',
        'h-12.25 bg-white px-5 transition-shadow',
        isScrolled && !disableShadow && 'shadow-drop',
        className
      )}
      {...props}
    >
      <div className="relative flex h-full items-center justify-between">
        {leftAction.type === 'none' ? (
          <span className="size-11" aria-hidden />
        ) : (
          <button
            type="button"
            className="relative z-10 -ml-2.5 flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-grey-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={handleLeftAction}
            aria-label={leftAction.ariaLabel ?? defaultLeftLabel}
          >
            <LeftIcon aria-hidden className="size-6" />
          </button>
        )}

        <div className="pointer-events-none absolute left-1/2 top-1/2 flex w-[calc(100%-8rem)] max-w-50 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
          <h1 className="w-full truncate typo-m-heading3 text-black">{title}</h1>
          {subtitle && <p className="w-full truncate typo-caption1 text-grey-600">{subtitle}</p>}
        </div>

        {headerActionSlot ? (
          headerActionSlot
        ) : headerAction ? (
          <button
            type="button"
            className={cn(
              'relative z-10 max-w-18 truncate whitespace-nowrap rounded-xsmall px-xsmall py-xsmall typo-body2 text-grey-600 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-grey-500',
              headerAction.className
            )}
            onClick={headerAction.onClick}
            disabled={headerAction.disabled}
            aria-label={headerAction.ariaLabel ?? headerAction.label}
          >
            {headerAction.label}
          </button>
        ) : (
          <span className="size-11" aria-hidden />
        )}
      </div>
    </header>
  )
}
