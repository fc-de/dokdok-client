/**
 * @file BookSearchModal.tsx
 * @description 도서 검색 모달 컴포넌트
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import { ApiError } from '@/api/errors'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, SearchField } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

import type { SearchBookItem } from '../book.types'
import { useCreateBook } from '../hooks/useCreateBook'
import { useSearchBooks } from '../hooks/useSearchBooks'

export interface BookSearchModalProps {
  /** 모달 열림 상태 */
  open: boolean
  /** 모달 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  /** 책 등록 성공 콜백 */
  onSuccess?: () => void
}

/**
 * 도서 검색 모달
 *
 * 외부 API를 통해 도서를 검색하고 내 책장에 등록할 수 있는 모달입니다.
 * 디바운싱과 무한스크롤을 지원합니다.
 *
 * @example
 * ```tsx
 * <BookSearchModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onSuccess={() => console.log('등록 완료')}
 * />
 * ```
 */
export default function BookSearchModal({ open, onOpenChange, onSuccess }: BookSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const { openError } = useGlobalModalStore()

  // 디바운싱: 입력 후 300ms 후에 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // 도서 검색
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchBooks(debouncedQuery)

  // 책 등록
  const { mutateAsync: registerBook, isPending: isRegistering } = useCreateBook()

  const books = data?.pages.flatMap((page) => page.items) ?? []

  // 무한스크롤 처리
  const handleScroll = useCallback(() => {
    if (!listRef.current || isFetchingNextPage || !hasNextPage) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollHeight - scrollTop - clientHeight < 100) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // 책 선택 시 등록
  const handleSelectBook = async (book: SearchBookItem) => {
    if (isRegistering) return

    try {
      await registerBook({
        title: book.title,
        authors: book.authors.join(', '),
        publisher: book.publisher,
        isbn: book.isbn,
        thumbnail: book.thumbnail,
      })

      onOpenChange(false)
      onSuccess?.()
      resetState()
    } catch (error) {
      if (error instanceof ApiError) {
        openError('오류', error.userMessage)
      } else {
        openError('오류', '책 등록 중 오류가 발생했습니다.')
      }
    }
  }

  // 모달 닫을 때 상태 초기화
  const resetState = () => {
    setSearchQuery('')
    setDebouncedQuery('')
  }

  const handleClose = () => {
    onOpenChange(false)
    resetState()
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="wide" onEscapeKeyDown={handleClose} onPointerDownOutside={handleClose}>
        <ModalHeader>
          <ModalTitle>도서 검색</ModalTitle>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-base">
          <SearchField
            placeholder="도서명 또는 저자명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div
            ref={listRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scroll"
          >
            <div className="flex flex-col">
              {books.map((book) => (
                <BookSearchItem
                  key={`${book.isbn}-${book.title}`}
                  book={book}
                  onClick={() => handleSelectBook(book)}
                  disabled={isRegistering}
                />
              ))}
              {isFetchingNextPage && (
                <div className="py-base text-center text-grey-500 typo-body2">로딩 중...</div>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

interface BookSearchItemProps {
  book: SearchBookItem
  onClick: () => void
  disabled?: boolean
}

function BookSearchItem({ book, onClick, disabled }: BookSearchItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex gap-small px-base py-large text-left border-b border-grey-300 last:border-b-0 cursor-pointer"
    >
      {/* 썸네일 */}
      <div className="w-[70px] h-[99px] shrink-0 bg-grey-100 rounded-[4px] overflow-hidden">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-grey-400 typo-caption">
            No Image
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-xtiny">
          <span className="typo-subtitle3 text-black line-clamp-1">{book.title}</span>
          <span className="typo-body4 text-grey-800">{book.authors.join(', ')}</span>
        </div>
        <span className="typo-body4 text-grey-700">{book.publisher}</span>
      </div>
    </button>
  )
}
