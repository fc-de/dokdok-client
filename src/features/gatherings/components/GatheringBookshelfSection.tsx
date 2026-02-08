import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

import { useGatheringBooks } from '../hooks/useGatheringBooks'
import EmptyState from './EmptyState'
import GatheringBookCard from './GatheringBookCard'

interface GatheringBookshelfSectionProps {
  gatheringId: number
}

/** 캐러셀 스크롤 이동량 (픽셀) */
const SCROLL_AMOUNT = 300

export default function GatheringBookshelfSection({ gatheringId }: GatheringBookshelfSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGatheringBooks({
    gatheringId,
    size: 20,
  })

  const books = data?.pages.flatMap((page) => page.items) ?? []
  const hasBooks = books.length > 0

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' })
  }

  const handleScrollRight = async () => {
    const container = scrollContainerRef.current
    if (!container) return

    // 스크롤 끝에 도달했는지 확인 (여유값 10px)
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10

    if (isAtEnd && hasNextPage && !isFetchingNextPage) {
      await fetchNextPage()
    }

    container.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <section className="flex flex-col gap-medium">
        <h2 className="typo-heading3 text-black">모임 책장</h2>
        <div className="py-8 text-center text-grey-600 typo-body3">로딩 중...</div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-medium">
      {/* 헤더: 제목 + 좌우 화살표 (데이터 있을 때만) */}
      <div className="flex items-center justify-between h-7">
        <h2 className="typo-heading3 text-black">모임 책장</h2>
        {hasBooks && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="flex items-center justify-center size-8 rounded-full border border-grey-300 bg-white shadow-drop cursor-pointer hover:bg-grey-100"
              aria-label="이전 책 보기"
            >
              <ChevronLeft className="size-[17.778px] text-grey-600" />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="flex items-center justify-center size-8 rounded-full border border-grey-300 bg-white shadow-drop cursor-pointer hover:bg-grey-100"
              aria-label="다음 책 보기"
            >
              <ChevronRight className="size-[17.778px] text-grey-600" />
            </button>
          </div>
        )}
      </div>

      {/* 책 목록 또는 Empty State */}
      {hasBooks ? (
        <div
          ref={scrollContainerRef}
          className="flex gap-medium overflow-x-auto scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {books.map((book) => (
            <div key={book.bookId} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <GatheringBookCard book={book} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState type="bookshelf" />
      )}
    </section>
  )
}
