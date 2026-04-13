import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'

import type { ProposedTopicItem } from '../topics.types'
import TopicCard from './TopicCard'
import TopicListSkeleton from './TopicListSkeleton'

type ProposedTopicListProps = {
  topics: ProposedTopicItem[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  gatheringId: number
  meetingId: number
  confirmedTopic: boolean
  canLike: boolean
}

export default function ProposedTopicList({
  topics,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  gatheringId,
  meetingId,
  confirmedTopic,
  canLike,
}: ProposedTopicListProps) {
  // 무한 스크롤: IntersectionObserver로 다음 페이지 로드
  const observerRef = useInfiniteScroll(onLoadMore, {
    hasNextPage,
    isFetchingNextPage,
  })

  return (
    <div className="flex flex-col gap-small">
      {/* 제안된 주제 목록 */}

      <ul className="flex flex-col gap-small">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <li key={topic.topicId}>
              <TopicCard
                title={topic.title}
                topicTypeLabel={topic.topicTypeLabel}
                description={topic.description}
                createdByNickname={topic.createdByInfo.nickname}
                likeCount={topic.likeCount}
                isLiked={confirmedTopic ? false : topic.isLiked}
                canDelete={confirmedTopic ? false : topic.canDelete}
                gatheringId={gatheringId}
                meetingId={meetingId}
                topicId={topic.topicId}
                isLikeDisabled={confirmedTopic || !canLike}
              />
            </li>
          ))
        ) : (
          <li className="flex items-center justify-center py-large border-none mt-base">
            <p className="typo-body3 text-grey-600">제안된 주제가 없습니다.</p>
          </li>
        )}
      </ul>

      {/* 무한 스크롤 로딩 상태 */}
      {isFetchingNextPage && <TopicListSkeleton />}

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && !isFetchingNextPage && <div ref={observerRef} className="h-4" />}
    </div>
  )
}
