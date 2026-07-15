import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

import MobileBottomCTA from './MobileBottomCTA'
import MobileBottomNavigation from './MobileBottomNavigation'
import MobileMainHeader from './MobileMainHeader'
import MobileScreenHeader from './MobileScreenHeader'
import type {
  MobileBottomCTAConfig,
  MobileBottomNavigationItem,
  MobileHeaderAction,
  MobileHeaderLeftAction,
  MobileLayoutVariant,
} from './types'

export type MobileLayoutFrameProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  variant?: MobileLayoutVariant
  title?: string
  subtitle?: string
  leftAction?: MobileHeaderLeftAction
  headerAction?: MobileHeaderAction
  headerActionSlot?: React.ReactNode
  bottomCTA?: MobileBottomCTAConfig
  navigationItems?: MobileBottomNavigationItem[]
  contentClassName?: string
  onNotificationClick?: () => void
  preview?: boolean
}

export default function MobileLayoutFrame({
  variant = 'none',
  title,
  subtitle,
  leftAction,
  headerAction,
  headerActionSlot,
  bottomCTA,
  navigationItems,
  contentClassName,
  onNotificationClick,
  preview = false,
  className,
  children,
  ...props
}: MobileLayoutFrameProps) {
  const hasMainNavigation = variant === 'navigation'
  const hasScreenHeader = variant === 'header' && !!title
  const hasBottomCTA = variant === 'header' && !!bottomCTA

  return (
    <div className={cn('bg-white', preview && 'relative overflow-hidden', className)} {...props}>
      {hasMainNavigation && (
        <MobileMainHeader onNotificationClick={onNotificationClick} preview={preview} />
      )}

      {hasScreenHeader && (
        <MobileScreenHeader
          title={title}
          subtitle={subtitle}
          leftAction={leftAction}
          headerAction={headerAction}
          headerActionSlot={headerActionSlot}
          preview={preview}
        />
      )}

      <div
        className={cn(
          !preview && 'max-lg:mobile-frame',
          hasMainNavigation && !preview && 'pt-13 lg:pt-0',
          hasScreenHeader && !preview && 'pt-12.25 lg:pt-0',
          hasMainNavigation &&
            'pb-[calc(var(--spacing-mobile-bottom-nav-height)+env(safe-area-inset-bottom))] lg:pb-0',
          hasBottomCTA && 'pb-[calc(5.375rem+env(safe-area-inset-bottom))] lg:pb-0',
          contentClassName
        )}
      >
        {children}
      </div>

      {hasMainNavigation && <MobileBottomNavigation items={navigationItems} preview={preview} />}
      {hasBottomCTA && <MobileBottomCTA {...bottomCTA} preview={preview} />}
    </div>
  )
}
