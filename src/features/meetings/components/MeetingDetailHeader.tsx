import { getMeetingStatusByTime } from '@/features/meetings/lib'
import type { MeetingSchedule } from '@/features/meetings/meetings.types'
import { Badge } from '@/shared/ui'

interface MeetingDetailHeaderProps {
  children: string
  schedule: MeetingSchedule
}

export function MeetingDetailHeader({ children, schedule }: MeetingDetailHeaderProps) {
  const status = getMeetingStatusByTime(schedule.startDateTime, schedule.endDateTime)

  return (
    <>
      <div className="flex items-start border-b gap-small border-b-grey-300 pb-[10px]">
        <h3 className="text-black typo-heading3">{children}</h3>
        <Badge size="small" color={status.color}>
          {status.text}
        </Badge>
      </div>
    </>
  )
}
