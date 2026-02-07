import { useEffect, useMemo, useRef, useState } from 'react'

import {
  FilterDropdown,
  StarRatingFilter,
  type StarRatingRange,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared/ui'

import type { BookReadingStatus, RecordSortType } from '../book.types'
import { useBooks, useMyGatherings } from '../hooks'
import BookCard from './BookCard'

type BookListProps = {
  status?: BookReadingStatus
  /** 현재 활성 탭인지 여부 (비활성 탭에서 onFilteredBooksChange 호출 방지) */
  isActive?: boolean
  /** 편집 모드 여부 */
  isEditMode?: boolean
  /** 선택된 책 ID 목록 */
  selectedBookIds?: Set<number>
  /** 선택 토글 핸들러 */
  onSelectToggle?: (bookId: number) => void
  /** 필터링된 책 목록이 변경될 때 호출되는 콜백 */
  onFilteredBooksChange?: (bookIds: number[]) => void
}

/**
 * 책 목록 컴포넌트
 *
 * 상태에 따라 책 목록을 조회하고 그리드로 표시합니다.
 * 무한스크롤, 로딩, 에러, 빈 상태를 처리합니다.
 *
 * @example
 * ```tsx
 * // 전체 책 목록
 * <BookList />
 *
 * // 읽는 중인 책만
 * <BookList status="READING" />
 *
 * // 읽기 완료된 책만
 * <BookList status="COMPLETED" />
 *
 * // 편집 모드
 * <BookList
 *   isEditMode
 *   selectedBookIds={selectedIds}
 *   onSelectToggle={(id) => toggleSelection(id)}
 * />
 * ```
 */
function BookList({
  status,
  isActive = true,
  isEditMode = false,
  selectedBookIds,
  onSelectToggle,
  onFilteredBooksChange,
}: BookListProps) {
  // 필터 상태
  const [selectedGathering, setSelectedGathering] = useState<string>('')
  const [rating, setRating] = useState<StarRatingRange | null>(null)
  const [sortType, setSortType] = useState<RecordSortType>('LATEST')
  const [openDropdown, setOpenDropdown] = useState<'gathering' | null>(null)

  // 무한스크롤 감지용 ref
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 모임 목록 조회
  const {
    data: gatheringsData,
    isLoading: isGatheringsLoading,
    fetchNextPage: fetchNextGatherings,
    hasNextPage: hasNextGatherings,
  } = useMyGatherings()

  const gatherings = gatheringsData?.pages.flatMap((page) => page.items) ?? []

  // 선택된 모임명 찾기
  const selectedGatheringName = gatherings.find(
    (g) => String(g.gatheringId) === selectedGathering
  )?.gatheringName

  // 책 목록 조회 (필터 적용, 무한스크롤)
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useBooks({
    status,
    gatheringId: selectedGathering ? Number(selectedGathering) : undefined,
    ratingMin: rating?.min,
    ratingMax: rating?.max,
    sort: sortType,
  })

  // 무한스크롤 Intersection Observer
  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleGatheringChange = (value: string) => {
    setSelectedGathering(value)
  }

  // 모든 페이지의 책 목록 합치기 (참조 안정성을 위해 메모이제이션)
  const books = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data?.pages])

  // 필터링된 책 ID 목록
  const bookIds = useMemo(() => books.map((book) => book.bookId), [books])

  // 필터링된 책 목록이 변경될 때 부모에 알림 (활성 탭일 때만)
  useEffect(() => {
    if (isActive) {
      onFilteredBooksChange?.(bookIds)
    }
  }, [bookIds, onFilteredBooksChange, isActive])

  if (isError) {
    return (
      <div className="py-xlarge text-center">
        <p className="typo-body2 text-grey-600">책 목록을 불러오는데 실패했습니다.</p>
      </div>
    )
  }

  const isEmpty = !isLoading && books.length === 0

  return (
    <div>
      <div className="flex justify-between mt-medium">
        <div className="flex flex-wrap gap-xsmall">
          <FilterDropdown
            placeholder="독서모임"
            value={selectedGathering}
            onChange={handleGatheringChange}
            disabled={isLoading || isGatheringsLoading || gatherings.length === 0}
            open={openDropdown === 'gathering'}
            onOpenChange={(open) => setOpenDropdown(open ? 'gathering' : null)}
          >
            {gatherings.map((gathering) => (
              <FilterDropdown.Option
                key={gathering.gatheringId}
                value={String(gathering.gatheringId)}
              >
                {gathering.gatheringName}
              </FilterDropdown.Option>
            ))}
            {hasNextGatherings && (
              <button
                type="button"
                className="w-full py-xsmall typo-caption1 text-grey-500 hover:text-grey-700"
                onClick={() => fetchNextGatherings()}
              >
                더 보기
              </button>
            )}
          </FilterDropdown>
          <StarRatingFilter
            placeholder="별점"
            value={rating}
            onChange={setRating}
            disabled={isLoading}
          />
        </div>
        <Tabs value={sortType} onValueChange={(v) => setSortType(v as RecordSortType)}>
          <TabsList size="small" className="gap-0">
            <TabsTrigger value="LATEST" size="small" disabled={isLoading}>
              최신순
            </TabsTrigger>
            <span className="typo-caption1 text-grey-600 px-xsmall">·</span>
            <TabsTrigger value="OLDEST" size="small" disabled={isLoading}>
              오래된순
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {isLoading ? (
        <BookListSkeleton />
      ) : isEmpty ? (
        <BookListEmpty status={status} hasFilters={!!selectedGathering || !!rating} />
      ) : (
        <>
          <div className="grid grid-cols-6 gap-large mt-large">
            {books.map((book) => (
              <BookCard
                key={book.bookId}
                book={book}
                selectedGatheringName={selectedGatheringName}
                isEditMode={isEditMode}
                isSelected={selectedBookIds?.has(book.bookId)}
                onSelectToggle={onSelectToggle}
              />
            ))}
          </div>
          {/* 무한스크롤 트리거 */}
          <div ref={loadMoreRef} className="h-10">
            {isFetchingNextPage && <BookListLoadingMore />}
          </div>
        </>
      )}
    </div>
  )
}

function BookListSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-large mt-large">
      {[...Array(6).keys()].map((index) => (
        <div key={index} className="flex flex-col gap-small animate-pulse">
          <div className="aspect-3/4 rounded-small bg-grey-200" />
          <div className="flex flex-col gap-xxtiny">
            <div className="h-5 bg-grey-200 rounded w-3/4" />
            <div className="h-4 bg-grey-200 rounded w-1/2" />
            <div className="h-4 bg-grey-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function BookListLoadingMore() {
  return (
    <div className="flex justify-center py-medium">
      <div className="size-6 border-2 border-grey-300 border-t-grey-600 rounded-full animate-spin" />
    </div>
  )
}

function BookListEmpty({
  status,
  hasFilters,
}: {
  status?: BookReadingStatus
  hasFilters?: boolean
}) {
  const getMessage = () => {
    if (hasFilters) {
      return '조건에 맞는 책이 없어요.'
    }

    switch (status) {
      case 'READING':
        return '기록 중인 책이 없어요.'
      case 'COMPLETED':
        return '기록 완료인 책이 없어요.'
      default:
        return (
          <>
            저장된 책이 없어요.
            <br />첫 책을 추가해보세요!
          </>
        )
    }
  }

  return (
    <div className="flex items-center justify-center h-[140px] text-center border rounded-base border-grey-300 mt-large">
      <p className="typo-subtitle2 text-grey-600">{getMessage()}</p>
    </div>
  )
}

export default BookList
