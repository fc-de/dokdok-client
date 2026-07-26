import { useState } from 'react'

import type { SearchBookItem } from '@/features/book'
import { BookCarousel, BookSearchModal, useBooks, useCreateBook } from '@/features/book'
import { ROUTES } from '@/shared/constants'
import { useDeferredLoading } from '@/shared/hooks'
import { showToast } from '@/shared/lib/toast'
import { Button, Tabs, TabsList, TabsTrigger } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

import HomeBookCard from './HomeBookCard'
import HomeSectionHeader from './HomeSectionHeader'

type BookTab = 'all' | 'pre' | 'post'

export default function ReadingBooksSection() {
  const [activeTab, setActiveTab] = useState<BookTab>('all')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const { mutateAsync: createBook, isPending: isCreating } = useCreateBook()
  const { openConfirm } = useGlobalModalStore()

  const allBooksQuery = useBooks({ readingStatus: 'READING' })
  const beforeBooksQuery = useBooks({
    readingStatus: 'READING',
    meetingProgressStatus: 'BEFORE',
  })
  const afterBooksQuery = useBooks({
    readingStatus: 'READING',
    meetingProgressStatus: 'AFTER',
  })
  const activeQuery = {
    all: allBooksQuery,
    pre: beforeBooksQuery,
    post: afterBooksQuery,
  }[activeTab]

  const { data, isLoading } = activeQuery
  const showSkeleton = useDeferredLoading(isLoading)

  const books = data?.pages.flatMap((page) => page.items) ?? []
  const totalCount = allBooksQuery.data?.pages[0]?.statusCounts.reading ?? 0
  const beforeCount = beforeBooksQuery.data?.pages[0]?.totalCount ?? 0
  const afterCount = afterBooksQuery.data?.pages[0]?.totalCount ?? 0
  const isFilteredEmpty = activeTab !== 'all'

  return (
    <section className="flex flex-col gap-medium max-lg:gap-base">
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
            <TabsTrigger value="pre" badge={beforeCount}>
              약속 전
            </TabsTrigger>
            <TabsTrigger value="post" badge={afterCount}>
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
        <div className="flex flex-col gap-small">
          {!isFilteredEmpty && (
            <Button
              variant="primary"
              size="small"
              className="w-full"
              onClick={() => setIsSearchModalOpen(true)}
            >
              책 추가하기
            </Button>
          )}
          <div className="flex h-85 flex-col items-center justify-center gap-medium rounded-base border border-grey-300 max-lg:h-40">
            <div className="flex flex-col items-center gap-xtiny text-center">
              <p className="text-grey-600 typo-subtitle2">
                {isFilteredEmpty
                  ? `${activeTab === 'pre' ? '약속 전' : '약속 후'} 상태인 책이 없어요.`
                  : '내 책장이 비어있어요.'}
              </p>
              <p className="text-grey-600 typo-body3">
                {isFilteredEmpty
                  ? '다른 상태의 책을 확인해 보세요.'
                  : '첫 번째 책을 등록하고 독서 기록을 시작해 보세요!'}
              </p>
            </div>
          </div>
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
              meetingProgressStatus={book.meetingProgressStatus}
            />
          ))}
        </BookCarousel>
      )}

      <BookSearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        onSelectBook={async (book: SearchBookItem) => {
          try {
            await createBook({
              title: book.title,
              authors: book.authors.join(', '),
              publisher: book.publisher,
              isbn: book.isbn,
              thumbnail: book.thumbnail,
            })
            showToast('책이 추가되었습니다.')
          } catch {
            openConfirm('등록 실패', '책 등록에 실패했습니다.\n잠시 후 다시 시도해주세요.', {
              confirmText: '확인',
            })
          }
        }}
        isPending={isCreating}
      />
    </section>
  )
}
