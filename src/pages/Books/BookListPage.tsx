import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { SearchBookItem } from '@/features/book'
import {
  BookList,
  BookSearchModal,
  useBooks,
  useCreateBook,
  useDeleteBookAction,
} from '@/features/book'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants/routes'
import { MobileLayoutFrame } from '@/shared/layout'
import { showToast } from '@/shared/lib/toast'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, TextButton } from '@/shared/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/Tooltip'
import { useGlobalModalStore } from '@/store'

export default function BookListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { deleteBooks, isDeleting } = useDeleteBookAction()
  const { mutateAsync: createBook, isPending: isCreating } = useCreateBook()
  const { openConfirm } = useGlobalModalStore()

  // 현재 활성 탭 상태
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed'>('all')

  // 편집 모드 상태 (URL 쿼리 파라미터 기반)
  const isEditMode = searchParams.get('edit') === 'true'
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
  const statusCounts = countData?.pages[0]?.statusCounts
  const totalCount = statusCounts?.total ?? 0
  const readingCount = statusCounts?.reading ?? 0
  const completedCount = statusCounts?.completed ?? 0

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

    await deleteBooks([...selectedBookIds])
  }

  // 편집 모드 진입
  const handleEnterEditMode = () => {
    setSelectedBookIds(new Set())
    setFilteredBookIds([])
    navigate(`${ROUTES.BOOKS}?edit=true`)
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

  if (isEditMode) {
    return (
      <MobileLayoutFrame
        variant="header"
        title="내 책장 편집하기"
        leftAction={{ type: 'back', to: ROUTES.BOOKS }}
        className="min-h-dvh lg:min-h-0"
      >
        <SubPageHeader label="내 책장" to={ROUTES.BOOKS} className="max-lg:hidden" />
        <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5 max-lg:pt-5 max-lg:pb-10">
          <div className="flex justify-between items-center pb-tiny mb-9.25">
            <h3 className="typo-heading3 text-black max-lg:hidden">내 책장 편집하기</h3>
            <div className="flex gap-xsmall items-center">
              <TextButton onClick={handleSelectAll}>
                {isAllSelected ? '전체해제' : '전체선택'}
              </TextButton>
              <TextButton
                onClick={handleDelete}
                disabled={selectedBookIds.size === 0 || isDeleting}
                className="text-grey-700"
              >
                삭제하기
              </TextButton>
            </div>
          </div>
          <p className="typo-subtitle1 text-grey-700">{selectedBookIds.size}개 선택</p>
          <BookList
            isEditMode
            selectedBookIds={selectedBookIds}
            onSelectToggle={handleSelectToggle}
            onFilteredBooksChange={handleFilteredBooksChange}
          />
        </div>
      </MobileLayoutFrame>
    )
  }

  return (
    <MobileLayoutFrame variant="navigation">
      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5 max-lg:pt-5 max-lg:pb-10">
        <h1 className="typo-heading1 text-black mt-xlarge mb-medium max-lg:mt-0">내 책장</h1>
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
              <Button
                variant="secondary"
                outline
                disabled={totalCount === 0}
                onClick={handleEnterEditMode}
              >
                편집하기
              </Button>
              {totalCount === 0 ? (
                <Tooltip dismissable>
                  <TooltipTrigger asChild>
                    <Button onClick={() => setIsSearchModalOpen(true)}>책 추가하기</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>책을 추가해 감상 기록을 남겨보세요!</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button onClick={() => setIsSearchModalOpen(true)}>책 추가하기</Button>
              )}
            </div>
          </div>
          <TabsContent value="all">
            <BookList
              isActive={activeTab === 'all'}
              onFilteredBooksChange={handleFilteredBooksChange}
            />
          </TabsContent>
          <TabsContent value="reading">
            <BookList
              status="READING"
              isActive={activeTab === 'reading'}
              onFilteredBooksChange={handleFilteredBooksChange}
            />
          </TabsContent>
          <TabsContent value="completed">
            <BookList
              status="COMPLETED"
              isActive={activeTab === 'completed'}
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
              showToast('책이 추가되었습니다.')
            } catch {
              openConfirm('등록 실패', '책 등록에 실패했습니다.\n잠시 후 다시 시도해주세요.', {
                confirmText: '확인',
              })
            }
          }}
          isPending={isCreating}
        />
      </div>
    </MobileLayoutFrame>
  )
}
