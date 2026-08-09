import type { MeetingDetailActionStateType } from '@/features/meetings/meetings.types'
import { Button } from '@/shared/ui'

// PC 전용: MeetingDetailPage의 max-lg:hidden 블록에서만 렌더링됨 (모바일은 MobileLayoutFrame의 bottomCTA 사용)
interface MeetingPCActionButtonProps {
  buttonLabel: string
  isEnabled: boolean
  type: MeetingDetailActionStateType
  isPending: boolean
  onClick: () => void
}

export default function MeetingPCActionButton({
  buttonLabel,
  isEnabled,
  type,
  isPending,
  onClick,
}: MeetingPCActionButtonProps) {
  return (
    <div>
      <Button size="medium" className="w-full" disabled={!isEnabled || isPending} onClick={onClick}>
        {buttonLabel}
      </Button>
      {!isEnabled && (
        <p className="text-grey-700 typo-body6 pt-tiny">
          {type === 'EDIT_TIME_EXPIRED' && '약속 24시간 전까지만 약속 정보를 수정할 수 있어요'}
          {type === 'JOIN_TIME_EXPIRED' && '* 약속 24시간 전까지만 참가 신청 및 취소가 가능해요'}
        </p>
      )}
    </div>
  )
}
