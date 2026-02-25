import { useNavigate } from 'react-router-dom'

import meetingRetroIcon from '@/shared/assets/icon/meeting-retro.svg'
import personalRetroIcon from '@/shared/assets/icon/personal-retro.svg'
import { ROUTES } from '@/shared/constants'

interface RetrospectiveCardButtonsProps {
  gatheringId: number
  meetingId: number
}

export default function RetrospectiveCardButtons({
  gatheringId,
  meetingId,
}: RetrospectiveCardButtonsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex gap-small w-full pb-large">
      {/* 약속 회고 카드 */}
      <button
        type="button"
        className="flex flex-1 items-center gap-base rounded-base bg-white p-large shadow-drop cursor-pointer"
        onClick={() => navigate(ROUTES.MEETING_RETROSPECTIVE_CREATE(gatheringId, meetingId))}
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
        onClick={() => {
          /* TODO: 개인 회고 라우트 연결 */
        }}
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
