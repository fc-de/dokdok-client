import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/shared/lib/utils'

interface HomeSectionHeaderProps {
  title: string
  linkTo?: string
  linkLabel?: string
  children?: ReactNode
  className?: string
}

export default function HomeSectionHeader({
  title,
  linkTo,
  linkLabel,
  children,
  className,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto] items-center gap-y-xsmall lg:flex lg:items-center lg:justify-between',
        className
      )}
    >
      <div className="contents lg:flex lg:items-center lg:gap-medium">
        <h2 className="typo-heading3 text-black max-lg:col-start-1 max-lg:row-start-1 max-lg:typo-m-heading3">
          {title}
        </h2>

        {children && (
          <div className="col-span-2 max-lg:col-start-1 max-lg:row-start-2 lg:col-auto">
            {children}
          </div>
        )}
      </div>

      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          aria-label={linkLabel}
          className="relative inline-flex items-center gap-xtiny text-grey-600 typo-caption1 hover:text-grey-800 max-lg:col-start-2 max-lg:row-start-1 max-lg:size-5 max-lg:justify-center max-lg:before:absolute max-lg:before:-inset-3 max-lg:before:content-['']"
        >
          <span className="max-lg:hidden">{linkLabel}</span>
          <ChevronRight className="size-4 max-lg:size-5" />
        </Link>
      )}
    </div>
  )
}
