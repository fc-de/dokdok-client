import type { MeddtingDetailActionStateType } from '@/features/meetings/meetings.types'
import { Button } from '@/shared/ui'

interface MeetingDetailButtonProps {
  buttonLabel: string
  isEnabled: boolean
  type: MeddtingDetailActionStateType
}

export function MeetingDetailButton({ buttonLabel, isEnabled, type }: MeetingDetailButtonProps) {
  return (
    <div>
      <Button size="medium" className="w-full" disabled={!isEnabled}>
        {buttonLabel}
      </Button>
      {isEnabled && (
        <p className="text-grey-700 typo-body6 pt-tiny">
          {type === 'EDIT_TIME_EXPIRED' && '약속 24시간 전까지만 약속 정보를 수정할 수 있어요'}
          {/* {type === '' && '* 약속 24시간 전까지만 참가 신청 및 취소가 가능해요'} */}
        </p>
      )}
    </div>
  )
}
