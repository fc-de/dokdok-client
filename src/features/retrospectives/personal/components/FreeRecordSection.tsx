import { Trash2, X } from 'lucide-react'

import {
  Button,
  Container,
  Input,
  Textarea,
  TextButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui'

import type { UseFreeRecordReturn } from '../hooks/useFreeRecord'
import { FREE_RECORD_LIMITS } from '../personalRetrospective.constants'

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
      {/* 모바일: 타이틀을 카드 바깥에 노출 */}
      <h3 className="hidden max-lg:block text-black typo-heading3 mb-medium max-lg:typo-subtitle2">
        자유 기록
      </h3>

      <Container className="gap-[19px] max-lg:gap-medium max-lg:bg-transparent max-lg:rounded-none max-lg:p-0 max-lg:shadow-none">
        <div className="flex justify-between items-center max-lg:hidden">
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
        {entries.map((entry, index) => {
          const isPartial = form.isEntryPartial(entry.id)
          const titleError = showErrors && isPartial && entry.title.trim() === ''
          const titleExceeded = entry.title.length >= FREE_RECORD_LIMITS.TITLE_MAX
          const contentError = showErrors && isPartial && entry.content.trim() === ''
          const contentExceeded = entry.content.length >= FREE_RECORD_LIMITS.CONTENT_MAX

          return (
            <div
              key={entry.id}
              className="flex flex-col gap-small rounded-small bg-grey-100 border border-grey-300 p-medium"
              {...(showErrors && isPartial ? { 'data-field-error': '' } : {})}
            >
              {/* 모바일: 항목 순번 + 삭제하기 */}
              <div className="hidden max-lg:flex justify-between items-center">
                <span className="text-black typo-body2">기록{index + 1}</span>
                <TextButton
                  onClick={() => {
                    removeEntry(entry.id)
                    if (entries.length === 1) onClose()
                  }}
                  className="text-grey-500 typo-m-caption2 hover:text-black"
                  aria-label={`기록${index + 1} 삭제`}
                >
                  삭제하기
                </TextButton>
              </div>

              <div className="flex flex-col gap-tiny">
                <span className="text-grey-600 typo-body4 max-lg:typo-body3">제목</span>
                <Input
                  placeholder="제목을 작성해주세요"
                  value={entry.title}
                  onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                  maxLength={FREE_RECORD_LIMITS.TITLE_MAX}
                  error={titleError || titleExceeded}
                  errorMessage={
                    titleExceeded
                      ? `${FREE_RECORD_LIMITS.TITLE_MAX}자 이내로 작성이 가능해요`
                      : '내용을 입력해주세요'
                  }
                />
              </div>
              <div className="flex flex-col gap-tiny">
                <span className="text-grey-600 typo-body4 max-lg:typo-body3">상세 내용</span>
                <Textarea
                  placeholder="내용을 작성해주세요"
                  value={entry.content}
                  onChange={(e) => updateEntry(entry.id, 'content', e.target.value)}
                  height={104}
                  maxLength={FREE_RECORD_LIMITS.CONTENT_MAX}
                  error={contentError || contentExceeded}
                  errorMessage={
                    contentExceeded
                      ? `${FREE_RECORD_LIMITS.CONTENT_MAX.toLocaleString()}자 이내로 작성이 가능해요`
                      : '내용을 입력해주세요'
                  }
                />
              </div>

              <div className="flex justify-end max-lg:hidden">
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
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-full">
              <Button
                variant="secondary"
                outline
                onClick={addEntry}
                disabled={entries.length >= FREE_RECORD_LIMITS.LIST_MAX}
                className="w-full"
              >
                + 항목 추가하기
              </Button>
            </span>
          </TooltipTrigger>
          {entries.length >= FREE_RECORD_LIMITS.LIST_MAX && (
            <TooltipContent side="top">
              최대 {FREE_RECORD_LIMITS.LIST_MAX}개까지 추가할 수 있어요
            </TooltipContent>
          )}
        </Tooltip>
      </Container>
    </section>
  )
}
