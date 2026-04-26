import { BarChart3, FileQuestion, NotebookPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { formatToDateTimeRange, getDdayText } from '@/shared/lib/date'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/Badge'

import type { GatheringMeetingItem } from '../gatherings.types'
import { getMeetingDisplayStatus } from '../lib/meetingStatus'

interface GatheringMeetingCardProps {
  meeting: GatheringMeetingItem
  /** 모임 ID */
  gatheringId: number
  /** 약속장 여부 */
  isHost?: boolean
}

export default function GatheringMeetingCard({
  meeting,
  gatheringId,
  isHost = false,
}: GatheringMeetingCardProps) {
  const navigate = useNavigate()

  const { meetingId, meetingName, bookName, startDateTime, endDateTime, hasPreOpinion, hasPersonalRetrospective } = meeting

  const status = getMeetingDisplayStatus(startDateTime, endDateTime)
  const ddayText = getDdayText(startDateTime, endDateTime)
  const formattedDate = formatToDateTimeRange(startDateTime, endDateTime)

  const isOngoing = status === 'IN_PROGRESS'
  const isUpcoming = status === 'UPCOMING'
  const isDone = status === 'DONE'

  const showPreAnswer = isUpcoming && meeting.meetingStatus === 'CONFIRMED'
  const showMeetingReview = isDone
  const showPersonalReview = isDone

  const handleClick = () => {
    navigate(ROUTES.MEETING_DETAIL(gatheringId, meetingId))
  }

  const handlePreAnswerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(
      hasPreOpinion
        ? ROUTES.PRE_OPINIONS(gatheringId, meetingId)
        : ROUTES.PRE_OPINION_WRITE(gatheringId, meetingId)
    )
  }

  const handleMeetingReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(ROUTES.MEETING_RETROSPECTIVE_CREATE(gatheringId, meetingId))
  }

  const handlePersonalReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(
      hasPersonalRetrospective
        ? ROUTES.PERSONAL_RETROSPECTIVE_VIEW(gatheringId, meetingId)
        : ROUTES.PERSONAL_RETROSPECTIVE(gatheringId, meetingId)
    )
  }

  // 약속 중 카드 (빨간 배경)
  if (isOngoing) {
    return (
      <div
        className="flex items-center px-base py-small bg-accent-100 border border-accent-200 rounded-small cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-medium">
          {/* 상태 배지 - Badge 컴포넌트는 red color가 accent-200/300 사용 */}
          <Badge color="red" size="medium" className="w-13.25 justify-center">
            약속 중
          </Badge>

          {/* 약속 정보 */}
          <div className="flex flex-col gap-xtiny p-xtiny">
            <div className="flex items-center gap-xsmall">
              <div className="flex items-center gap-tiny text-black typo-subtitle2">
                <span className="font-semibold">{meetingName}</span>
                <span>|</span>
                <span className="font-medium">{bookName}</span>
              </div>
              {isHost && (
                <Badge color="purple" size="xsmall">
                  약속장
                </Badge>
              )}
            </div>
            <span className="text-grey-600 typo-body4">{formattedDate}</span>
          </div>
        </div>
      </div>
    )
  }

  // 예정/종료 카드
  const statusLabel = isUpcoming ? '예정' : '종료'
  const badgeColor = isUpcoming ? 'yellow' : 'grey'
  const ddayColor = isUpcoming ? 'text-yellow-300' : 'text-grey-600'

  return (
    <div
      className="flex items-center justify-between px-base py-medium bg-white border-b border-grey-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* 좌측: 배지 + 정보 */}
      <div className="flex items-center gap-medium">
        {/* 상태 배지 */}
        <Badge color={badgeColor} size="medium" className="w-13.25 justify-center">
          {statusLabel}
        </Badge>

        {/* 약속 정보 */}
        <div className="flex flex-col gap-xtiny p-xtiny flex-1">
          <div className="flex items-center gap-xsmall">
            <div className="flex items-center gap-tiny text-black typo-subtitle2">
              <span className="font-semibold">{meetingName}</span>
              <span className="font-medium">|</span>
              <span className="font-medium">{bookName}</span>
            </div>
            {isHost && (
              <Badge color="purple" size="xsmall">
                약속장
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-xsmall">
            {ddayText && (
              <span className={cn('typo-body5 font-semibold', ddayColor)}>{ddayText}</span>
            )}
            <span className="text-grey-700 typo-body4">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* 우측: 사전답변, 약속회고, 개인회고 버튼 */}
      <div className="flex items-center gap-base">
        {showPreAnswer && (
          <button
            type="button"
            className="flex flex-col items-center gap-xtiny p-tiny w-16 rounded-tiny cursor-pointer hover:bg-grey-100"
            onClick={handlePreAnswerClick}
          >
            <FileQuestion className="size-5 text-grey-600" />
            <span className="typo-body5 font-semibold text-grey-600">사전답변</span>
          </button>
        )}

        {showPreAnswer && (showMeetingReview || showPersonalReview) && (
          <div className="w-px h-12 bg-grey-300" />
        )}

        {showMeetingReview && (
          <button
            type="button"
            className="flex flex-col items-center gap-xtiny p-tiny w-16 rounded-tiny cursor-pointer hover:bg-grey-100"
            onClick={handleMeetingReviewClick}
          >
            <BarChart3 className="size-5 text-grey-600" />
            <span className="typo-body5 font-semibold text-grey-600">약속회고</span>
          </button>
        )}

        {showMeetingReview && showPersonalReview && <div className="w-px h-12 bg-grey-300" />}

        {showPersonalReview && (
          <button
            type="button"
            className="flex flex-col items-center gap-xtiny p-tiny w-16 rounded-tiny cursor-pointer hover:bg-grey-100"
            onClick={handlePersonalReviewClick}
          >
            <NotebookPen className="size-5 text-grey-600" />
            <span className="typo-body5 font-semibold text-grey-600">개인회고</span>
          </button>
        )}
      </div>
    </div>
  )
}
