import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/shared/lib/utils'

interface HomeSectionHeaderProps {
  title: string
  linkTo?: string
  linkLabel?: string
  children?: React.ReactNode
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
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-medium">
        <h2 className="typo-heading3 text-black">{title}</h2>
        {children}
      </div>

      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-xtiny text-grey-600 typo-caption1 hover:text-grey-800"
        >
          <span>{linkLabel}</span>
          <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
