import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { GatheringMember } from '@/features/gatherings'
import {
  useGatheringDetail,
  useGatheringMembers,
  useHandleJoinRequest,
} from '@/features/gatherings'
import { ROUTES } from '@/shared/constants'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import { Avatar, AvatarFallback, AvatarImage, Button, Spinner } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function MobileGatheringPendingMembersPage() {
  const { id } = useParams<{ id: string }>()
  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const {
    data: gathering,
    isLoading: isGatheringLoading,
    error: gatheringError,
  } = useGatheringDetail(gatheringId)
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    error: pendingError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGatheringMembers(gatheringId, 'PENDING', {
    enabled: gathering?.currentUserRole === 'LEADER',
  })
  const joinRequestMutation = useHandleJoinRequest()

  const pendingMembers = pendingData?.pages.flatMap((page) => page.items) ?? []

  useEffect(() => {
    if (!gatheringError && !pendingError) return

    openError('오류', '승인 대기 멤버를 불러오는 데 실패했습니다.', () => {
      navigate(ROUTES.GATHERING_SETTING(gatheringId), { replace: true })
    })
  }, [gatheringError, gatheringId, navigate, openError, pendingError])

  if (isGatheringLoading || isPendingLoading) return <Spinner height="full" />

  if (!gathering || gathering.currentUserRole !== 'LEADER') return null

  const handleMemberRequest = (member: GatheringMember, approveType: 'ACTIVE' | 'REJECTED') => {
    if (joinRequestMutation.isPending) return

    joinRequestMutation.mutate(
      { gatheringId, memberId: member.userId, approveType },
      {
        onSuccess: () => {
          showToast(
            approveType === 'ACTIVE'
              ? `${member.nickname}님의 가입을 승인했습니다.`
              : `${member.nickname}님의 가입을 거절했습니다.`
          )
          void refetch()
        },
        onError: () => {
          showErrorToast(
            approveType === 'ACTIVE' ? '가입 승인에 실패했습니다.' : '가입 거절에 실패했습니다.'
          )
        },
      }
    )
  }

  return (
    <MobileLayoutFrame
      variant="header"
      title="승인 대기 중인 멤버"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_SETTING(gatheringId) }}
      className="min-h-dvh lg:hidden"
      contentClassName="lg:hidden"
    >
      <main className="px-5 pt-5">
        {pendingMembers.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="typo-m-body1 text-grey-600">승인 대기 중인 멤버가 없어요.</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-grey-300">
              {pendingMembers.map((member) => (
                <li key={member.gatheringMemberId} className="flex items-center gap-3 py-6">
                  <Avatar className="size-10">
                    <AvatarImage src={member.profileImageUrl ?? undefined} alt={member.nickname} />
                    <AvatarFallback>{member.nickname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate typo-m-body1 text-black">
                    {member.nickname}
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      className="min-w-16"
                      disabled={joinRequestMutation.isPending}
                      onClick={() => handleMemberRequest(member, 'REJECTED')}
                    >
                      거절
                    </Button>
                    <Button
                      size="small"
                      className="min-w-16"
                      disabled={joinRequestMutation.isPending}
                      onClick={() => handleMemberRequest(member, 'ACTIVE')}
                    >
                      승인
                    </Button>
                  </div>
                </li>
              ))}
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
    </MobileLayoutFrame>
  )
}
