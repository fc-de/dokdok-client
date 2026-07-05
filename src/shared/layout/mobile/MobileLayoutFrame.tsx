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
  MobileLayoutVariant,
} from './types'

export type MobileLayoutFrameProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  variant?: MobileLayoutVariant
  title?: string
  backTo?: string
  onBack?: () => void
  headerAction?: MobileHeaderAction
  bottomCTA?: MobileBottomCTAConfig
  navigationItems?: MobileBottomNavigationItem[]
  contentClassName?: string
  onNotificationClick?: () => void
  preview?: boolean
}

export default function MobileLayoutFrame({
  variant = 'none',
  title,
  backTo,
  onBack,
  headerAction,
  bottomCTA,
  navigationItems,
  contentClassName,
  onNotificationClick,
  preview = false,
  className,
  children,
  ...props
}: MobileLayoutFrameProps) {
  const hasMainNavigation = variant === 'main'
  const hasBottomCTA = variant === 'independent' && !!bottomCTA

  return (
    <div className={cn('bg-white', preview && 'relative overflow-hidden', className)} {...props}>
      {variant === 'main' && (
        <MobileMainHeader onNotificationClick={onNotificationClick} preview={preview} />
      )}

      {(variant === 'content' || variant === 'independent') && title && (
        <MobileScreenHeader
          variant={variant}
          title={title}
          backTo={backTo}
          onBack={onBack}
          headerAction={headerAction}
          preview={preview}
        />
      )}

      <div
        className={cn(
          hasMainNavigation && 'pb-[calc(68px+env(safe-area-inset-bottom))] lg:pb-0',
          hasBottomCTA && 'pb-[calc(86px+env(safe-area-inset-bottom))] lg:pb-0',
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
