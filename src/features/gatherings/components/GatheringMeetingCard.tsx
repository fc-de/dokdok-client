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

  const { meetingId, meetingName, bookName, startDateTime, endDateTime } = meeting

  const status = getMeetingDisplayStatus(startDateTime, endDateTime)
  const ddayText = getDdayText(startDateTime, endDateTime)
  const formattedDate = formatToDateTimeRange(startDateTime, endDateTime)

  const isOngoing = status === 'IN_PROGRESS'

  const handleClick = () => {
    navigate(ROUTES.MEETING_DETAIL(gatheringId, meetingId))
  }

  // 사전답변, 약속회고, 개인회고 버튼 핸들러
  const handlePreAnswerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 사전답변 작성/조회 페이지로 이동
    console.log('사전답변 클릭')
  }

  const handleMeetingReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 약속회고 페이지로 이동
    console.log('약속회고 클릭')
  }

  const handlePersonalReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 개인회고 작성/조회 페이지로 이동
    console.log('개인회고 클릭')
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
  const isUpcoming = status === 'UPCOMING'
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
        {/* 사전답변 */}
        <button
          type="button"
          className="flex flex-col items-center gap-xtiny p-tiny w-16 rounded-tiny cursor-pointer hover:bg-grey-100"
          onClick={handlePreAnswerClick}
        >
          <FileQuestion className="size-5 text-grey-600" />
          <span className="typo-body5 font-semibold text-grey-600">사전답변</span>
        </button>

        <div className="w-px h-12 bg-grey-300" />

        {/* 약속회고 */}
        <button
          type="button"
          className="flex flex-col items-center gap-xtiny p-tiny w-16 rounded-tiny cursor-pointer hover:bg-grey-100"
          onClick={handleMeetingReviewClick}
        >
          <BarChart3 className="size-5 text-grey-600" />
          <span className="typo-body5 font-semibold text-grey-600">약속회고</span>
        </button>

        <div className="w-px h-12 bg-grey-300" />

        {/* 개인회고 */}
        <button
          type="button"
          className="flex flex-col items-center gap-xtiny p-tiny w-16 rounded-tiny cursor-pointer hover:bg-grey-100"
          onClick={handlePersonalReviewClick}
        >
          <NotebookPen className="size-5 text-grey-600" />
          <span className="typo-body5 font-semibold text-grey-600">개인회고</span>
        </button>
      </div>
    </div>
  )
}
