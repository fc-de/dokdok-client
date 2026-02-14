import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  MeetingDetailButton,
  MeetingDetailHeader,
  MeetingDetailInfo,
  useMeetingDetail,
} from '@/features/meetings'
import type {
  GetConfirmedTopicsResponse,
  GetProposedTopicsResponse,
  TopicStatus,
} from '@/features/topics'
import {
  ConfirmedTopicList,
  ConfirmTopicModal,
  ProposedTopicList,
  TopicHeader,
  TopicSkeleton,
  useConfirmedTopics,
  useProposedTopics,
} from '@/features/topics'
import { Spinner, Tabs, TabsContent, TabsList, TabsTrigger, TextButton } from '@/shared/ui'

export default function MeetingDetailPage() {
  const { gatheringId, meetingId } = useParams<{ gatheringId: string; meetingId: string }>()

  const [activeTab, setActiveTab] = useState<TopicStatus>('PROPOSED')
  const [isConfirmTopicOpen, setIsConfirmTopicOpen] = useState(false)

  const {
    data: meeting,
    isLoading: meetingLoading,
    error: meetingError,
  } = useMeetingDetail(Number(meetingId))

  // 제안된 주제 조회 (무한 스크롤)
  const {
    data: proposedTopicsInfiniteData,
    isLoading: isProposedLoading,
    error: proposedError,
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
    fetchNextPage: fetchNextConfirmedPage,
    hasNextPage: hasNextConfirmedPage,
    isFetchingNextPage: isFetchingNextConfirmedPage,
  } = useConfirmedTopics({
    gatheringId: Number(gatheringId),
    meetingId: Number(meetingId),
  })

  // 에러 처리
  useEffect(() => {
    if (proposedError) {
      alert(`제안된 주제 조회 실패: ${proposedError.userMessage}`)
    }
    if (confirmedError) {
      alert(`확정된 주제 조회 실패: ${confirmedError.userMessage}`)
    }
    if (meetingError) {
      alert(`약속 조회 실패: ${meetingError.userMessage}`)
    }
    // navigate(ROUTES.GATHERING_DETAIL(gatheringId), { replace: true })
  }, [proposedError, confirmedError, meetingError])

  return (
    <>
      {/* 공통컴포넌트로 분리 예정 */}
      <div className="sticky top-0 bg-white py-medium">
        <TextButton iconPosition="left" icon={ChevronLeft} size="medium">
          {meeting?.gathering.gatheringName ?? ''}
        </TextButton>
      </div>
      {/* 공통컴포넌트로 분리 예정 */}

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
          <p className="text-black typo-heading3">주제</p>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TopicStatus)}
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
              {isProposedLoading || !proposedTopicsInfiniteData ? (
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
              {isConfirmedLoading || !confirmedTopicsInfiniteData ? (
                <TopicSkeleton />
              ) : (
                <div className="flex flex-col gap-base">
                  <TopicHeader
                    activeTab="CONFIRMED"
                    confirmedTopic={meeting?.confirmedTopic ?? false}
                    actions={confirmedTopicsInfiniteData.pages[0].actions}
                    confirmedTopicDate={meeting?.confirmedTopicDate ?? null}
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
    </>
  )
}
