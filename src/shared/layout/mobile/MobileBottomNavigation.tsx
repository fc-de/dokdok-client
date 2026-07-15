import { createElement } from 'react'
import { NavLink } from 'react-router-dom'

import BookIcon from '@/shared/assets/icon/book.svg?react'
import GatheringIcon from '@/shared/assets/icon/gathering.svg?react'
import HomeIcon from '@/shared/assets/icon/home.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'

import type { MobileBottomNavigationItem } from './types'

const DEFAULT_ITEMS: MobileBottomNavigationItem[] = [
  { label: '홈', path: ROUTES.HOME, icon: HomeIcon, end: true },
  { label: '내 책장', path: ROUTES.BOOKS, icon: BookIcon },
  { label: '독서모임', path: ROUTES.GATHERINGS, icon: GatheringIcon },
]

export type MobileBottomNavigationProps = {
  items?: MobileBottomNavigationItem[]
  preview?: boolean
  className?: string
}

export default function MobileBottomNavigation({
  items = DEFAULT_ITEMS,
  preview = false,
  className,
}: MobileBottomNavigationProps) {
  return (
    <nav
      aria-label="하단 내비게이션"
      className={cn(
        preview ? 'absolute inset-x-0 bottom-0 z-10' : 'fixed inset-x-0 bottom-0 z-50 lg:hidden',
        !preview && 'mobile-frame',
        'border-t border-grey-300 bg-white pb-[env(safe-area-inset-bottom)]',
        className
      )}
    >
      <ul className="mx-auto grid h-17 max-w-md grid-cols-3 px-5">
        {items.map(({ label, path, icon, end }, index) => (
          <li key={path}>
            {preview ? (
              <div
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-0.5 rounded-xsmall text-grey-600',
                  index === 0 && 'text-primary-300'
                )}
                aria-current={index === 0 ? 'page' : undefined}
              >
                {createElement(icon, { 'aria-hidden': true, className: 'size-6' })}
                <span className="typo-body5 font-medium">{label}</span>
              </div>
            ) : (
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex h-full flex-col items-center justify-center gap-0.5 rounded-xsmall text-grey-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive && 'text-primary-300'
                  )
                }
              >
                {createElement(icon, { 'aria-hidden': true, className: 'size-6' })}
                <span className="typo-body5 font-medium">{label}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
