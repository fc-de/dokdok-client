import { useState } from 'react'

import { BookList, BookSearchModal, useBooks, useDeleteBook } from '@/features/book'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function BookListPage() {
  const { data } = useBooks()
  const { mutateAsync: deleteBook } = useDeleteBook()
  const { openConfirm } = useGlobalModalStore()

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBookIds, setSelectedBookIds] = useState<Set<number>>(new Set())

  // 도서 검색 모달 상태
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  // 첫 페이지에서 카운트 정보 가져오기
  const firstPage = data?.pages[0]
  const totalCount = firstPage?.totalCount ?? 0
  const readingCount = firstPage?.readingCount ?? 0
  const completedCount = firstPage?.completedCount ?? 0

  // 전체 책 목록
  const allBooks = data?.pages.flatMap((page) => page.items) ?? []

  // 선택 토글
  const handleSelectToggle = (bookId: number) => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) {
        next.delete(bookId)
      } else {
        next.add(bookId)
      }
      return next
    })
  }

  // 전체 선택
  const handleSelectAll = () => {
    if (selectedBookIds.size === allBooks.length) {
      // 전체 해제
      setSelectedBookIds(new Set())
    } else {
      // 전체 선택
      setSelectedBookIds(new Set(allBooks.map((book) => book.bookId)))
    }
  }

  // 삭제하기
  const handleDelete = async () => {
    if (selectedBookIds.size === 0) return

    const confirmed = await openConfirm(
      '책 삭제하기',
      '책장 속 책을 삭제하면 해당 책의 감상 기록도 모두 삭제되며,\n이 과정은 되돌릴 수 없어요. 삭제를 진행할까요?',
      {
        confirmText: '삭제',
        variant: 'danger',
      }
    )

    if (!confirmed) return

    await Promise.all([...selectedBookIds].map((id) => deleteBook(id)))
    setSelectedBookIds(new Set())
    setIsEditMode(false)
  }

  // 편집 모드 토글
  const handleEditModeToggle = () => {
    if (isEditMode) {
      // 편집 모드 종료 시 선택 초기화
      setSelectedBookIds(new Set())
    }
    setIsEditMode(!isEditMode)
  }

  const isAllSelected = allBooks.length > 0 && selectedBookIds.size === allBooks.length

  return (
    <div>
      <h1 className="typo-heading1 text-black mt-xlarge mb-medium">내 책장</h1>
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center">
          <TabsList size="large">
            <TabsTrigger value="all" badge={totalCount}>
              전체
            </TabsTrigger>
            <TabsTrigger value="reading" badge={readingCount}>
              기록 중
            </TabsTrigger>
            <TabsTrigger value="completed" badge={completedCount}>
              기록 완료
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-xsmall items-center">
            {isEditMode ? (
              <>
                <TextButton onClick={handleSelectAll}>
                  {isAllSelected ? '전체해제' : '전체선택'}
                </TextButton>
                <TextButton
                  onClick={handleDelete}
                  disabled={selectedBookIds.size === 0}
                  className="text-grey-700"
                >
                  삭제하기
                </TextButton>
                {/* <TextButton onClick={handleEditModeToggle}>취소</TextButton> */}
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  outline
                  disabled={totalCount === 0}
                  onClick={handleEditModeToggle}
                >
                  편집하기
                </Button>
                <Button onClick={() => setIsSearchModalOpen(true)}>책 추가하기</Button>
              </>
            )}
          </div>
        </div>
        <TabsContent value="all">
          <BookList
            isEditMode={isEditMode}
            selectedBookIds={selectedBookIds}
            onSelectToggle={handleSelectToggle}
          />
        </TabsContent>
        <TabsContent value="reading">
          <BookList
            status="READING"
            isEditMode={isEditMode}
            selectedBookIds={selectedBookIds}
            onSelectToggle={handleSelectToggle}
          />
        </TabsContent>
        <TabsContent value="completed">
          <BookList
            status="COMPLETED"
            isEditMode={isEditMode}
            selectedBookIds={selectedBookIds}
            onSelectToggle={handleSelectToggle}
          />
        </TabsContent>
      </Tabs>

      <BookSearchModal open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </div>
  )
}
