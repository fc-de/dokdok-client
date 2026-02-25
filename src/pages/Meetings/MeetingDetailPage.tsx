import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  MeetingDetailButton,
  MeetingDetailHeader,
  MeetingDetailInfo,
  useMeetingDetail,
} from '@/features/meetings'
import { RetrospectiveCardButtons } from '@/features/retrospectives'
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
import { showErrorToast } from '@/shared/lib/toast'
import { Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'

export default function MeetingDetailPage() {
  const navigate = useNavigate()
  const { gatheringId, meetingId } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const [userSelectedTab, setUserSelectedTab] = useState<TopicStatus | null>(null)
  const [isConfirmTopicOpen, setIsConfirmTopicOpen] = useState(false)

  const {
    data: meeting,
    isLoading: meetingLoading,
    error: meetingError,
  } = useMeetingDetail(Number(meetingId))

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
    error: proposedError,
    refetch: refetchProposed,
    fetchNextPage: fetchNextProposedPage,
    hasNextPage: hasNextProposedPage,
    isFetchingNextPage: isFetchingNextProposedPage,
  } = useProposedTopics({
    gatheringId: Number(gatheringId),
    meetingId: Number(meetingId),
  })

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
    gatheringId: Number(gatheringId),
    meetingId: Number(meetingId),
  })

  useEffect(() => {
    if (meetingError) {
      showErrorToast(meetingError.userMessage)

      if (gatheringId && !isNaN(Number(gatheringId))) {
        navigate(ROUTES.GATHERING_DETAIL(Number(gatheringId)), { replace: true })
      }
    }
  }, [meetingError, navigate, gatheringId])

  if (!gatheringId || !meetingId) return null

  return (
    <>
      <SubPageHeader
        label={meeting?.gathering.gatheringName ?? '뒤로가기'}
        to={ROUTES.GATHERING_DETAIL(gatheringId)}
      />

      <div className="mx-auto max-w-layout-max px-layout-padding">
        <div className="flex justify-between gap-[36px]">
          {/* 약속 로딩 적용 */}
          <div className="w-[300px] flex-none flex flex-col gap-base">
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
                  gatheringId={Number(gatheringId)}
                  meetingId={meeting.meetingId}
                />
              </>
            ) : null}
          </div>
          {/* 약속 로딩 적용 */}

          <div className="flex flex-col flex-1 gap-base pb-base">
            {meeting?.progressStatus === 'POST' && (
              <RetrospectiveCardButtons
                gatheringId={Number(gatheringId)}
                meetingId={Number(meetingId)}
              />
            )}

            <p className="text-black typo-heading3">주제</p>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setUserSelectedTab(value as TopicStatus)}
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
                ) : isProposedLoading || !proposedTopicsInfiniteData ? (
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
                      gatheringId={Number(gatheringId)}
                      meetingId={Number(meetingId)}
                    />
                    <ProposedTopicList
                      topics={proposedTopicsInfiniteData.pages.flatMap(
                        (page: GetProposedTopicsResponse) => page.items
                      )}
                      confirmedTopic={meeting?.confirmedTopic ?? false}
                      hasNextPage={hasNextProposedPage}
                      isFetchingNextPage={isFetchingNextProposedPage}
                      onLoadMore={fetchNextProposedPage}
                      gatheringId={Number(gatheringId)}
                      meetingId={Number(meetingId)}
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
            gatheringId={Number(gatheringId)}
            meetingId={Number(meetingId)}
          />
        )}
      </div>
    </>
  )
}
