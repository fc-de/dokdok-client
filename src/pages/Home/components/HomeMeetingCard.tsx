import { differenceInCalendarDays, format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import type { MyMeetingListItem } from '@/features/meetings'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'
import { Badge, Button } from '@/shared/ui'

interface HomeMeetingCardProps {
  meeting: MyMeetingListItem
}

function formatMeetingDate(dateStr: string) {
  return format(new Date(dateStr), 'yy.MM.dd(eee) HH:mm', { locale: ko })
}

function getDDay(startDateTime: string): string {
  const diffDays = differenceInCalendarDays(new Date(startDateTime), new Date())
  if (diffDays === 0) return 'D-Day'
  if (diffDays > 0) return `D-${diffDays}`
  return ''
}

const STATUS_CONFIG = {
  ONGOING: { label: '약속 중', color: 'red' as const },
  UPCOMING: { label: '예정', color: 'yellow' as const },
  DONE: { label: '종료', color: 'grey' as const },
  UNKNOWN: { label: '', color: 'grey' as const },
}

export default function HomeMeetingCard({ meeting }: HomeMeetingCardProps) {
  const navigate = useNavigate()
  const {
    meetingId,
    meetingName,
    gatheringId,
    gatheringName,
    startDateTime,
    endDateTime,
    myRole,
    progressStatus,
  } = meeting

  const status = STATUS_CONFIG[progressStatus]
  const isOngoing = progressStatus === 'ONGOING'
  const isUpcoming = progressStatus === 'UPCOMING'
  const isDone = progressStatus === 'DONE'
  const isLeader = myRole === 'LEADER'
  const dDay = isUpcoming ? getDDay(startDateTime) : ''

  const handleCardClick = () => {
    navigate(ROUTES.MEETING_DETAIL(gatheringId, meetingId))
  }

  const handleActionClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (isUpcoming) {
      navigate(ROUTES.PRE_OPINIONS(gatheringId, meetingId))
    }
    // TODO: 종료 → 개인 회고 작성 페이지 연결
  }

  return (
    <div
      className={cn(
        'flex items-center gap-medium px-medium py-small cursor-pointer',
        isOngoing
          ? 'rounded-small bg-accent-100 border border-accent-200'
          : 'border-b border-grey-300 last:border-b-0'
      )}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* 상태 태그 */}
      <div className="flex w-[60px] shrink-0 justify-center">
        {status.label && (
          <Badge color={status.color} size="small">
            {status.label}
          </Badge>
        )}
      </div>

      {/* 약속 정보 */}
      <div className="flex min-w-0 flex-1 flex-col gap-xtiny">
        <div className="flex items-center gap-tiny">
          <p className="min-w-0 truncate typo-subtitle2 text-black">
            {gatheringName} | {meetingName}
          </p>
          {isLeader && (
            <Badge color="purple" size="xsmall">
              약속장
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-tiny">
          {dDay && <span className="typo-body4 text-primary-400">{dDay}</span>}
          <span className="typo-body4 text-grey-600">
            {formatMeetingDate(startDateTime)} ~ {formatMeetingDate(endDateTime)}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      {/* TODO: API 응답에 hasPreOpinionTemplate 필드 추가 후, 템플릿 미제작 시 disabled 처리 */}
      {isUpcoming && (
        <Button variant="primary" size="small" className="shrink-0" onClick={handleActionClick}>
          사전 의견 작성하기
        </Button>
      )}
      {isDone && (
        // TODO: 개인 회고 작성 페이지 연결 후 disabled 제거
        <Button variant="primary" size="small" className="shrink-0" disabled>
          개인 회고 작성하기
        </Button>
      )}
    </div>
  )
}
