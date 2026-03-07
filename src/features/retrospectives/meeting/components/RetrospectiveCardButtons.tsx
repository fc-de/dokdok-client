import { useNavigate } from 'react-router-dom'

import type { RetrospectiveStatus } from '@/features/meetings'
import meetingRetroIcon from '@/shared/assets/icon/meeting-retro.svg'
import personalRetroIcon from '@/shared/assets/icon/personal-retro.svg'
import { ROUTES } from '@/shared/constants'

interface RetrospectiveCardButtonsProps {
  gatheringId: number
  meetingId: number
  retrospectiveStatus: RetrospectiveStatus
  personalRetrospectiveWritten: boolean
}

export default function RetrospectiveCardButtons({
  gatheringId,
  meetingId,
  retrospectiveStatus,
  personalRetrospectiveWritten,
}: RetrospectiveCardButtonsProps) {
  const navigate = useNavigate()

  // 약속 회고 라우트 결정
  const getMeetingRetrospectiveRoute = () => {
    switch (retrospectiveStatus) {
      case 'NOT_CREATED':
        return ROUTES.MEETING_RETROSPECTIVE_CREATE(gatheringId, meetingId)
      case 'FINAL_PUBLISHED':
        return ROUTES.MEETING_RETROSPECTIVE_DETAIL(gatheringId, meetingId)
      case 'AI_SUMMARY_COMPLETED':
        return ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId)
      default:
        return ROUTES.MEETING_RETROSPECTIVE_CREATE(gatheringId, meetingId)
    }
  }

  // 개인 회고 라우트 결정
  const getPersonalRetrospectiveRoute = () => {
    if (personalRetrospectiveWritten) {
      return ROUTES.PERSONAL_RETROSPECTIVE_VIEW(gatheringId, meetingId)
    }
    return ROUTES.PERSONAL_RETROSPECTIVE(gatheringId, meetingId)
  }

  return (
    <div className="flex gap-small w-full pb-large">
      {/* 약속 회고 카드 */}
      <button
        type="button"
        className="flex flex-1 items-center gap-base rounded-base bg-white p-large shadow-drop cursor-pointer"
        onClick={() => navigate(getMeetingRetrospectiveRoute())}
      >
        <div className="flex gap-base">
          <img src={meetingRetroIcon} alt="약속 회고" className="shrink-0" />
          <div className="flex flex-col gap-xsmall items-start">
            <div className="flex items-center gap-xsmall">
              <span className="text-black typo-subtitle2">약속 회고</span>
            </div>
            <span className="text-grey-600 typo-body4">
              약속에서 나눈 대화를 다같이 정리해 남겨보세요
            </span>
          </div>
        </div>
      </button>

      {/* 개인 회고 카드 */}
      <button
        type="button"
        className="flex flex-1 items-center gap-base rounded-base bg-white p-large shadow-drop cursor-pointer"
        onClick={() => navigate(getPersonalRetrospectiveRoute())}
      >
        <div className="flex gap-base">
          <img src={personalRetroIcon} alt="개인 회고" className="shrink-0" />

          <div className="flex flex-col gap-xsmall items-start">
            <div className="flex items-center gap-xsmall">
              <span className="text-black typo-subtitle2">개인 회고</span>
            </div>
            <span className="text-grey-600 typo-body4">
              약속 후 느낀 나만의 생각을 정리해보세요
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}
