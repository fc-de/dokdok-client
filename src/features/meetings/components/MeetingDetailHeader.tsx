import { ChevronRight } from 'lucide-react'

import { MEETING_PROGRESS_BADGE_MAP } from '@/features/meetings/lib'
import type { MeetingProgressStatus } from '@/features/meetings/meetings.types'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui'

interface MeetingDetailHeaderProps {
  children: string
  progressStatus: MeetingProgressStatus
  onClick?: () => void
  direction?: 'row' | 'col'
  align?: 'start' | 'center'
  // 제목 1줄 truncate 여부 (기본 false: 줄바꿈 허용)
  truncate?: boolean
  // 제목 옆 chevron 아이콘 노출 여부
  chevron?: boolean
}
export default function MeetingDetailHeader({
  children,
  progressStatus,
  onClick,
  direction = 'row',
  align = 'center',
  truncate = false,
  chevron = false,
}: MeetingDetailHeaderProps) {
  const { text, color } = MEETING_PROGRESS_BADGE_MAP[progressStatus]
  const isRow = direction === 'row'

  const badge = (
    <Badge size="small" color={color} className={!isRow ? 'w-fit' : undefined}>
      {text}
    </Badge>
  )

  const title = (
    <h3
      className={cn(
        'text-black',
        'max-lg:typo-m-heading3 typo-heading3',
        truncate && 'flex-1 min-w-0 truncate'
      )}
    >
      {children}
    </h3>
  )

  return (
    <div
      className={cn(
        'flex',
        isRow ? 'flex-row justify-between' : 'flex-col gap-tiny',
        align === 'center' ? 'items-center' : 'items-start',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {isRow ? (
        <>
          {title}
          {badge}
        </>
      ) : (
        <>
          {badge}
          <div className="flex items-center gap-xtiny">
            {title}
            {chevron && <ChevronRight className="size-5 text-grey-600 shrink-0" />}
          </div>
        </>
      )}
    </div>
  )
}
