import { useCallback, useEffect, useRef, useState } from 'react'

import type { SearchBookItem } from '@/features/book'
import { BookList, BookSearchModal, useBooks, useCreateBook, useDeleteBook } from '@/features/book'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function BookListPage() {
  const { mutateAsync: deleteBook } = useDeleteBook()
  const { mutateAsync: createBook, isPending: isCreating } = useCreateBook()
  const { openConfirm } = useGlobalModalStore()

  // 현재 활성 탭 상태
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed'>('all')

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBookIds, setSelectedBookIds] = useState<Set<number>>(new Set())

  // 편집 모드 ref (콜백 안정성을 위해)
  const isEditModeRef = useRef(isEditMode)
  useEffect(() => {
    isEditModeRef.current = isEditMode
  }, [isEditMode])

  // 도서 검색 모달 상태
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  // 현재 탭에서 필터링된 책 ID 목록 (BookList에서 전달받음)
  const [filteredBookIds, setFilteredBookIds] = useState<number[]>([])

  // 카운트 전용 쿼리 (탭과 무관하게 전체 데이터에서 카운트 조회)
  const { data: countData } = useBooks()

  // 첫 페이지에서 카운트 정보 가져오기
  const firstPage = countData?.pages[0]
  const totalCount = firstPage?.totalCount ?? 0
  const readingCount = firstPage?.readingCount ?? 0
  const completedCount = firstPage?.completedCount ?? 0

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

  // 전체 선택 (현재 화면에 표시된 책 기준, 멤버십 기반)
  const handleSelectAll = () => {
    const allSelected =
      filteredBookIds.length > 0 && filteredBookIds.every((id) => selectedBookIds.has(id))

    if (allSelected) {
      // 전체 해제
      setSelectedBookIds(new Set())
    } else {
      // 전체 선택
      setSelectedBookIds(new Set(filteredBookIds))
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

    const bookIds = [...selectedBookIds]
    const results = await Promise.allSettled(bookIds.map((id) => deleteBook(id)))

    // 성공한 ID만 선택 해제
    const succeededIds = new Set(
      results
        .map((result, index) => (result.status === 'fulfilled' ? bookIds[index] : null))
        .filter((id): id is number => id !== null)
    )

    const failedCount = results.filter((r) => r.status === 'rejected').length

    if (failedCount > 0) {
      await openConfirm(
        '삭제 실패',
        `${bookIds.length}권 중 ${failedCount}권 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
        { confirmText: '확인' }
      )
    }

    // 성공한 항목만 선택에서 제거
    setSelectedBookIds((prev) => {
      const next = new Set(prev)
      succeededIds.forEach((id) => {
        next.delete(id)
      })
      return next
    })

    if (failedCount === 0) {
      setIsEditMode(false)
    }
  }

  // 편집 모드 토글
  const handleEditModeToggle = () => {
    if (isEditMode) {
      // 편집 모드 종료 시 선택 초기화
      setSelectedBookIds(new Set())
    }
    setIsEditMode(!isEditMode)
  }

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'reading' | 'completed')
    // 탭 변경 시 선택 초기화
    setSelectedBookIds(new Set())
  }

  // 필터링된 책 목록 변경 핸들러 (필터 변경 시 selectedBookIds도 정리)
  const handleFilteredBooksChange = useCallback((bookIds: number[]) => {
    setFilteredBookIds(bookIds)

    // 편집 모드일 때만 selectedBookIds 정리
    if (isEditModeRef.current) {
      const filteredSet = new Set(bookIds)
      setSelectedBookIds((prev) => {
        const cleaned = new Set([...prev].filter((id) => filteredSet.has(id)))
        if (cleaned.size !== prev.size) {
          return cleaned
        }
        return prev
      })
    }
  }, [])

  // 멤버십 기반 전체 선택 여부 확인
  const isAllSelected =
    filteredBookIds.length > 0 && filteredBookIds.every((id) => selectedBookIds.has(id))

  return (
    <div>
      <h1 className="typo-heading1 text-black mt-xlarge mb-medium">내 책장</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
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
            isActive={activeTab === 'all'}
            isEditMode={isEditMode}
            selectedBookIds={selectedBookIds}
            onSelectToggle={handleSelectToggle}
            onFilteredBooksChange={handleFilteredBooksChange}
          />
        </TabsContent>
        <TabsContent value="reading">
          <BookList
            status="READING"
            isActive={activeTab === 'reading'}
            isEditMode={isEditMode}
            selectedBookIds={selectedBookIds}
            onSelectToggle={handleSelectToggle}
            onFilteredBooksChange={handleFilteredBooksChange}
          />
        </TabsContent>
        <TabsContent value="completed">
          <BookList
            status="COMPLETED"
            isActive={activeTab === 'completed'}
            isEditMode={isEditMode}
            selectedBookIds={selectedBookIds}
            onSelectToggle={handleSelectToggle}
            onFilteredBooksChange={handleFilteredBooksChange}
          />
        </TabsContent>
      </Tabs>

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
          } catch {
            openConfirm('등록 실패', '책 등록에 실패했습니다.\n잠시 후 다시 시도해주세요.', {
              confirmText: '확인',
            })
          }
        }}
        isPending={isCreating}
      />
    </div>
  )
}
