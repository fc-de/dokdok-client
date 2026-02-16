import { useNavigate } from 'react-router-dom'

import { useCancelJoinMeeting, useJoinMeeting } from '@/features/meetings/hooks'
import type { MeetingDetailActionStateType } from '@/features/meetings/meetings.types'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

interface MeetingDetailButtonProps {
  buttonLabel: string
  isEnabled: boolean
  type: MeetingDetailActionStateType
  gatheringId: number
  meetingId: number
}

export default function MeetingDetailButton({
  buttonLabel,
  isEnabled,
  type,
  gatheringId,
  meetingId,
}: MeetingDetailButtonProps) {
  const navigate = useNavigate()
  const joinMutation = useJoinMeeting()
  const cancelJoinMutation = useCancelJoinMeeting()
  const { openError, openConfirm } = useGlobalModalStore()

  const isPending = joinMutation.isPending || cancelJoinMutation.isPending

  const handleClick = async () => {
    if (!isEnabled || isPending) return

    // 약속 수정
    if (type === 'CAN_EDIT') {
      navigate(ROUTES.MEETING_UPDATE(gatheringId, meetingId))
      return
    }

    // 약속 참가신청
    if (type === 'CAN_JOIN') {
      const confirmed = await openConfirm('참가 신청', '약속 참가 신청을 하시겠습니까?')
      if (!confirmed) return

      joinMutation.mutate(meetingId, {
        onSuccess: () => {
          alert('참가 신청이 완료되었습니다.')
        },
        onError: (error) => {
          openError('에러', error.userMessage)
        },
      })
      return
    }

    // 약속 참가취소
    if (type === 'CAN_CANCEL') {
      const confirmed = await openConfirm('참가 신청 취소', '약속 참가 신청을 취소하시겠습니까?')
      if (!confirmed) return

      cancelJoinMutation.mutate(meetingId, {
        onSuccess: () => {
          alert('참가 취소가 완료되었습니다.')
        },
        onError: (error) => {
          openError('에러', error.userMessage)
        },
      })
      return
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
