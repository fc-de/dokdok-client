import { useEffect, useState } from 'react'

import type {
  CreateBookRecordBody,
  PersonalRecord,
  RecordType,
  UpdateBookRecordBody,
} from '@/features/book/book.types'
import {
  useCreateBookRecord,
  useDeleteBookRecord,
  useUpdateBookRecord,
} from '@/features/book/hooks'
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

type BookLogModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookId: number
  mode: 'create' | 'edit'
  record?: PersonalRecord
}

const RECORD_TYPE_CONFIG = {
  MEMO: { label: '메모', color: 'bg-primary-100 text-primary-300 border-primary-300' },
  QUOTE: { label: '발췌', color: 'bg-purple-100 text-purple-200 border-purple-200' },
} as const

const MEMO_MAX_LENGTH = 5000
const QUOTE_MAX_LENGTH = 3000
const THOUGHT_MAX_LENGTH = 2000

/**
 * 감상 기록 모달
 *
 * @description 메모 또는 발췌 형태의 감상 기록을 작성/수정/삭제하는 모달
 *
 * @example
 * ```tsx
 * // 생성 모드
 * <BookLogModal open={isOpen} onOpenChange={setIsOpen} bookId={1} mode="create" />
 *
 * // 수정 모드
 * <BookLogModal open={isOpen} onOpenChange={setIsOpen} bookId={1} mode="edit" record={record} />
 * ```
 */
function BookLogModal({ open, onOpenChange, bookId, mode, record }: BookLogModalProps) {
  // 초기값 계산 함수
  const getInitialState = () => {
    if (mode === 'edit' && record) {
      if (record.recordType === 'MEMO') {
        return {
          recordType: 'MEMO' as RecordType,
          memoContent: record.recordContent,
          quoteContent: '',
          pageNumber: '',
          thought: '',
        }
      } else {
        return {
          recordType: 'QUOTE' as RecordType,
          memoContent: '',
          quoteContent: record.meta.excerpt || '',
          pageNumber: record.meta.page || '',
          thought: record.recordContent,
        }
      }
    }
    return {
      recordType: 'MEMO' as RecordType,
      memoContent: '',
      quoteContent: '',
      pageNumber: '',
      thought: '',
    }
  }

  const initialState = getInitialState()
  const [recordType, setRecordType] = useState<RecordType>(initialState.recordType)
  const [memoContent, setMemoContent] = useState(initialState.memoContent)
  const [quoteContent, setQuoteContent] = useState(initialState.quoteContent)
  const [pageNumber, setPageNumber] = useState(initialState.pageNumber)
  const [thought, setThought] = useState(initialState.thought)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)

  // 모달이 열릴 때마다 props 기반으로 state 재설정
  useEffect(() => {
    if (open) {
      const state = getInitialState()
      setRecordType(state.recordType)
      setMemoContent(state.memoContent)
      setQuoteContent(state.quoteContent)
      setPageNumber(state.pageNumber)
      setThought(state.thought)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, record])

  const { mutate: createRecord, isPending: isCreating } = useCreateBookRecord(bookId)
  const { mutate: updateRecord, isPending: isUpdating } = useUpdateBookRecord(
    bookId,
    record?.recordId ?? 0
  )
  const { mutate: deleteRecord, isPending: isDeleting } = useDeleteBookRecord(
    bookId,
    record?.recordId ?? 0
  )

  const resetForm = () => {
    setMemoContent('')
    setQuoteContent('')
    setPageNumber('')
    setThought('')
    setRecordType('MEMO')
    setTypeDropdownOpen(false)
  }

  const handleTypeChange = (type: RecordType) => {
    setRecordType(type)
    setTypeDropdownOpen(false)
  }

  const handleSave = () => {
    if (mode === 'edit' && !record) return
    const body: CreateBookRecordBody | UpdateBookRecordBody =
      recordType === 'MEMO'
        ? { recordType: 'MEMO', recordContent: memoContent }
        : {
            recordType: 'QUOTE',
            recordContent: thought,
            meta: {
              page: pageNumber || undefined,
              excerpt: quoteContent || undefined,
            },
          }

    if (mode === 'create') {
      createRecord(body, {
        onSuccess: () => {
          resetForm()
          onOpenChange(false)
        },
      })
    } else {
      updateRecord(body, {
        onSuccess: () => {
          onOpenChange(false)
        },
      })
    }
  }

  const handleDelete = () => {
    if (mode === 'edit' && !record) return
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteRecord(undefined, {
        onSuccess: () => {
          onOpenChange(false)
        },
      })
    }
  }

  const config = RECORD_TYPE_CONFIG[recordType]
  const focusClass = recordType === 'QUOTE' ? 'focus:border-purple-200' : ''
  const isPending = mode === 'create' ? isCreating : isUpdating || isDeleting

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent key={`${mode}-${record?.recordId || 'new'}`} variant="wide">
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
          {mode === 'edit' && (
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isPending || (mode === 'edit' && !record)}
            >
              삭제하기
            </Button>
          )}
          <Button onClick={handleSave} disabled={isPending || (mode === 'edit' && !record)}>
            {mode === 'create' ? '저장하기' : '수정하기'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BookLogModal
