import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarClock, ChevronRight, MapPin } from 'lucide-react'
import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import {
  MeetingBookInfo,
  MeetingDetailHeader,
  MeetingInfoIcon,
  MeetingParticipants,
  useMeetingAction,
  useMeetingDetail,
} from '@/features/meetings'
import { ROUTES } from '@/shared/constants'
import { useDevice } from '@/shared/hooks'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast } from '@/shared/lib/toast'
import { cn } from '@/shared/lib/utils'
import { Card, Spinner } from '@/shared/ui'

// 모바일 전용: PC에서는 MeetingDetailPage의 MeetingPCInfoPanel(인라인 "더보기" 토글)이 같은 역할을 함
export default function MobileMeetingInfoPage() {
  const navigate = useNavigate()
  const { isWeb } = useDevice()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const parsedGatheringId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const parsedMeetingId = meetingIdParam ? Number(meetingIdParam) : NaN
  const gatheringId = Number.isFinite(parsedGatheringId) ? parsedGatheringId : 0
  const meetingId = Number.isFinite(parsedMeetingId) ? parsedMeetingId : 0

  const {
    data: meeting,
    isLoading: meetingLoading,
    error: meetingError,
  } = useMeetingDetail(meetingId)

  const actionType = meeting?.actionState.type
  const { handleAction, isPending } = useMeetingAction(actionType ?? 'DONE', gatheringId, meetingId)

  useEffect(() => {
    if (meetingError) {
      showErrorToast(meetingError.userMessage)
      navigate(ROUTES.MEETING_DETAIL(gatheringId, meetingId), { replace: true })
    }
  }, [meetingError, navigate, gatheringId, meetingId])

  if (gatheringId === 0 || meetingId === 0) return null
  if (isWeb) {
    return (
      <Navigate
        to={ROUTES.MEETING_DETAIL(gatheringId, meetingId)}
        replace
        state={{ openInfoPanel: true }}
      />
    )
  }

  const isCancelSectionVisible = actionType === 'CAN_CANCEL' || actionType === 'CANCEL_TIME_EXPIRED'
  const isCancelDisabled = actionType === 'CANCEL_TIME_EXPIRED' || isPending

  return (
    <MobileLayoutFrame
      variant="header"
      title=" "
      leftAction={{ type: 'back', to: ROUTES.MEETING_DETAIL(gatheringId, meetingId) }}
      headerAction={
        actionType === 'CAN_EDIT'
          ? { label: '수정하기', onClick: handleAction, className: 'typo-body3 text-grey-600' }
          : undefined
      }
      className="min-h-dvh"
      contentClassName="bg-white"
    >
      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5">
        {meetingLoading || !meeting ? (
          <div className="flex items-center justify-center h-[400px]">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-large">
              <MeetingDetailHeader
                progressStatus={meeting.progressStatus}
                align="center"
                direction="col"
              >
                {meeting.meetingName}
              </MeetingDetailHeader>

              <MeetingBookInfo book={meeting.book} />

              <Card>
                <div className="flex flex-col gap-base">
                  <div className="flex items-center gap-small">
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

                  {meeting.location && (
                    <>
                      <div className="border-t border-grey-300" />
                      <div className="flex items-center gap-small">
                        <MeetingInfoIcon icon={MapPin} />
                        <p className="text-black typo-body3 truncate min-w-0">
                          {meeting.location.name}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>

            <div className="h-2.5 -mx-5 my-large bg-grey-100" />

            <div className="flex flex-col gap-large">
              <MeetingParticipants participants={meeting.participants} />

              {isCancelSectionVisible && (
                <>
                  <div className="h-2.5 -mx-5 bg-grey-100" />

                  <button
                    type="button"
                    disabled={isCancelDisabled}
                    onClick={handleAction}
                    className="flex w-full items-center justify-between gap-base py-base text-left"
                  >
                    <div className="flex flex-col gap-xtiny">
                      <p
                        className={cn(
                          'typo-body3',
                          isCancelDisabled ? 'text-grey-500' : 'text-black'
                        )}
                      >
                        참가 취소하기
                      </p>
                      <p className="text-grey-500 typo-caption1">
                        약속 시작 24시간 전까지만 취소할 수 있어요
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-grey-500 shrink-0" />
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </MobileLayoutFrame>
  )
}
