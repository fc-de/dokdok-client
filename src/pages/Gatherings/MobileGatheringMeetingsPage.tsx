import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useGatheringDetail } from '@/features/gatherings'
import {
  formatDateTime,
  type MeetingApprovalItemType,
  useDeleteMeeting,
  useMeetingApprovals,
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

export default function MobileGatheringMeetingsPage() {
  const { id } = useParams<{ id: string }>()
  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const [page, setPage] = useState(0)
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingApprovalItemType | null>(null)
  const {
    data: gathering,
    isLoading: isGatheringLoading,
    error: gatheringError,
  } = useGatheringDetail(gatheringId)
  const {
    data: meetingData,
    isLoading: isMeetingsLoading,
    error: meetingsError,
    refetch,
  } = useMeetingApprovals({
    gatheringId,
    status: 'CONFIRMED',
    page,
    size: PAGE_SIZES.MEETING_APPROVALS,
  })
  const deleteMutation = useDeleteMeeting(gatheringId)

  useEffect(() => {
    if (!gatheringError && !meetingsError) return

    openError('오류', '약속을 불러오는 데 실패했습니다.', () => {
      navigate(ROUTES.GATHERING_SETTING(gatheringId), { replace: true })
    })
  }, [gatheringError, gatheringId, meetingsError, navigate, openError])

  if (isGatheringLoading || isMeetingsLoading) return <Spinner height="full" />

  if (!gathering || gathering.currentUserRole !== 'LEADER') return null

  const items = meetingData?.items ?? []

  const handleDelete = () => {
    if (!selectedMeeting || deleteMutation.isPending) return

    deleteMutation.mutate(selectedMeeting.meetingId, {
      onSuccess: () => {
        showToast('약속을 삭제했습니다.')
        setSelectedMeeting(null)
        void refetch()
      },
      onError: () => {
        showErrorToast('약속 삭제에 실패했습니다.')
      },
    })
  }

  const handleNextPage = () => {
    if (!meetingData || page >= meetingData.totalPages - 1) return
    setPage((currentPage) => currentPage + 1)
  }

  return (
    <MobileLayoutFrame
      variant="header"
      title="약속 관리"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_SETTING(gatheringId) }}
      className="min-h-dvh lg:hidden"
      contentClassName="lg:hidden"
    >
      <main className="px-5 pt-5">
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="typo-m-body1 text-grey-600">관리할 약속이 없어요.</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-grey-300">
              {items.map((item) => (
                <li key={item.meetingId} className="flex items-start gap-3 py-base">
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 typo-m-caption1 text-grey-600">약속장</p>
                    <p className="mb-1 truncate typo-m-body1 text-black">
                      {item.meetingName} | {item.bookName}
                    </p>
                    <p className="typo-m-caption1 text-grey-600">
                      {formatDateTime(item.startDateTime)} ~ {formatDateTime(item.endDateTime)}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="small"
                    className="mt-2.5 shrink-0 min-w-16"
                    disabled={deleteMutation.isPending}
                    onClick={() => setSelectedMeeting(item)}
                  >
                    삭제
                  </Button>
                </li>
              ))}
            </ul>
            {meetingData && page < meetingData.totalPages - 1 && (
              <Button
                variant="secondary"
                outline
                size="medium"
                className="mt-5 w-full"
                disabled={deleteMutation.isPending}
                onClick={handleNextPage}
              >
                다음 약속 보기
              </Button>
            )}
          </>
        )}
      </main>

      <BottomSheet
        open={selectedMeeting !== null}
        onOpenChange={(open) => !open && setSelectedMeeting(null)}
      >
        <BottomSheetContent className="lg:hidden">
          <BottomSheetBody className="flex flex-col items-center px-5 pb-5 pt-3 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent-100">
              <span aria-hidden className="text-[24px] leading-none font-semibold text-accent-300">
                !
              </span>
            </div>
            <BottomSheetTitle className="mb-2 typo-m-heading2 text-black">
              삭제를 진행할까요?
            </BottomSheetTitle>
            <BottomSheetDescription className="typo-m-body1 text-[#545454]">
              삭제된 약속은 리스트에서 사라지며 복구할 수 없어요.\n정말 이 약속을 삭제할까요?
            </BottomSheetDescription>
          </BottomSheetBody>
          <BottomSheetFooter className="gap-[10px]">
            <BottomSheetClose asChild>
              <Button
                variant="secondary"
                className="h-11 flex-1"
                disabled={deleteMutation.isPending}
              >
                취소
              </Button>
            </BottomSheetClose>
            <Button
              variant="danger"
              className="h-11 flex-1 bg-accent-200"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              aria-busy={deleteMutation.isPending}
            >
              삭제
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    </MobileLayoutFrame>
  )
}
