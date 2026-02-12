import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'

import type { ProposedTopicItem } from '../topics.types'
import DefaultTopicCard from './DefaultTopicCard'
import TopicCard from './TopicCard'
import TopicListSkeleton from './TopicListSkeleton'

type ProposedTopicListProps = {
  topics: ProposedTopicItem[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  gatheringId: number
  meetingId: number
}

export default function ProposedTopicList({
  topics,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  gatheringId,
  meetingId,
}: ProposedTopicListProps) {
  // 무한 스크롤: IntersectionObserver로 다음 페이지 로드
  const observerRef = useInfiniteScroll(onLoadMore, {
    hasNextPage,
    isFetchingNextPage,
  })

  return (
    <div className="flex flex-col gap-small">
      {/* 기본 주제는 항상 표시 */}
      <DefaultTopicCard />

      {/* 제안된 주제 목록 */}
      {topics.length > 0 && (
        <ul className="flex flex-col gap-small">
          {topics.map((topic) => (
            <li key={topic.topicId}>
              <TopicCard
                title={topic.title}
                topicTypeLabel={topic.topicTypeLabel}
                description={topic.description}
                createdByNickname={topic.createdByInfo.nickname}
                likeCount={topic.likeCount}
                isLiked={topic.isLiked}
                canDelete={topic.canDelete}
                gatheringId={gatheringId}
                meetingId={meetingId}
                topicId={topic.topicId}
              />
            </li>
          ))}
        </ul>
      )}

      {/* 무한 스크롤 로딩 상태 */}
      {isFetchingNextPage && <TopicListSkeleton />}

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && !isFetchingNextPage && <div ref={observerRef} className="h-4" />}
    </div>
  )
}
