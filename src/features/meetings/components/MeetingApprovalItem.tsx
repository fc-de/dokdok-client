/**
 * @file MeetingApprovalItem.tsx
 * @description 약속 승인 아이템 컴포넌트
 */

import { Check } from 'lucide-react'
import { useState } from 'react'

import {
  formatDateTime,
  type MeetingApprovalItemType,
  useConfirmMeeting,
  useDeleteMeeting,
  useRejectMeeting,
} from '@/features/meetings'
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetTitle,
} from '@/shared/ui/BottomSheet'
import { Button } from '@/shared/ui/Button'
import { useGlobalModalStore } from '@/store'

export type MeetingApprovalItemProps = {
  /** 약속 승인 아이템 데이터 */
  item: MeetingApprovalItemType
  /** 모임 ID */
  gatheringId: number
}

/**
 * 약속 승인 아이템 컴포넌트
 *
 * @description
 * 약속 승인 리스트의 개별 아이템을 렌더링합니다.
 */
export default function MeetingApprovalItem({ item, gatheringId }: MeetingApprovalItemProps) {
  const { meetingName, bookName, nickname, startDateTime, endDateTime, meetingStatus, meetingId } =
    item

  const confirmMutation = useConfirmMeeting(gatheringId)
  const rejectMutation = useRejectMeeting(gatheringId)
  const deleteMutation = useDeleteMeeting(gatheringId)
  const isPending =
    confirmMutation.isPending || rejectMutation.isPending || deleteMutation.isPending
  const { openConfirm, openError } = useGlobalModalStore()
  const [isApproveSheetOpen, setIsApproveSheetOpen] = useState(false)

  const approveMeeting = () => {
    setIsApproveSheetOpen(false)

    confirmMutation.mutate(meetingId, {
      //Todo : 동시간에 승인할 수 없다고 별도로 알려주면 좋을듯
      onError: (error) => openError('에러', error.userMessage),
    })
  }

  const handleApprove = async () => {
    if (isPending) return
    const confirmed = await openConfirm('약속 승인', '약속을 승인 하시겠습니까?')
    if (!confirmed) return

    approveMeeting()
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
    <li className="flex items-center justify-between border-b gap-medium py-large border-grey-300 last:border-b-0 max-lg:flex-col max-lg:items-stretch max-lg:gap-base max-lg:py-6">
      <div className="flex min-w-0 flex-col gap-xtiny">
        <p className="typo-body4 text-grey-600 max-lg:hidden">{nickname}</p>
        <p className="hidden text-grey-600 max-lg:block max-lg:typo-m-body4">약속장</p>
        <p className="text-black typo-subtitle2 max-lg:truncate max-lg:typo-m-body2">
          {meetingName} | {bookName}
        </p>
        <p className="typo-body4 text-grey-600 max-lg:hidden">
          약속 일시 : {formatDateTime(startDateTime)} ~ {formatDateTime(endDateTime)}
        </p>
        <p className="hidden text-grey-600 max-lg:block max-lg:typo-m-body4">
          약속일시 {formatDateTime(startDateTime)} ~ {formatDateTime(endDateTime)}
        </p>
      </div>

      <div className="flex gap-small shrink-0 max-lg:w-full max-lg:gap-small">
        {meetingStatus === 'PENDING' ? (
          <>
            <Button
              variant="secondary"
              outline
              size="small"
              onClick={handleReject}
              disabled={isPending}
              className="max-lg:h-12 max-lg:flex-1 max-lg:border-none max-lg:bg-grey-100 max-lg:typo-m-subtitle1"
            >
              거절
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleApprove}
              disabled={isPending}
              className="max-lg:hidden"
            >
              승인
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsApproveSheetOpen(true)}
              disabled={isPending}
              className="hidden max-lg:h-12 max-lg:flex-1 max-lg:typo-m-subtitle1"
            >
              승인
            </Button>
          </>
        ) : (
          <Button variant="danger" outline size="small" onClick={handleDelete} disabled={isPending}>
            삭제
          </Button>
        )}
      </div>

      <BottomSheet open={isApproveSheetOpen} onOpenChange={setIsApproveSheetOpen}>
        <BottomSheetContent className="max-h-none">
          <BottomSheetBody className="flex-none px-5 pt-7 pb-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-100 text-primary-400">
              <Check aria-hidden className="size-7" strokeWidth={3} />
            </div>
            <BottomSheetTitle className="mt-6 text-black max-lg:typo-m-heading2">
              약속을 승인할까요?
            </BottomSheetTitle>
            <BottomSheetDescription className="mt-4 whitespace-pre-line text-grey-600 max-lg:typo-m-body1 max-lg:leading-6">
              승인하면 모임원들에게 약속이 공유돼요.\n승인 후에는 취소할 수 없어요.
            </BottomSheetDescription>
          </BottomSheetBody>
          <BottomSheetFooter className="px-5 pt-0">
            <BottomSheetClose asChild>
              <Button
                variant="secondary"
                size="large"
                className="flex-1 max-lg:h-12 max-lg:bg-grey-100 max-lg:typo-m-subtitle1"
              >
                취소
              </Button>
            </BottomSheetClose>
            <Button
              variant="primary"
              size="large"
              className="flex-1 max-lg:h-12 max-lg:typo-m-subtitle1"
              onClick={approveMeeting}
              disabled={isPending}
            >
              승인
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    </li>
  )
}
