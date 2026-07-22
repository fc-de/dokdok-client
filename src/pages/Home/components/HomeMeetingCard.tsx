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
    preOpinionTemplateConfirmed,
    hasPreOpinion,
    hasPersonalRetrospective,
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
    if (isUpcoming && preOpinionTemplateConfirmed) {
      // 이미 제출한 경우 작성 페이지가 아닌 조회 페이지로 이동
      navigate(
        hasPreOpinion
          ? ROUTES.PRE_OPINIONS(gatheringId, meetingId)
          : ROUTES.PRE_OPINION_WRITE(gatheringId, meetingId)
      )
    }
    if (isDone) {
      // 이미 작성한 경우 작성 페이지가 아닌 조회 페이지로 이동
      navigate(
        hasPersonalRetrospective
          ? ROUTES.PERSONAL_RETROSPECTIVE_VIEW(gatheringId, meetingId)
          : ROUTES.PERSONAL_RETROSPECTIVE(gatheringId, meetingId)
      )
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-medium cursor-pointer',
        'max-lg:flex-col max-lg:items-stretch max-lg:gap-0 max-lg:px-3 max-lg:py-4',
        isOngoing
          ? 'px-base py-small rounded-small bg-accent-100 border border-accent-200'
          : 'px-base py-large border-b border-grey-300 last:border-b-0'
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
      <div className="flex w-[53px] shrink-0 justify-center max-lg:mb-xtiny max-lg:w-auto max-lg:justify-start max-lg:gap-xtiny">
        {status.label && (
          <Badge color={status.color} size="medium" className="lg:w-full">
            {status.label}
          </Badge>
        )}
        {isLeader && (
          <Badge color="purple" size="xsmall" className="lg:hidden">
            약속장
          </Badge>
        )}
      </div>

      {/* 약속 정보 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[6px] max-lg:gap-[1px]">
        <div className="flex items-center gap-tiny">
          <p className="min-w-0 truncate typo-subtitle2 text-black max-lg:typo-m-body2">
            {gatheringName} | {meetingName}
          </p>
          {isLeader && (
            <Badge color="purple" size="xsmall" className="max-lg:hidden">
              약속장
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-tiny">
          {dDay && <span className="typo-body4 text-primary-400 max-lg:typo-m-body4">{dDay}</span>}
          <span className="typo-body4 text-grey-600 max-lg:typo-m-body4">
            {formatMeetingDate(startDateTime)} ~ {formatMeetingDate(endDateTime)}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      {isUpcoming && (
        <Button
          variant="primary"
          size="small"
          className="shrink-0 max-lg:mt-[10px] max-lg:w-full"
          disabled={!preOpinionTemplateConfirmed}
          onClick={handleActionClick}
        >
          {hasPreOpinion ? '사전 의견 보기' : '사전 의견 작성하기'}
        </Button>
      )}
      {isDone && (
        <Button
          variant="primary"
          size="small"
          className="shrink-0 max-lg:mt-[10px] max-lg:w-full"
          onClick={handleActionClick}
        >
          {hasPersonalRetrospective ? '개인 회고 보기' : '개인 회고 작성하기'}
        </Button>
      )}
    </div>
  )
}
