import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import {
  MeetingDetailButton,
  MeetingDetailHeader,
  MeetingDetailInfo,
  useMeetingDetail,
} from '@/features/meetings'
import { RetrospectiveCardButtons } from '@/features/retrospectives/meeting'
import type {
  GetConfirmedTopicsResponse,
  GetProposedTopicsResponse,
  TopicStatus,
} from '@/features/topics'
import {
  ConfirmedTopicList,
  ConfirmTopicModal,
  ProposedTopicList,
  TopicError,
  TopicHeader,
  TopicSkeleton,
  useConfirmedTopics,
  useProposedTopics,
} from '@/features/topics'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { useDeferredLoading } from '@/shared/hooks'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast } from '@/shared/lib/toast'
import { Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'

export default function MeetingDetailPage() {
  const navigate = useNavigate()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const parsedGatheringId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const parsedMeetingId = meetingIdParam ? Number(meetingIdParam) : NaN

  const gatheringId = Number.isFinite(parsedGatheringId) ? parsedGatheringId : 0
  const meetingId = Number.isFinite(parsedMeetingId) ? parsedMeetingId : 0

  const [userSelectedTab, setUserSelectedTab] = useState<TopicStatus | null>(null)
  const [isConfirmTopicOpen, setIsConfirmTopicOpen] = useState(false)

  const {
    data: meeting,
    isLoading: meetingLoading,
    error: meetingError,
  } = useMeetingDetail(meetingId)

  // 사용자 선택이 없으면 progressStatus에 따라 자동 결정
  const activeTab =
    userSelectedTab !== null
      ? userSelectedTab
      : meeting?.progressStatus === 'POST'
        ? 'CONFIRMED'
        : 'PROPOSED'

  // 제안된 주제 조회 (무한 스크롤)
  const {
    data: proposedTopicsInfiniteData,
    isLoading: isProposedLoading,
    isRefetching: isProposedRefetching,
    error: proposedError,
    refetch: refetchProposed,
    fetchNextPage: fetchNextProposedPage,
    hasNextPage: hasNextProposedPage,
    isFetchingNextPage: isFetchingNextProposedPage,
  } = useProposedTopics({
    gatheringId: gatheringId,
    meetingId: meetingId,
  })

  const showProposedSkeleton = useDeferredLoading(isProposedRefetching || isProposedLoading)

  // 확정된 주제 조회 (무한 스크롤)
  const {
    data: confirmedTopicsInfiniteData,
    isLoading: isConfirmedLoading,
    error: confirmedError,
    refetch: refetchConfirmed,
    fetchNextPage: fetchNextConfirmedPage,
    hasNextPage: hasNextConfirmedPage,
    isFetchingNextPage: isFetchingNextConfirmedPage,
  } = useConfirmedTopics({
    gatheringId: gatheringId,
    meetingId: meetingId,
  })

  const userId = useAuth().data?.userId
  const isParticipating = useMemo(
    () => meeting?.participants.members.some((member) => member.userId === userId) ?? false,
    [meeting?.participants.members, userId]
  )

  useEffect(() => {
    if (meetingError) {
      showErrorToast(meetingError.userMessage)

      if (gatheringId !== 0) {
        navigate(ROUTES.GATHERING_DETAIL(gatheringId), { replace: true })
      }
    }
  }, [meetingError, navigate, gatheringId])

  if (gatheringId === 0 || meetingId === 0) return null

  return (
    <MobileLayoutFrame
      variant="content"
      title=" "
      backTo={ROUTES.GATHERING_DETAIL(gatheringId)}
      className="min-h-dvh lg:min-h-0"
    >
      <SubPageHeader
        label={meeting?.gathering.gatheringName ?? '뒤로가기'}
        to={ROUTES.GATHERING_DETAIL(gatheringId)}
        className="max-lg:hidden"
      />

      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5 max-lg:pt-5">
        <div className="flex justify-between gap-[36px] max-lg:block max-lg:pt-large">
          {/* 약속 로딩 적용 */}
          <div className="w-[300px] flex-none flex flex-col gap-base max-lg:w-full">
            {meetingLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Spinner />
              </div>
            ) : meeting ? (
              <>
                <MeetingDetailHeader progressStatus={meeting.progressStatus}>
                  {meeting.meetingName}
                </MeetingDetailHeader>

                <MeetingDetailInfo meeting={meeting} />

                <MeetingDetailButton
                  buttonLabel={meeting.actionState.buttonLabel}
                  isEnabled={meeting.actionState.enabled}
                  type={meeting.actionState.type}
                  gatheringId={gatheringId}
                  meetingId={meeting.meetingId}
                />
              </>
            ) : null}
          </div>
          {/* 약속 로딩 적용 */}

          <div className="flex flex-col flex-1 gap-base pb-base">
            {meeting?.progressStatus === 'POST' && (
              <RetrospectiveCardButtons
                gatheringId={gatheringId}
                meetingId={meetingId}
                retrospectiveStatus={meeting.retrospectiveStatus}
                personalRetrospectiveWritten={meeting.personalRetrospectiveWritten}
              />
            )}

            <p className="text-black typo-heading3">주제</p>

            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                const tab = value as TopicStatus
                setUserSelectedTab(tab)
                if (tab === 'PROPOSED') void refetchProposed()
              }}
              className="gap-medium"
            >
              <TabsList className="border-b border-grey-300" size="medium">
                <TabsTrigger
                  className="typo-subtitle2"
                  value="PROPOSED"
                  badge={(proposedTopicsInfiniteData?.pages[0]?.totalCount ?? 0).toString()}
                  size="medium"
                >
                  제안
                </TabsTrigger>
                <TabsTrigger
                  className="typo-subtitle2"
                  value="CONFIRMED"
                  badge={(confirmedTopicsInfiniteData?.pages[0]?.totalCount ?? 0).toString()}
                  size="medium"
                >
                  확정된 주제
                </TabsTrigger>
              </TabsList>
              <TabsContent value="PROPOSED">
                {proposedError ? (
                  <TopicError
                    message="제안 주제를 불러오지 못했습니다"
                    onRetry={() => refetchProposed()}
                  />
                ) : showProposedSkeleton || !proposedTopicsInfiniteData ? (
                  <TopicSkeleton />
                ) : (
                  <div className="flex flex-col gap-base">
                    <TopicHeader
                      activeTab="PROPOSED"
                      confirmedTopic={meeting?.confirmedTopic ?? false}
                      actions={proposedTopicsInfiniteData.pages[0].actions}
                      confirmedTopicDate={meeting?.confirmedTopicDate ?? null}
                      proposedTopicsCount={proposedTopicsInfiniteData.pages[0].totalCount ?? 0}
                      onOpenChange={setIsConfirmTopicOpen}
                      gatheringId={gatheringId}
                      meetingId={meetingId}
                    />
                    <ProposedTopicList
                      topics={proposedTopicsInfiniteData.pages.flatMap(
                        (page: GetProposedTopicsResponse) => page.items
                      )}
                      confirmedTopic={meeting?.confirmedTopic ?? false}
                      hasNextPage={hasNextProposedPage}
                      isFetchingNextPage={isFetchingNextProposedPage}
                      onLoadMore={fetchNextProposedPage}
                      gatheringId={gatheringId}
                      meetingId={meetingId}
                      canLike={proposedTopicsInfiniteData.pages[0].actions.canLike}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="CONFIRMED">
                {confirmedError ? (
                  <TopicError
                    message="확정된 주제를 불러오지 못했습니다"
                    onRetry={() => refetchConfirmed()}
                  />
                ) : isConfirmedLoading || !confirmedTopicsInfiniteData ? (
                  <TopicSkeleton />
                ) : (
                  <div className="flex flex-col gap-base">
                    <TopicHeader
                      activeTab="CONFIRMED"
                      confirmedTopic={meeting?.confirmedTopic ?? false}
                      actions={confirmedTopicsInfiniteData.pages[0].actions}
                      confirmedTopicDate={meeting?.confirmedTopicDate ?? null}
                      progressStatus={meeting?.progressStatus ?? 'PRE'}
                      gatheringId={gatheringId}
                      meetingId={meetingId}
                      isParticipating={isParticipating}
                    />
                    <ConfirmedTopicList
                      topics={confirmedTopicsInfiniteData.pages.flatMap(
                        (page: GetConfirmedTopicsResponse) => page.items
                      )}
                      hasNextPage={hasNextConfirmedPage}
                      isFetchingNextPage={isFetchingNextConfirmedPage}
                      onLoadMore={fetchNextConfirmedPage}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {isConfirmTopicOpen && (
          <ConfirmTopicModal
            open={isConfirmTopicOpen}
            onOpenChange={setIsConfirmTopicOpen}
            gatheringId={gatheringId}
            meetingId={meetingId}
          />
        )}
      </div>
    </MobileLayoutFrame>
  )
}
