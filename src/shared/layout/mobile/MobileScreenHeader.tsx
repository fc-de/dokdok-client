import { ArrowLeft, X } from 'lucide-react'
import type * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { useScrollShadow } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

import type { MobileHeaderAction } from './types'

export type MobileScreenHeaderVariant = 'content' | 'independent'

export type MobileScreenHeaderProps = Omit<React.ComponentProps<'header'>, 'title'> & {
  variant: MobileScreenHeaderVariant
  title: string
  backTo?: string
  onBack?: () => void
  headerAction?: MobileHeaderAction
  leftAriaLabel?: string
  preview?: boolean
}

export default function MobileScreenHeader({
  variant,
  title,
  backTo,
  onBack,
  headerAction,
  leftAriaLabel,
  preview = false,
  className,
  ...props
}: MobileScreenHeaderProps) {
  const navigate = useNavigate()
  const isScrolled = useScrollShadow()
  const LeftIcon = variant === 'independent' ? X : ArrowLeft
  const defaultLeftLabel = variant === 'independent' ? '닫기' : '이전 화면으로 이동'

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    if (backTo) {
      navigate(backTo)
      return
    }

    navigate(-1)
  }

  return (
    <header
      className={cn(
        preview ? 'relative z-10' : 'fixed inset-x-0 top-0 z-50 lg:hidden',
        'h-12.25 bg-white px-5 transition-shadow',
        isScrolled && 'shadow-drop',
        className
      )}
      {...props}
    >
      <div className="relative flex h-full items-center justify-between">
        <button
          type="button"
          className="relative z-10 -ml-2.5 flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-grey-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={handleBack}
          aria-label={leftAriaLabel ?? defaultLeftLabel}
        >
          <LeftIcon aria-hidden className="size-6" />
        </button>

        <h1 className="pointer-events-none absolute left-1/2 w-[calc(100%-8rem)] max-w-50 -translate-x-1/2 truncate text-center typo-m-heading3 text-black">
          {title}
        </h1>

        {headerAction ? (
          <button
            type="button"
            className="relative z-10 max-w-18 truncate whitespace-nowrap rounded-xsmall px-xsmall py-xsmall typo-body2 text-grey-600 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-grey-500"
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
