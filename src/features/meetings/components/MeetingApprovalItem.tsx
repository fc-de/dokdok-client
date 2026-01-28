/**
 * @file MeetingApprovalItem.tsx
 * @description 약속 승인 아이템 컴포넌트
 */

import { useConfirmMeeting } from '@/features/meetings/hooks/useConfirmMeeting'
import { useDeleteMeeting } from '@/features/meetings/hooks/useDeleteMeeting'
import { useRejectMeeting } from '@/features/meetings/hooks/useRejectMeeting'
import formatDateTime from '@/features/meetings/lib/formatDateTime'
import type { MeetingApprovalItem as MeetingApprovalItemType } from '@/features/meetings/meetings.types'
import { useGlobalModalStore } from '@/shared/stores/globalModalStore'
import { Button } from '@/shared/ui/Button'

export type MeetingApprovalItemProps = {
  /** 약속 승인 아이템 데이터 */
  item: MeetingApprovalItemType
}

/**
 * 약속 승인 아이템 컴포넌트
 *
 * @description
 * 약속 승인 리스트의 개별 아이템을 렌더링합니다.
 */
export function MeetingApprovalItem({ item }: MeetingApprovalItemProps) {
  const { meetingName, bookName, nickname, startDateTime, endDateTime, meetingStatus, meetingId } =
    item

  const confirmMutation = useConfirmMeeting()
  const rejectMutation = useRejectMeeting()
  const deleteMutation = useDeleteMeeting()
  const isPending =
    confirmMutation.isPending || rejectMutation.isPending || deleteMutation.isPending
  const { openConfirm, openError } = useGlobalModalStore()

  const handleApprove = async () => {
    if (isPending) return
    const confirmed = await openConfirm('약속 승인', '약속을 승인 하시겠습니까?')
    if (!confirmed) return

    confirmMutation.mutate(meetingId, {
      onError: (error) => openError('에러', error.userMessage),
    })
  }

  const handleReject = async () => {
    if (isPending) return
    const confirmed = await openConfirm('약속 거절', '약속을 거절 하시겠습니까?')
    if (!confirmed) return

    rejectMutation.mutate(meetingId, {
      onError: (error) => openError('에러', error.userMessage),
    })
  }

  const handleDelete = async () => {
    if (isPending) return
    const confirmed = await openConfirm(
      '약속 삭제',
      '삭제된 약속은 리스트에서 사라지며 복구할 수 없어요.\n정말 약속을 삭제하시겠어요?',
      { confirmText: '삭제', variant: 'danger' }
    )
    if (!confirmed) return

    deleteMutation.mutate(meetingId, {
      onError: (error) => openError('에러', error.userMessage),
    })
  }

  return (
    <li className="flex items-center justify-between border-b gap-medium py-large border-grey-300 last:border-b-0">
      <div className="flex flex-col gap-xtiny">
        <p className="typo-body4 text-grey-600">{nickname}</p>
        <p className="text-black typo-subtitle2">
          {meetingName} | {bookName}
        </p>
        <p className="typo-body4 text-grey-600">
          약속 일시 : {formatDateTime(startDateTime)} ~ {formatDateTime(endDateTime)}
        </p>
      </div>

      <div className="flex gap-small shrink-0">
        {meetingStatus === 'PENDING' ? (
          <>
            <Button
              variant="secondary"
              outline
              size="small"
              onClick={handleReject}
              disabled={isPending}
            >
              거절
            </Button>
            <Button variant="primary" size="small" onClick={handleApprove} disabled={isPending}>
              수락
            </Button>
          </>
        ) : (
          <Button variant="danger" outline size="small" onClick={handleDelete} disabled={isPending}>
            삭제
          </Button>
        )}
      </div>
    </li>
  )
}
