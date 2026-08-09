import { useMemo, useState } from 'react'

import { useAuth } from '@/features/auth'
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
import { useDeferredLoading } from '@/shared/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'

import type { GetMeetingDetailResponse } from '../meetings.types'

interface MeetingTopicSectionProps {
  gatheringId: number
  meetingId: number
  meeting: GetMeetingDetailResponse | undefined
}

// "주제" 섹션 - 제안/확정 주제 탭. 데이터 페칭과 상태를 자체적으로 소유함
export default function MeetingTopicSection({
  gatheringId,
  meetingId,
  meeting,
}: MeetingTopicSectionProps) {
  const [userSelectedTab, setUserSelectedTab] = useState<TopicStatus | null>(null)
  const [isConfirmTopicOpen, setIsConfirmTopicOpen] = useState(false)

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
  } = useProposedTopics({ gatheringId, meetingId })

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
  } = useConfirmedTopics({ gatheringId, meetingId })

  const userId = useAuth().data?.userId
  const isParticipating = useMemo(
    () => meeting?.participants.members.some((member) => member.userId === userId) ?? false,
    [meeting?.participants.members, userId]
  )

  return (
    <>
      <p className="text-black typo-heading3">주제</p>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const tab = value as TopicStatus
          setUserSelectedTab(tab)
          if (tab === 'PROPOSED') void refetchProposed()
        }}
        className="gap-medium max-lg:gap-base"
      >
        <TabsList className="border-b border-grey-300 max-lg:border-0" size="medium">
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

      {isConfirmTopicOpen && (
        <ConfirmTopicModal
          open={isConfirmTopicOpen}
          onOpenChange={setIsConfirmTopicOpen}
          gatheringId={gatheringId}
          meetingId={meetingId}
        />
      )}
    </>
  )
}
