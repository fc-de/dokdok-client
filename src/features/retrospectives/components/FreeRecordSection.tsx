import { Trash2, X } from 'lucide-react'

import { Button, Container, Input, Textarea } from '@/shared/ui'

import type { UseFreeRecordReturn } from '../hooks/useFreeRecord'

export interface FreeRecordSectionProps {
  form: UseFreeRecordReturn
  showErrors: boolean
  onClose: () => void
}

/**
 * 자유 기록 섹션
 *
 * @description
 * 자유롭게 기록을 남기는 동적 폼 섹션입니다.
 * 제목+상세내용 항목을 동적으로 추가/삭제할 수 있습니다.
 *
 * @example
 * ```tsx
 * <FreeRecordSection form={freeRecordForm} showErrors={showErrors} />
 * ```
 */
export default function FreeRecordSection({ form, showErrors, onClose }: FreeRecordSectionProps) {
  const { entries, addEntry, removeEntry, updateEntry } = form

  return (
    <section>
      <Container className="gap-[19px]">
        <div className="flex justify-between items-center">
          <h3 className="text-black typo-heading3">자유 기록</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-grey-400 hover:text-black transition-colors"
            aria-label="자유 기록 섹션 닫기"
          >
            <X className="size-6 text-grey-600 cursor-pointer" />
          </button>
        </div>
        {entries.map((entry) => {
          const isPartial = form.isEntryPartial(entry.id)
          const titleError = showErrors && isPartial && entry.title.trim() === ''
          const contentError = showErrors && isPartial && entry.content.trim() === ''

          return (
            <div
              key={entry.id}
              className="flex flex-col gap-small rounded-small bg-grey-100 border border-grey-300 p-medium"
              {...(showErrors && isPartial ? { 'data-field-error': '' } : {})}
            >
              <div className="flex flex-col gap-tiny">
                <span className="text-grey-600 typo-body4">제목</span>
                <Input
                  placeholder="제목을 작성해주세요"
                  value={entry.title}
                  onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                  error={titleError}
                  errorMessage={titleError ? '내용을 입력해주세요' : undefined}
                />
              </div>
              <div className="flex flex-col gap-tiny">
                <span className="text-grey-600 typo-body4">상세 내용</span>
                <Textarea
                  placeholder="내용을 작성해주세요"
                  value={entry.content}
                  onChange={(e) => updateEntry(entry.id, 'content', e.target.value)}
                  height={104}
                  error={contentError}
                  errorMessage={contentError ? '내용을 입력해주세요' : undefined}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-grey-400 hover:text-accent-300 transition-colors"
                  onClick={() => {
                    removeEntry(entry.id)
                    if (entries.length === 1) onClose()
                  }}
                  aria-label="항목 삭제"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          )
        })}
        <Button variant="secondary" outline onClick={addEntry}>
          + 항목 추가하기
        </Button>
      </Container>
    </section>
  )
}
