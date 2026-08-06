import { useJoinMeeting } from '@/features/meetings/hooks'
import type { MeetingDetailActionStateType } from '@/features/meetings/meetings.types'
import { showToast } from '@/shared/lib/toast'
import { Button } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

interface MeetingDetailButtonProps {
  buttonLabel: string
  isEnabled: boolean
  type: MeetingDetailActionStateType
  meetingId: number
}

export default function MeetingDetailButton({
  buttonLabel,
  isEnabled,
  type,
  meetingId,
}: MeetingDetailButtonProps) {
  const joinMutation = useJoinMeeting()
  const { openError, openConfirm } = useGlobalModalStore()

  // 약속 수정(CAN_EDIT), 참가 취소(CAN_CANCEL)는 MeetingInfoPanel에서 렌더링
  if (type === 'CAN_EDIT' || type === 'CAN_CANCEL') return null

  const isPending = joinMutation.isPending

  const handleClick = async () => {
    if (!isEnabled || isPending) return

    // 약속 참가신청
    if (type === 'CAN_JOIN') {
      const confirmed = await openConfirm('참가 신청', '약속 참가 신청을 하시겠습니까?')
      if (!confirmed) return

      joinMutation.mutate(meetingId, {
        onSuccess: () => {
          showToast('참가 신청이 완료되었습니다.')
        },
        onError: (error) => {
          openError('에러', error.userMessage)
        },
      })
    }
  }

  return (
    <div>
      <Button
        size="medium"
        className="w-full"
        disabled={!isEnabled || isPending}
        onClick={handleClick}
      >
        {buttonLabel}
      </Button>
      {!isEnabled && (
        <p className="text-grey-700 typo-body6 pt-tiny">
          {type === 'EDIT_TIME_EXPIRED' && '약속 24시간 전까지만 약속 정보를 수정할 수 있어요'}
          {(type === 'CANCEL_TIME_EXPIRED' || type === 'JOIN_TIME_EXPIRED') &&
            '* 약속 24시간 전까지만 참가 신청 및 취소가 가능해요'}
        </p>
      )}
    </div>
  )
}
