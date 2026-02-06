import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'

import type { ConfirmedTopicItem } from '../topics.types'
import EmptyTopicList from './EmptyTopicList'
import TopicCard from './TopicCard'
import TopicListSkeleton from './TopicListSkeleton'

type ConfirmedTopicListProps = {
  topics: ConfirmedTopicItem[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  pageSize?: number
}

export default function ConfirmedTopicList({
  topics,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  pageSize = 5,
}: ConfirmedTopicListProps) {
  // 무한 스크롤: IntersectionObserver로 다음 페이지 로드
  const observerRef = useInfiniteScroll(onLoadMore, {
    hasNextPage,
    isFetchingNextPage,
  })

  if (topics.length === 0) {
    return <EmptyTopicList />
  }

  return (
    <div className="flex flex-col gap-small">
      <ul className="flex flex-col gap-small">
        {topics.map((topic) => (
          <li key={topic.topicId}>
            <TopicCard
              title={topic.title}
              topicTypeLabel={topic.topicTypeLabel}
              description={topic.description}
              createdByNickname={topic.createdByInfo.nickname}
              likeCount={topic.likeCount}
              isLikeDisabled
            />
          </li>
        ))}
      </ul>
      {/* 무한 스크롤 로딩 상태 */}
      {isFetchingNextPage && <TopicListSkeleton count={pageSize} />}

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && !isFetchingNextPage && <div ref={observerRef} className="h-4" />}
    </div>
  )
}
