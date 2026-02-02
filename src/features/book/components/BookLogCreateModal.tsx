import { useState } from 'react'

import type { CreateBookRecordBody, RecordType } from '@/features/book/book.types'
import { useCreateBookRecord } from '@/features/book/hooks'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/Modal'
import { Textarea } from '@/shared/ui/Textarea'

type BookLogCreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookId: number
}

const RECORD_TYPE_CONFIG = {
  MEMO: { label: '메모', color: 'bg-primary-100 text-primary-300 border-primary-300' },
  QUOTE: { label: '발췌', color: 'bg-purple-100 text-purple-200 border-purple-200' },
} as const

const MEMO_MAX_LENGTH = 5000
const QUOTE_MAX_LENGTH = 3000
const THOUGHT_MAX_LENGTH = 2000

/**
 * 감상 기록 작성 모달
 *
 * @description 메모 또는 발췌 형태의 감상 기록을 작성하는 모달
 *
 * @example
 * ```tsx
 * <BookLogCreateModal open={isOpen} onOpenChange={setIsOpen} bookId={1} />
 * ```
 */
function BookLogCreateModal({ open, onOpenChange, bookId }: BookLogCreateModalProps) {
  const [recordType, setRecordType] = useState<RecordType>('MEMO')
  const [memoContent, setMemoContent] = useState('')
  const [quoteContent, setQuoteContent] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [thought, setThought] = useState('')
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)

  const { mutate: createRecord, isPending } = useCreateBookRecord(bookId)

  const handleTypeChange = (type: RecordType) => {
    setRecordType(type)
    setTypeDropdownOpen(false)
  }

  const resetForm = () => {
    setMemoContent('')
    setQuoteContent('')
    setPageNumber('')
    setThought('')
    setRecordType('MEMO')
  }

  const handleSave = () => {
    const body: CreateBookRecordBody =
      recordType === 'MEMO'
        ? { recordType: 'MEMO', recordContent: memoContent }
        : {
            recordType: 'QUOTE',
            recordContent: quoteContent,
            meta: {
              page: pageNumber || undefined,
              excerpt: thought || undefined,
            },
          }

    createRecord(body, {
      onSuccess: () => {
        resetForm()
        onOpenChange(false)
      },
    })
  }

  const config = RECORD_TYPE_CONFIG[recordType]
  const focusClass = recordType === 'QUOTE' ? 'focus:border-purple-200' : ''

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="wide">
        <ModalHeader>
          <ModalTitle>감상 기록</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center justify-between mb-base">
            {/* 기록 유형 드롭다운 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className={cn(
                  'flex items-center rounded-medium border pl-small pr-xsmall py-tiny typo-subtitle5 cursor-pointer transition-colors whitespace-nowrap',
                  config.color
                )}
              >
                {config.label}
                <svg
                  className={cn('size-4 transition-transform', typeDropdownOpen && 'rotate-180')}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {typeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-grey-300 rounded-small p-small z-10 flex gap-xsmall">
                  {(
                    Object.entries(RECORD_TYPE_CONFIG) as [
                      RecordType,
                      (typeof RECORD_TYPE_CONFIG)[RecordType],
                    ][]
                  ).map(([type, cfg]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={cn(
                        'rounded-medium px-[13px] py-[7px] typo-caption1 cursor-pointer border transition-colors whitespace-nowrap',
                        recordType === type
                          ? cfg.color
                          : 'bg-grey-300 text-grey-600 border-transparent'
                      )}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 메모 폼 */}
          {recordType === 'MEMO' && (
            <Textarea
              placeholder="이 책에 대한 생각을 자유롭게 기록해주세요"
              maxLength={MEMO_MAX_LENGTH}
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              height={370}
              className={focusClass}
            />
          )}

          {/* 발췌 폼 */}
          {recordType === 'QUOTE' && (
            <div className="flex gap-base flex-1">
              {/* 왼쪽: 기억하고 싶은 문장 */}
              <div className="flex flex-col flex-1">
                <label className="typo-body3 text-black mb-xsmall">기억하고 싶은 문장</label>
                <Textarea
                  placeholder="책 속 인상 깊은 부분을 기록해주세요"
                  maxLength={QUOTE_MAX_LENGTH}
                  value={quoteContent}
                  onChange={(e) => setQuoteContent(e.target.value)}
                  height={342}
                  className={focusClass}
                />
              </div>

              {/* 오른쪽: 페이지 번호 + 나의 생각 */}
              <div className="flex flex-col flex-1 gap-small">
                <div className="flex flex-col">
                  <label className="typo-body3 text-black mb-xsmall">페이지 번호</label>
                  <Input
                    placeholder="발췌한 부분의 페이지 번호 (예: 16~20p)"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                    className={focusClass}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="typo-body3 text-black mb-xsmall">나의 생각</label>
                  <Textarea
                    placeholder="이 부분에 대한 생각을 자유롭게 기록해주세요"
                    maxLength={THOUGHT_MAX_LENGTH}
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    height={246}
                    className={focusClass}
                  />
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSave} disabled={isPending}>
            저장하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BookLogCreateModal
