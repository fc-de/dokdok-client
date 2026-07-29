import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useGatheringDetail } from '@/features/gatherings'
import {
  formatDateTime,
  type MeetingApprovalItemType,
  useConfirmMeeting,
  useMeetingApprovals,
  useRejectMeeting,
} from '@/features/meetings'
import { PAGE_SIZES, ROUTES } from '@/shared/constants'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetTitle,
  Button,
  Spinner,
} from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

type PendingMeetingAction = {
  item: MeetingApprovalItemType
  type: 'approve' | 'reject'
}

function MobileGatheringMemberPendingMeetingsPage({ gatheringId }: { gatheringId: number }) {
  return (
    <MobileLayoutFrame
      variant="header"
      title="승인 대기 중인 약속"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_SETTING(gatheringId) }}
      className="min-h-dvh lg:hidden"
      contentClassName="lg:hidden"
    >
      <main className="px-5 pt-5">
        {/* TODO(backend): 모임원이 신청한 PENDING 약속 목록을 조회하는 API가 필요하다. */}
        <div className="flex h-40 items-center justify-center">
          <p className="text-center typo-m-body1 text-grey-600">
            승인 대기 중인 약속 조회 기능을 준비하고 있어요.
          </p>
        </div>
      </main>
    </MobileLayoutFrame>
  )
}

function MobileGatheringLeaderPendingMeetingsPage({ gatheringId }: { gatheringId: number }) {
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const [page, setPage] = useState(0)
  const [pendingAction, setPendingAction] = useState<PendingMeetingAction | null>(null)
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    error: pendingError,
    refetch,
  } = useMeetingApprovals({
    gatheringId,
    status: 'PENDING',
    page,
    size: PAGE_SIZES.MEETING_APPROVALS,
  })
  const confirmMutation = useConfirmMeeting(gatheringId)
  const rejectMutation = useRejectMeeting(gatheringId)

  useEffect(() => {
    if (!pendingError) return

    openError('오류', '승인 대기 약속을 불러오는 데 실패했습니다.', () => {
      navigate(ROUTES.GATHERING_SETTING(gatheringId), { replace: true })
    })
  }, [gatheringId, navigate, openError, pendingError])

  if (isPendingLoading) return <Spinner height="full" />

  const isMutating = confirmMutation.isPending || rejectMutation.isPending
  const items = pendingData?.items ?? []

  const handleApproval = (item: MeetingApprovalItemType) => {
    if (isMutating) return

    confirmMutation.mutate(item.meetingId, {
      onSuccess: () => {
        showToast('약속을 승인했습니다.')
        setPendingAction(null)
        void refetch()
      },
      onError: () => {
        showErrorToast('약속 승인에 실패했습니다.')
      },
    })
  }

  const handleRejection = (item: MeetingApprovalItemType) => {
    if (isMutating) return

    rejectMutation.mutate(item.meetingId, {
      onSuccess: () => {
        showToast('약속을 거절했습니다.')
        setPendingAction(null)
        void refetch()
      },
      onError: () => {
        showErrorToast('약속 거절에 실패했습니다.')
      },
    })
  }

  const handleNextPage = () => {
    if (!pendingData || page >= pendingData.totalPages - 1) return
    setPage((currentPage) => currentPage + 1)
  }

  const handlePendingAction = () => {
    if (!pendingAction) return

    if (pendingAction.type === 'approve') {
      handleApproval(pendingAction.item)
      return
    }

    handleRejection(pendingAction.item)
  }

  const isApproving = pendingAction?.type === 'approve'

  return (
    <MobileLayoutFrame
      variant="header"
      title="승인 대기 중인 약속"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_SETTING(gatheringId) }}
      className="min-h-dvh lg:hidden"
      contentClassName="lg:hidden"
    >
      <main className="px-5 pt-5">
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="typo-m-body1 text-grey-600">승인 대기 중인 약속이 없어요.</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-grey-300">
              {items.map((item) => (
                <li key={item.meetingId} className="py-base">
                  <p className="mb-1 typo-m-caption1 text-grey-600">약속장</p>
                  <p className="mb-1 truncate typo-m-body1 text-black">
                    {item.meetingName} | {item.bookName}
                  </p>
                  <p className="mb-3 typo-m-caption1 text-grey-600">
                    {formatDateTime(item.startDateTime)} ~ {formatDateTime(item.endDateTime)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      className="flex-1"
                      disabled={isMutating}
                      onClick={() => setPendingAction({ item, type: 'reject' })}
                    >
                      거절
                    </Button>
                    <Button
                      size="small"
                      className="flex-1"
                      disabled={isMutating}
                      onClick={() => setPendingAction({ item, type: 'approve' })}
                    >
                      승인
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {pendingData && page < pendingData.totalPages - 1 && (
              <Button
                variant="secondary"
                outline
                size="medium"
                className="mt-5 w-full"
                disabled={isMutating}
                onClick={handleNextPage}
              >
                다음 약속 보기
              </Button>
            )}
          </>
        )}
      </main>

      <BottomSheet
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <BottomSheetContent className="lg:hidden">
          <BottomSheetBody className="flex flex-col items-center px-5 pb-5 pt-3 text-center">
            {isApproving ? (
              <div className="mb-4 flex size-[54px] items-center justify-center rounded-full bg-primary-150">
                <Check aria-hidden className="size-6 text-primary-300" />
              </div>
            ) : (
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent-100">
                <span
                  aria-hidden
                  className="text-[24px] leading-none font-semibold text-accent-300"
                >
                  !
                </span>
              </div>
            )}
            <BottomSheetTitle className="mb-2 typo-m-heading2 text-black">
              {isApproving ? '약속을 승인할까요?' : '약속을 거절할까요?'}
            </BottomSheetTitle>
            <BottomSheetDescription className="typo-m-body1 text-[#545454]">
              {isApproving
                ? '승인하면 모임원들에게 약속이 공유돼요.\n승인 후에는 취소할 수 없어요.'
                : '거절하면 모임원들에게 약속이 공유되지 않아요.\n정말 이 약속을 거절할까요?'}
            </BottomSheetDescription>
          </BottomSheetBody>
          <BottomSheetFooter className="gap-[10px]">
            <BottomSheetClose asChild>
              <Button variant="secondary" className="h-11 flex-1" disabled={isMutating}>
                취소
              </Button>
            </BottomSheetClose>
            <Button
              variant={isApproving ? 'primary' : 'danger'}
              className={isApproving ? 'h-11 flex-1' : 'h-11 flex-1 bg-accent-200'}
              onClick={handlePendingAction}
              disabled={isMutating}
              aria-busy={isMutating}
            >
              {isApproving ? '승인' : '거절'}
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    </MobileLayoutFrame>
  )
}

export default function MobileGatheringPendingMeetingsPage() {
  const { id } = useParams<{ id: string }>()
  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const { data: gathering, isLoading, error } = useGatheringDetail(gatheringId)

  useEffect(() => {
    if (!error) return

    openError('오류', '모임 정보를 불러오는 데 실패했습니다.', () => {
      navigate(ROUTES.GATHERING_SETTING(gatheringId), { replace: true })
    })
  }, [error, gatheringId, navigate, openError])

  if (isLoading) return <Spinner height="full" />

  if (!gathering) return null

  return gathering.currentUserRole === 'LEADER' ? (
    <MobileGatheringLeaderPendingMeetingsPage gatheringId={gatheringId} />
  ) : (
    <MobileGatheringMemberPendingMeetingsPage gatheringId={gatheringId} />
  )
}
