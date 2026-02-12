import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { GatheringMember, MemberCardAction } from '@/features/gatherings'
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MemberCard,
  useDeleteGathering,
  useGatheringDetail,
  useGatheringMembers,
  useGatheringSettingForm,
  useHandleJoinRequest,
  useRemoveMember,
  useUpdateGathering,
} from '@/features/gatherings'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import {
  Button,
  Container,
  Input,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

type MemberTab = 'PENDING' | 'ACTIVE'

export default function GatheringSettingPage() {
  const { id } = useParams<{ id: string }>()
  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0
  const navigate = useNavigate()
  const { openConfirm, openError, openAlert } = useGlobalModalStore()

  const { data: gathering, isLoading, error } = useGatheringDetail(gatheringId)
  const { name, setName, description, setDescription, isValid, getFormData } =
    useGatheringSettingForm(gathering)

  const [activeTab, setActiveTab] = useState<MemberTab>('PENDING')

  const {
    data: pendingData,
    fetchNextPage: fetchNextPending,
    hasNextPage: hasNextPending,
    isFetchingNextPage: isFetchingNextPending,
  } = useGatheringMembers(gatheringId, 'PENDING')

  const {
    data: activeData,
    fetchNextPage: fetchNextActive,
    hasNextPage: hasNextActive,
    isFetchingNextPage: isFetchingNextActive,
  } = useGatheringMembers(gatheringId, 'ACTIVE')

  const pendingMembers = pendingData?.pages.flatMap((page) => page.items) ?? []
  const activeMembers = activeData?.pages.flatMap((page) => page.items) ?? []
  const pendingTotalCount = pendingData?.pages[0]?.totalCount ?? 0
  const activeTotalCount = activeData?.pages[0]?.totalCount ?? 0

  const updateMutation = useUpdateGathering()
  const deleteMutation = useDeleteGathering()
  const joinRequestMutation = useHandleJoinRequest()
  const removeMemberMutation = useRemoveMember()

  // 에러 처리
  useEffect(() => {
    if (error) {
      openError('오류', '모임 정보를 불러오는 데 실패했습니다.', () => {
        navigate(ROUTES.GATHERINGS)
      })
    }
  }, [error, openError, navigate])

  // 모임 정보 저장
  const handleSave = () => {
    if (!isValid || updateMutation.isPending) return

    updateMutation.mutate(
      { gatheringId, data: getFormData() },
      {
        onSuccess: () => {
          openAlert('알림', '모임 정보가 수정되었습니다.')
        },
        onError: () => {
          openError('오류', '모임 정보 수정에 실패했습니다.')
        },
      }
    )
  }

  // 모임 삭제
  const handleDeleteGathering = async () => {
    const confirmed = await openConfirm(
      '모임 삭제하기',
      '모임의 모든 정보와 기록이 사라지며, 다시 되돌릴 수 없어요.\n정말 이 모임을 삭제할까요?',
      { confirmText: '모임 삭제', variant: 'danger' }
    )
    if (!confirmed) return

    deleteMutation.mutate(gatheringId, {
      onSuccess: () => {
        navigate(ROUTES.GATHERINGS, { replace: true })
      },
      onError: () => {
        openError('오류', '모임 삭제에 실패했습니다.')
      },
    })
  }

  // 가입 요청 승인
  const handleApprove = (member: GatheringMember) => {
    joinRequestMutation.mutate(
      { gatheringId, memberId: member.userId, approveType: 'ACTIVE' },
      {
        onSuccess: () => {
          openAlert('알림', `${member.nickname}님의 가입을 승인했습니다.`)
        },
        onError: () => {
          openError('오류', '가입 승인에 실패했습니다.')
        },
      }
    )
  }

  // 가입 요청 거절
  const handleReject = (member: GatheringMember) => {
    joinRequestMutation.mutate(
      { gatheringId, memberId: member.userId, approveType: 'REJECTED' },
      {
        onSuccess: () => {
          openAlert('알림', `${member.nickname}님의 가입을 거절했습니다.`)
        },
        onError: () => {
          openError('오류', '가입 거절에 실패했습니다.')
        },
      }
    )
  }

  // 멤버 삭제(강퇴)
  const handleRemoveMember = async (member: GatheringMember) => {
    const confirmed = await openConfirm(
      `${member.nickname} 내보내기`,
      `내보낸 멤버는 이 모임에 더 이상 접근할 수 없어요.\n정말 이 멤버를 내보낼까요?`,
      { confirmText: '내보내기', variant: 'danger' }
    )
    if (!confirmed) return

    removeMemberMutation.mutate(
      { gatheringId, userId: member.userId },
      {
        onSuccess: () => {
          openAlert('알림', `${member.nickname}님을 모임에서 내보냈습니다.`)
        },
        onError: () => {
          openError('오류', '멤버 내보내기에 실패했습니다.')
        },
      }
    )
  }

  const handleMemberAction = (action: MemberCardAction, member: GatheringMember) => {
    switch (action) {
      case 'approve':
        handleApprove(member)
        break
      case 'reject':
        handleReject(member)
        break
      case 'remove':
        handleRemoveMember(member)
        break
    }
  }

  if (isLoading) {
    return <Spinner height="full" />
  }

  if (!gathering || gathering.currentUserRole !== 'LEADER') return null

  return (
    <div className="flex flex-col gap-xlarge pb-medium">
      <SubPageHeader to={ROUTES.GATHERING_DETAIL(gatheringId)} />

      <h2 className="typo-heading3 text-black">독서모임 설정</h2>
      {/* 독서모임 정보 섹션 */}
      <Container>
        <div className="flex items-center justify-between">
          <Container.Title>독서모임 정보</Container.Title>
          <div className="flex items-center gap-xsmall">
            <Button
              variant="danger"
              outline
              size="small"
              onClick={handleDeleteGathering}
              disabled={deleteMutation.isPending}
            >
              모임 삭제하기
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleSave}
              disabled={!isValid || updateMutation.isPending}
            >
              저장하기
            </Button>
          </div>
        </div>
        <Container.Content className="flex flex-col gap-medium">
          <Input
            label="독서모임 이름"
            placeholder="독서모임 이름을 입력해주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
          />
          <div className="flex flex-col gap-xsmall">
            <p className="text-left text-black typo-subtitle3">독서모임 설명</p>
            <Textarea
              placeholder="모임에 대한 설명을 적어주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={MAX_DESCRIPTION_LENGTH}
              height={80}
            />
          </div>
        </Container.Content>
      </Container>
      {/* 멤버 관리 섹션 */}
      <Container>
        <Container.Title>멤버 관리</Container.Title>
        <Container.Content>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as MemberTab)}
            className="gap-0"
          >
            <TabsList className="border-b border-grey-300" size="medium">
              <TabsTrigger value="PENDING" badge={pendingTotalCount} size="medium">
                승인 대기
              </TabsTrigger>
              <TabsTrigger value="ACTIVE" badge={activeTotalCount} size="medium">
                승인 완료
              </TabsTrigger>
            </TabsList>
            <TabsContent value="PENDING" className="pt-medium">
              {pendingMembers.length === 0 ? (
                <div className="flex h-35 items-center justify-center rounded-base border border-grey-300">
                  <p className="text-center text-grey-600 typo-subtitle2">
                    승인 대기 중인 멤버가 없어요.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-medium">
                  <div className="grid grid-cols-1 gap-medium md:grid-cols-2 lg:grid-cols-3">
                    {pendingMembers.map((member) => (
                      <MemberCard
                        key={member.gatheringMemberId}
                        member={member}
                        actions={['reject', 'approve']}
                        onAction={handleMemberAction}
                        disabled={joinRequestMutation.isPending}
                      />
                    ))}
                  </div>
                  {hasNextPending && (
                    <Button
                      variant="secondary"
                      outline
                      size="medium"
                      onClick={() => fetchNextPending()}
                      disabled={isFetchingNextPending}
                    >
                      {isFetchingNextPending ? '불러오는 중...' : '더보기'}
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="ACTIVE" className="pt-medium">
              {activeMembers.length === 0 ? (
                <div className="flex h-35 items-center justify-center rounded-base border border-grey-300">
                  <p className="text-center text-grey-600 typo-subtitle2">승인된 멤버가 없어요.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-medium">
                  <div className="grid grid-cols-1 gap-medium md:grid-cols-2 lg:grid-cols-3">
                    {activeMembers.map((member) => (
                      <MemberCard
                        key={member.gatheringMemberId}
                        member={member}
                        actions={['remove']}
                        onAction={handleMemberAction}
                        disabled={removeMemberMutation.isPending}
                      />
                    ))}
                  </div>
                  {hasNextActive && (
                    <Button
                      variant="secondary"
                      outline
                      size="medium"
                      onClick={() => fetchNextActive()}
                      disabled={isFetchingNextActive}
                    >
                      {isFetchingNextActive ? '불러오는 중...' : '더보기'}
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Container.Content>
      </Container>
    </div>
  )
}
