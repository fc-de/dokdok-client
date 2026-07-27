import { BarChart3, FileQuestion, NotebookPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { formatToDateTimeRange, getDdayText } from '@/shared/lib/date'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/Badge'

import type { GatheringMeetingItem } from '../gatherings.types'
import { getMeetingDisplayStatus } from '../lib/meetingStatus'

/** 사전답변/약속회고/개인회고 버튼 */
const ACTION_BUTTON_CLASS = [
  'flex flex-col items-center gap-xtiny p-tiny w-16 rounded-tiny cursor-pointer hover:bg-grey-100',
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
  'max-lg:w-auto max-lg:flex-1 max-lg:flex-row max-lg:justify-center max-lg:rounded-none',
].join(' ')

const ACTION_ICON_CLASS = 'size-5 text-grey-600 max-lg:size-4'

const ACTION_LABEL_CLASS = 'typo-body5 font-semibold text-grey-600 max-lg:typo-m-caption1'

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

  const {
    meetingId,
    meetingName,
    bookName,
    startDateTime,
    endDateTime,
    meetingStatus,
    joined,
    hasPreOpinion,
    hasPersonalRetrospective,
  } = meeting

  const status = getMeetingDisplayStatus(startDateTime, endDateTime)
  const ddayText = getDdayText(startDateTime, endDateTime)
  const formattedDate = formatToDateTimeRange(startDateTime, endDateTime)

  const isOngoing = status === 'IN_PROGRESS'
  const isUpcoming = status === 'UPCOMING'
  const isDone = status === 'DONE'

  // 참여한 약속에만 사전답변 노출 (미참여자가 클릭 시 사전의견 페이지에서 튕기는 문제 방지)
  const showPreAnswer = isUpcoming && meetingStatus === 'CONFIRMED' && joined
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
        className="flex items-center px-base py-small bg-accent-100 border border-accent-200 rounded-small cursor-pointer max-lg:items-stretch"
        onClick={handleClick}
      >
        <div className="flex items-center gap-medium max-lg:flex-col max-lg:items-start max-lg:gap-xtiny">
          {/* 배지 그룹 - 모바일은 상태/약속장 배지를 한 줄에 배치 */}
          <div className="flex items-center gap-xsmall">
            {/* 상태 배지 - Badge 컴포넌트는 red color가 accent-200/300 사용 */}
            <Badge color="red" size="medium" className="w-13.25 justify-center max-lg:w-auto">
              약속 중
            </Badge>
            {isHost && (
              <Badge color="purple" size="xsmall" className="lg:hidden">
                약속장
              </Badge>
            )}
          </div>

          {/* 약속 정보 */}
          <div className="flex flex-col gap-xtiny p-xtiny max-lg:w-full max-lg:p-0">
            <div className="flex items-center gap-xsmall max-lg:w-full max-lg:min-w-0">
              {/* 모바일은 한 줄 고정 + 말줄임 */}
              <div className="flex items-center gap-tiny text-black typo-subtitle2 max-lg:block max-lg:w-full max-lg:truncate max-lg:typo-m-body1">
                <span className="font-semibold">{meetingName}</span>
                <span className="max-lg:mx-tiny">|</span>
                <span className="font-medium">{bookName}</span>
              </div>
              {isHost && (
                <Badge color="purple" size="xsmall" className="max-lg:hidden">
                  약속장
                </Badge>
              )}
            </div>
            <span className="text-grey-600 typo-body4 max-lg:typo-m-caption1">{formattedDate}</span>
          </div>
        </div>
      </div>
    )
  }

  // 예정/종료 카드
  const statusLabel = isUpcoming ? '예정' : '종료'
  const badgeColor = isUpcoming ? 'yellow' : 'grey'

  return (
    <div
      className="flex items-center justify-between px-base py-medium bg-white border-b border-grey-300 cursor-pointer max-lg:flex-col max-lg:items-stretch max-lg:gap-small max-lg:px-small max-lg:py-base"
      onClick={handleClick}
    >
      {/* 좌측: 배지 + 정보 */}
      <div className="flex items-center gap-medium max-lg:flex-col max-lg:items-start max-lg:gap-xtiny">
        {/* 배지 그룹 - 모바일은 상태/약속장 배지를 한 줄에 배치 */}
        <div className="flex items-center gap-xsmall max-lg:gap-1.5">
          {/* 상태 배지 */}
          <Badge color={badgeColor} size="medium" className="w-13.25 justify-center max-lg:w-auto">
            {statusLabel}
          </Badge>
          {isHost && (
            <Badge color="purple" size="xsmall" className="lg:hidden">
              약속장
            </Badge>
          )}
        </div>

        {/* 약속 정보 */}
        <div className="flex flex-col gap-xtiny p-xtiny flex-1 max-lg:w-full max-lg:p-0">
          <div className="flex items-center gap-xsmall max-lg:w-full max-lg:min-w-0">
            {/* 모바일은 한 줄 고정 + 말줄임 */}
            <div className="flex items-center gap-tiny text-black typo-subtitle2 max-lg:block max-lg:w-full max-lg:truncate max-lg:typo-m-body2">
              <span className="font-semibold">{meetingName}</span>
              <span className="font-medium max-lg:mx-tiny">|</span>
              <span className="font-medium">{bookName}</span>
            </div>
            {isHost && (
              <Badge color="purple" size="xsmall" className="max-lg:hidden">
                약속장
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-xsmall max-lg:gap-xtiny">
            {/* D-day는 예정 상태에서만 노출 */}
            {isUpcoming && ddayText && (
              <span className="typo-body5 font-semibold text-yellow-300">{ddayText}</span>
            )}
            <span className="text-grey-700 typo-body4 max-lg:typo-m-body4">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* 우측: 사전답변, 약속회고, 개인회고 버튼 */}
      {/* 데스크톱은 해당되는 버튼만 노출(lg:hidden), 모바일은 3개 모두 노출하고 비활성은 dim */}
      <div className="flex items-center gap-base max-lg:w-full max-lg:gap-0 max-lg:divide-x max-lg:divide-grey-300">
        <button
          type="button"
          className={cn(ACTION_BUTTON_CLASS, !showPreAnswer && 'lg:hidden')}
          onClick={handlePreAnswerClick}
          disabled={!showPreAnswer}
        >
          <FileQuestion className={ACTION_ICON_CLASS} />
          <span className={ACTION_LABEL_CLASS}>사전답변</span>
        </button>

        <button
          type="button"
          className={cn(ACTION_BUTTON_CLASS, !showMeetingReview && 'lg:hidden')}
          onClick={handleMeetingReviewClick}
          disabled={!showMeetingReview}
        >
          <BarChart3 className={ACTION_ICON_CLASS} />
          <span className={ACTION_LABEL_CLASS}>약속회고</span>
        </button>

        {/* 데스크톱 전용 구분선 (모바일은 divide-x로 처리) */}
        {showMeetingReview && showPersonalReview && (
          <div className="w-px h-12 bg-grey-300 max-lg:hidden" />
        )}

        <button
          type="button"
          className={cn(ACTION_BUTTON_CLASS, !showPersonalReview && 'lg:hidden')}
          onClick={handlePersonalReviewClick}
          disabled={!showPersonalReview}
        >
          <NotebookPen className={ACTION_ICON_CLASS} />
          <span className={ACTION_LABEL_CLASS}>개인회고</span>
        </button>
      </div>
    </div>
  )
}
