import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronRight } from 'lucide-react'

import { Card, TextButton } from '@/shared/ui'

import type { GetMeetingDetailResponse } from '../meetings.types'

// PC 전용: MeetingMobileSummaryCard의 PC 짝 - 날짜/멤버 요약 + "더보기" 클릭 시 MeetingPCInfoPanel을 인라인으로 토글
interface MeetingPCMoreInfoCardProps {
  meeting: GetMeetingDetailResponse
  onMoreClick: () => void
}

export default function MeetingPCMoreInfoCard({
  meeting,
  onMoreClick,
}: MeetingPCMoreInfoCardProps) {
  return (
    <Card>
      <ul className="text-body3 gap-tiny">
        <li>
          {format(new Date(meeting.schedule.startDateTime), 'yyyy.MM.dd(eee) HH:mm', {
            locale: ko,
          })}
        </li>
        <li>
          멤버 {meeting.participants.currentCount}
          {meeting.location && <> &bull; {meeting.location.name}</>}
        </li>
        <li className="mt-xsmall">
          <TextButton
            size="small"
            icon={ChevronRight}
            iconPosition="right"
            className="text-grey-700"
            onClick={onMoreClick}
          >
            더보기
          </TextButton>
        </li>
      </ul>
    </Card>
  )
}
