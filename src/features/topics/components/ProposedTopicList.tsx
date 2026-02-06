import { useInfiniteScroll, useVirtualList } from '@/features/topics/hooks'

import type { ProposedTopicItem } from '../topics.types'
import DefaultTopicCard from './DefaultTopicCard'
import TopicCard from './TopicCard'
import TopicListSkeleton from './TopicListSkeleton'

type ProposedTopicListProps = {
  topics: ProposedTopicItem[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  pageSize?: number
  gatheringId: number
  meetingId: number
}

export default function ProposedTopicList({
  topics,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  pageSize = 5,
  gatheringId,
  meetingId,
}: ProposedTopicListProps) {
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

  return (
    <div className="flex flex-col gap-small">
      {/* 기본 주제는 항상 표시 */}
      <DefaultTopicCard />

      {/* 제안된 주제 목록 (가상화) */}
      {topics.length > 0 && (
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
                  isLiked={topic.isLiked}
                  canDelete={topic.canDelete}
                  gatheringId={gatheringId}
                  meetingId={meetingId}
                  topicId={topic.topicId}
                />
              </li>
            )
          })}
        </ul>
      )}

      {/* 무한 스크롤 로딩 상태 */}
      {isFetchingNextPage && <TopicListSkeleton count={pageSize} />}

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && !isFetchingNextPage && <div ref={observerRef} className="h-4" />}
    </div>
  )
}
