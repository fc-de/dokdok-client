import type { MeetingProgressStatus } from '@/features/meetings/meetings.types'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui'

interface MeetingDetailHeaderProps {
  children: string
  progressStatus: MeetingProgressStatus
  onClick?: () => void
}
type ProgressBadge = {
  text: '약속 전' | '약속 중' | '약속 후'
  color: 'yellow' | 'blue' | 'red'
}
export default function MeetingDetailHeader({
  children,
  progressStatus,
  onClick,
}: MeetingDetailHeaderProps) {
  const progressStatusLabelMap: Record<MeetingProgressStatus, ProgressBadge> = {
    PRE: { text: '약속 전', color: 'yellow' },
    ONGOING: { text: '약속 중', color: 'red' },
    POST: { text: '약속 후', color: 'blue' },
  }
  const { text, color } = progressStatusLabelMap[progressStatus]
  return (
    <div
      className={cn('flex items-center justify-between', onClick && 'cursor-pointer')}
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
      <h3 className="text-black typo-heading3">{children}</h3>
      <Badge size="small" color={color}>
        {text}
      </Badge>
    </div>
  )
}
