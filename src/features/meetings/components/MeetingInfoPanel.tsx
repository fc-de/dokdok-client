import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Book, CalendarClock, type LucideIcon, MapPin } from 'lucide-react'
import { createElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCancelJoinMeeting } from '@/features/meetings/hooks'
import { ROUTES } from '@/shared/constants'
import { showToast } from '@/shared/lib/toast'
import { Avatar, AvatarFallback, AvatarImage, Button, Card, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

import type { GetMeetingDetailResponse } from '../meetings.types'

interface MeetingInfoPanelProps {
  meeting: GetMeetingDetailResponse
}

function InfoIcon({ icon }: { icon: LucideIcon }) {
  return (
    <span className="flex items-center justify-center size-[42px] rounded-small bg-grey-100 shrink-0">
      {createElement(icon, { size: 24, className: 'text-grey-700' })}
    </span>
  )
}

export default function MeetingInfoPanel({ meeting }: MeetingInfoPanelProps) {
  const navigate = useNavigate()
  const cancelJoinMutation = useCancelJoinMeeting()
  const { openConfirm, openError } = useGlobalModalStore()

  const actionType = meeting.actionState.type

  const handleCancel = async () => {
    if (cancelJoinMutation.isPending) return

    const confirmed = await openConfirm(
      '참가 취소하기',
      '참가를 취소하면 약속에서 내가 한 활동이 모두 삭제됩니다.\n약속 참가를 취소하시겠어요?'
    )
    if (!confirmed) return

    cancelJoinMutation.mutate(meeting.meetingId, {
      onSuccess: () => {
        showToast('참가 취소가 완료되었습니다.')
      },
      onError: (error) => {
        openError('에러', error.userMessage)
      },
    })
  }

  return (
    <div className="flex flex-col gap-base">
      <div className="flex items-center justify-between">
        <p className="text-black typo-heading3">약속 정보</p>
        {actionType === 'CAN_EDIT' && (
          <TextButton
            size="medium"
            className="text-grey-600"
            onClick={() =>
              navigate(ROUTES.MEETING_UPDATE(meeting.gathering.gatheringId, meeting.meetingId))
            }
          >
            수정하기
          </TextButton>
        )}
      </div>

      <Card>
        <div className="flex items-center">
          <div className="flex flex-1 items-center gap-small px-base min-w-0">
            <InfoIcon icon={Book} />
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
            <InfoIcon icon={CalendarClock} />
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
            <InfoIcon icon={MapPin} />
            {meeting.location && (
              <p className="text-black typo-body3 truncate min-w-0" title={meeting.location.name}>
                {meeting.location.name}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-base pb-xsmall">
        <p className="text-black typo-body3">
          참가인원{' '}
          <span className="text-grey-600">
            {meeting.participants.currentCount}/{meeting.participants.maxCount}
          </span>
        </p>

        <div className="grid grid-cols-2 gap-y-small">
          {meeting.participants.members.map((member) => (
            <div key={member.userId} className="flex items-center gap-small min-w-0">
              <Avatar title={member.nickname}>
                <AvatarImage src={member.profileImageUrl} alt={member.nickname} />
                <AvatarFallback>{member.nickname[0]}</AvatarFallback>
              </Avatar>
              <p className="text-black typo-body3 truncate min-w-0" title={member.nickname}>
                {member.nickname}
              </p>
            </div>
          ))}
        </div>
      </div>

      {actionType === 'CAN_CANCEL' && (
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
            disabled={cancelJoinMutation.isPending}
            onClick={handleCancel}
          >
            취소하기
          </Button>
        </div>
      )}
    </div>
  )
}
