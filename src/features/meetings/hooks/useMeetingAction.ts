/**
 * @file useMeetingAction.ts
 * @description 약속 상세 actionState(type)에 따른 액션(수정 이동/참가/참가취소) 통합 훅
 */

import { useNavigate } from 'react-router-dom'

import type { MeetingDetailActionStateType } from '@/features/meetings/meetings.types'
import { ROUTES } from '@/shared/constants'
import { showToast } from '@/shared/lib/toast'
import { useGlobalModalStore } from '@/store'

import { useCancelJoinMeeting } from './useCancelJoinMeeting'
import { useJoinMeeting } from './useJoinMeeting'

/**
 * 약속 상세의 actionState.type에 대응하는 단일 액션 핸들러를 제공
 * - CAN_EDIT: 약속 수정 페이지로 이동
 * - CAN_JOIN: 참가 신청 확인 후 mutate
 * - CAN_CANCEL: 참가 취소 확인 후 mutate
 * - 그 외 타입: no-op (버튼이 비활성 상태이거나 다른 UI에서 처리)
 */
export function useMeetingAction(
  type: MeetingDetailActionStateType,
  gatheringId: number,
  meetingId: number
) {
  const navigate = useNavigate()
  const joinMutation = useJoinMeeting()
  const cancelMutation = useCancelJoinMeeting()
  const { openConfirm, openError } = useGlobalModalStore()

  const isPending = joinMutation.isPending || cancelMutation.isPending

  const handleAction = async () => {
    if (isPending) return

    switch (type) {
      case 'CAN_EDIT': {
        navigate(ROUTES.MEETING_UPDATE(gatheringId, meetingId))
        return
      }
      case 'CAN_JOIN': {
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
        return
      }
      case 'CAN_CANCEL': {
        const confirmed = await openConfirm(
          '참가 취소하기',
          '참가를 취소하면 약속에서 내가 한 활동이 모두 삭제됩니다.\n약속 참가를 취소하시겠어요?',
          { confirmText: '확인', variant: 'danger' }
        )
        if (!confirmed) return

        cancelMutation.mutate(meetingId, {
          onSuccess: () => {
            showToast('참가 취소가 완료되었습니다.')
          },
          onError: (error) => {
            openError('에러', error.userMessage)
          },
        })
        return
      }
      default:
        return
    }
  }

  return { handleAction, isPending }
}
