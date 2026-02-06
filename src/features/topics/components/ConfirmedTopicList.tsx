import { useInfiniteScroll, useVirtualList } from '@/features/topics/hooks'

import type { ConfirmedTopicItem } from '../topics.types'
import EmptyTopicList from './EmptyTopicList'
import TopicCard from './TopicCard'
import TopicListSkeleton from './TopicListSkeleton'

type ConfirmedTopicListProps = {
  topics: ConfirmedTopicItem[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  pageSize?: number
}

export default function ConfirmedTopicList({
  topics,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  pageSize = 5,
}: ConfirmedTopicListProps) {
  // 가상화: 화면에 보이는 아이템만 렌더링
  const { virtualizer, virtualItems } = useVirtualList({
    count: topics.length,
    estimateSize: 150,
    overscan: 5,
  })

  // 무한 스크롤: IntersectionObserver로 다음 페이지 로드
  const observerRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
  })

  if (topics.length === 0) {
    return <EmptyTopicList />
  }

  return (
    <div className="flex flex-col gap-small">
      <ul
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const topic = topics[virtualItem.index]
          return (
            <li
              key={topic.topicId}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TopicCard
                title={topic.title}
                topicTypeLabel={topic.topicTypeLabel}
                description={topic.description}
                createdByNickname={topic.createdByInfo.nickname}
                likeCount={topic.likeCount}
                isLikeDisabled
              />
            </li>
          )
        })}
      </ul>
      {/* 무한 스크롤 로딩 상태 */}
      {isFetchingNextPage && <TopicListSkeleton count={pageSize} />}

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && !isFetchingNextPage && <div ref={observerRef} className="h-4" />}
    </div>
  )
}
