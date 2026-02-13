import type { MeetingProgressStatus } from '@/features/meetings/meetings.types'
import { Badge } from '@/shared/ui'

interface MeetingDetailHeaderProps {
  children: string
  progressStatus: MeetingProgressStatus
}
type ProgressBadge = {
  text: '약속 전' | '약속 중' | '약속 후'
  color: 'yellow' | 'blue' | 'red'
}
export default function MeetingDetailHeader({
  children,
  progressStatus,
}: MeetingDetailHeaderProps) {
  const progressStatusLabelMap: Record<MeetingProgressStatus, ProgressBadge> = {
    PRE: { text: '약속 전', color: 'yellow' },
    ONGOING: { text: '약속 중', color: 'red' },
    POST: { text: '약속 후', color: 'blue' },
  }
  const { text, color } = progressStatusLabelMap[progressStatus]
  return (
    <div className="flex items-start border-b gap-small border-b-grey-300 pb-[10px]">
      <h3 className="text-black typo-heading3">{children}</h3>
      <Badge size="small" color={color}>
        {text}
      </Badge>
    </div>
  )
}
