import { formatMeetingDateTime } from '@/features/meetings/lib'

import type { GetMeetingDetailResponse } from '../meetings.types'
import MeetingDetailHeader from './MeetingDetailHeader'

interface MeetingMobileSummaryCardProps {
  meeting: GetMeetingDetailResponse
  onClick: () => void
}

export default function MeetingMobileSummaryCard({
  meeting,
  onClick,
}: MeetingMobileSummaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full gap-2.5 border-b border-grey-300 pb-medium mb-medium text-left"
    >
      <img
        src={meeting.book.thumbnail}
        alt=""
        aria-hidden="true"
        className="w-[80px] aspect-[80/113.25] object-cover shrink-0 bg-grey-200"
      />
      <div className="flex flex-1 min-w-0 flex-col justify-between">
        <MeetingDetailHeader
          progressStatus={meeting.progressStatus}
          direction="col"
          align="start"
          truncate
          chevron
        >
          {meeting.meetingName}
        </MeetingDetailHeader>
        <div className="flex flex-col gap-xxtiny">
          <p className="typo-caption1 text-grey-600">
            {formatMeetingDateTime(meeting.schedule.startDateTime)}
          </p>
          <p className="truncate typo-caption1 text-grey-600">
            멤버 {meeting.participants.currentCount}
            {meeting.location && <> &bull; {meeting.location.name}</>}
          </p>
        </div>
      </div>
    </button>
  )
}
