import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Book, CalendarClock, MapPin } from 'lucide-react'

import { useMeetingAction } from '@/features/meetings/hooks'
import { Button, Card, TextButton } from '@/shared/ui'

import type { GetMeetingDetailResponse } from '../meetings.types'
import MeetingInfoIcon from './MeetingInfoIcon'
import MeetingParticipants from './MeetingParticipants'

// PC 전용: MeetingDetailPage에서 "더보기" 클릭 시 인라인으로 표시됨
// 모바일에서는 같은 정보를 별도 페이지(MobileMeetingInfoPage)에서 보여줌
interface MeetingPCInfoPanelProps {
  meeting: GetMeetingDetailResponse
}

export default function MeetingPCInfoPanel({ meeting }: MeetingPCInfoPanelProps) {
  const actionType = meeting.actionState.type
  const { handleAction, isPending } = useMeetingAction(
    actionType,
    meeting.gathering.gatheringId,
    meeting.meetingId
  )

  const isCancelSectionVisible = actionType === 'CAN_CANCEL' || actionType === 'CANCEL_TIME_EXPIRED'
  const isCancelDisabled = actionType === 'CANCEL_TIME_EXPIRED' || isPending

  return (
    <div className="flex flex-col gap-base">
      <div className="flex items-center justify-between">
        <p className="text-black typo-heading3">약속 정보</p>
        {actionType === 'CAN_EDIT' && (
          <TextButton size="medium" className="text-grey-600" onClick={handleAction}>
            수정하기
          </TextButton>
        )}
      </div>

      <Card>
        <div className="flex items-center">
          <div className="flex flex-1 items-center gap-small px-base min-w-0">
            <MeetingInfoIcon icon={Book} />
            <div className="flex min-w-0 gap-xsmall justify-center">
              <p className="text-black typo-body3 truncate min-w-0" title={meeting.book.bookName}>
                {meeting.book.bookName}
              </p>
              <p
                className="typo-body6 text-grey-700 truncate min-w-0 shrink-0"
                title={meeting.book.authors}
              >
                {meeting.book.authors}
              </p>
            </div>
          </div>

          <span className="w-px h-10 bg-grey-300 shrink-0" />

          <div className="flex flex-1 items-center gap-small px-base min-w-0">
            <MeetingInfoIcon icon={CalendarClock} />
            <div className="flex flex-col text-black typo-body3">
              <p>
                {format(new Date(meeting.schedule.startDateTime), 'yyyy.MM.dd(eee) HH:mm', {
                  locale: ko,
                })}
              </p>
              <p>
                ~{' '}
                {format(new Date(meeting.schedule.endDateTime), 'yyyy.MM.dd(eee) HH:mm', {
                  locale: ko,
                })}
              </p>
            </div>
          </div>

          <span className="w-px h-10 bg-grey-300 shrink-0" />

          <div className="flex flex-1 items-center gap-small px-base min-w-0">
            <MeetingInfoIcon icon={MapPin} />
            {meeting.location && (
              <p className="text-black typo-body3 truncate min-w-0" title={meeting.location.name}>
                {meeting.location.name}
              </p>
            )}
          </div>
        </div>
      </Card>

      <MeetingParticipants participants={meeting.participants} />

      {isCancelSectionVisible && (
        <div className="flex items-center justify-between gap-base py-large border-t border-grey-300">
          <div className="flex flex-col gap-xtiny">
            <p className="text-black typo-body3">참가 취소</p>
            <p className="text-grey-600 typo-caption1">
              약속 시작 24시간 전까지만 취소할 수 있어요
            </p>
          </div>
          <Button
            variant="danger"
            outline
            size="small"
            disabled={isCancelDisabled}
            onClick={handleAction}
          >
            취소하기
          </Button>
        </div>
      )}
    </div>
  )
}
