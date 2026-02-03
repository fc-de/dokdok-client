import type { MeetingProgressStatus } from '@/features/meetings/meetings.types'
import { Badge } from '@/shared/ui'

interface MeetingDetailHeaderProps {
  children: string
  progressStatus: MeetingProgressStatus
}

export function MeetingDetailHeader({ children, progressStatus }: MeetingDetailHeaderProps) {
  const progressStatusLabelMap: Record<MeetingProgressStatus, string> = {
    PRE: '약속 전',
    ONGOING: '약속 중',
    POST: '약속 후',
  }
  const badgeLabel = progressStatusLabelMap[progressStatus]
  return (
    <div className="flex items-start border-b gap-small border-b-grey-300 pb-[10px]">
      <h3 className="text-black typo-heading3">{children}</h3>
      {badgeLabel && (
        <Badge size="small" color="yellow">
          {badgeLabel}
        </Badge>
      )}
    </div>
  )
}
