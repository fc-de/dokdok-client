import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { BookCarousel, useBooks } from '@/features/book'
import { ROUTES } from '@/shared/constants'
import { useDeferredLoading } from '@/shared/hooks'
import { Button, Tabs, TabsList, TabsTrigger } from '@/shared/ui'

import HomeBookCard from './HomeBookCard'
import HomeSectionHeader from './HomeSectionHeader'

type BookTab = 'all' | 'pre' | 'post'

export default function ReadingBooksSection() {
  const [activeTab, setActiveTab] = useState<BookTab>('all')
  const navigate = useNavigate()

  const { data, isLoading } = useBooks({ status: 'READING' })
  const showSkeleton = useDeferredLoading(isLoading)

  const books = data?.pages.flatMap((page) => page.items) ?? []
  const totalCount = data?.pages[0]?.readingCount ?? 0

  return (
    <section className="flex flex-col gap-medium">
      <HomeSectionHeader
        title="지금 읽고 있는 책"
        linkTo={ROUTES.BOOKS}
        linkLabel="내 책장 바로가기"
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookTab)}>
          <TabsList size="large">
            <TabsTrigger value="all" badge={totalCount}>
              전체
            </TabsTrigger>
            <TabsTrigger value="pre" badge={0} disabled>
              약속 전
            </TabsTrigger>
            <TabsTrigger value="post" badge={0} disabled>
              약속 후
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </HomeSectionHeader>

      {showSkeleton ? (
        <div className="flex gap-medium">
          {[...Array(6).keys()].map((i) => (
            <div key={i} className="w-45 shrink-0 animate-pulse">
              <div className="h-65 w-45 rounded-small bg-grey-300" />
              <div className="mt-small flex flex-col gap-xtiny">
                <div className="h-5.5 w-3/4 rounded bg-grey-300" />
                <div className="h-4.5 w-1/2 rounded bg-grey-300" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex h-85 flex-col items-center justify-center gap-medium rounded-base border border-grey-300">
          <div className="flex flex-col items-center gap-xtiny">
            <p className="text-grey-600 typo-subtitle2">내 책장이 비어있어요.</p>
            <p className="text-grey-600 typo-body3">
              첫 번째 책을 등록하고 독서 기록을 시작해 보세요!
            </p>
          </div>
          <Button
            variant="secondary"
            outline
            size="small"
            onClick={() => navigate(ROUTES.BOOK_SEARCH)}
          >
            책 추가하기
          </Button>
        </div>
      ) : (
        <BookCarousel>
          {books.map((book) => (
            <HomeBookCard
              key={book.bookId}
              bookId={book.bookId}
              title={book.title}
              authors={book.authors}
              thumbnail={book.thumbnail}
            />
          ))}
        </BookCarousel>
      )}
    </section>
  )
}
