import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { GatheringMember } from '@/features/gatherings'
import { useGatheringDetail, useGatheringMembers, useRemoveMember } from '@/features/gatherings'
import { ROUTES } from '@/shared/constants'
import { MobileLayoutFrame } from '@/shared/layout'
import { formatToShortDate } from '@/shared/lib/date'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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

export default function MobileGatheringMembersPage() {
  const { id } = useParams<{ id: string }>()
  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const [selectedMember, setSelectedMember] = useState<GatheringMember | null>(null)
  const {
    data: gathering,
    isLoading: isGatheringLoading,
    error: gatheringError,
  } = useGatheringDetail(gatheringId)
  const {
    data: memberData,
    isLoading: isMembersLoading,
    error: membersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGatheringMembers(gatheringId, 'ACTIVE', {
    enabled: gathering?.currentUserRole === 'LEADER',
  })
  const removeMemberMutation = useRemoveMember()

  const members = memberData?.pages.flatMap((page) => page.items) ?? []

  useEffect(() => {
    if (!gatheringError && !membersError) return

    openError('오류', '멤버를 불러오는 데 실패했습니다.', () => {
      navigate(ROUTES.GATHERING_SETTING(gatheringId), { replace: true })
    })
  }, [gatheringError, gatheringId, membersError, navigate, openError])

  if (isGatheringLoading || isMembersLoading) return <Spinner height="full" />

  if (!gathering || gathering.currentUserRole !== 'LEADER') return null

  const handleRemoveMember = () => {
    if (!selectedMember || removeMemberMutation.isPending) return

    removeMemberMutation.mutate(
      { gatheringId, userId: selectedMember.userId },
      {
        onSuccess: () => {
          showToast(`${selectedMember.nickname}님을 모임에서 내보냈습니다.`)
          setSelectedMember(null)
          void refetch()
        },
        onError: () => {
          showErrorToast('멤버 내보내기에 실패했습니다.')
        },
      }
    )
  }

  return (
    <MobileLayoutFrame
      variant="header"
      title="멤버 관리"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_SETTING(gatheringId) }}
      className="min-h-dvh lg:hidden"
      contentClassName="lg:hidden"
    >
      <main className="px-5 pt-5">
        {members.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="typo-m-body1 text-grey-600">승인된 멤버가 없어요.</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-grey-300">
              {members.map((member) => {
                const isLeader = member.role === 'LEADER'

                return (
                  <li key={member.gatheringMemberId} className="flex items-center gap-3 py-6">
                    <Avatar className="size-10" variant={isLeader ? 'leader' : 'member'}>
                      <AvatarImage
                        src={member.profileImageUrl ?? undefined}
                        alt={member.nickname}
                      />
                      <AvatarFallback>{member.nickname.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate typo-m-body1 text-black">{member.nickname}</p>
                      {member.joinedAt && (
                        <p className="typo-m-caption1 text-grey-600">
                          {formatToShortDate(member.joinedAt)} 가입
                        </p>
                      )}
                    </div>
                    {!isLeader && (
                      <Button
                        variant="danger"
                        size="small"
                        className="min-w-16"
                        disabled={removeMemberMutation.isPending}
                        onClick={() => setSelectedMember(member)}
                      >
                        탈퇴
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
            {hasNextPage && (
              <Button
                variant="secondary"
                outline
                size="medium"
                className="mt-5 w-full"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? '불러오는 중...' : '더보기'}
              </Button>
            )}
          </>
        )}
      </main>

      <BottomSheet
        open={selectedMember !== null}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <BottomSheetContent className="lg:hidden">
          <BottomSheetBody className="flex flex-col items-center px-5 pb-5 pt-3 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent-100">
              <span aria-hidden className="text-[24px] leading-none font-semibold text-accent-300">
                !
              </span>
            </div>
            <BottomSheetTitle className="mb-2 typo-m-heading2 text-black">
              탈퇴를 진행할까요?
            </BottomSheetTitle>
            <BottomSheetDescription className="typo-m-body1 text-[#545454]">
              내보낸 멤버는 이 모임에 더 이상 접근할 수 없어요.\n정말 이 멤버를 내보낼까요?
            </BottomSheetDescription>
          </BottomSheetBody>
          <BottomSheetFooter className="gap-[10px]">
            <BottomSheetClose asChild>
              <Button
                variant="secondary"
                className="h-11 flex-1"
                disabled={removeMemberMutation.isPending}
              >
                취소
              </Button>
            </BottomSheetClose>
            <Button
              variant="danger"
              className="h-11 flex-1 bg-accent-200"
              onClick={handleRemoveMember}
              disabled={removeMemberMutation.isPending}
              aria-busy={removeMemberMutation.isPending}
            >
              탈퇴
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    </MobileLayoutFrame>
  )
}
