import type { PreOpinionBook } from '@/features/pre-opinion/preOpinion.types'
import { useScrollShadow } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'

import { formatUpdatedAt } from '../lib/date'

interface PreOpinionWriteHeaderProps {
  book: PreOpinionBook
  updatedAt: string | null
  onSave: () => void
  onSubmit: () => void
  isSaving?: boolean
  isSubmitting?: boolean
  isReviewValid?: boolean
}

/**
 * 사전 의견 작성 페이지 헤더
 *
 * @description
 * 책 제목, 저자, 마지막 저장 시각을 표시하고
 * 스크롤 시 sticky로 고정되며 하단 그림자가 생깁니다.
 *
 * @example
 * ```tsx
 * <PreOpinionWriteHeader
 *   book={{ bookId: 1, title: '데미안', author: '헤르만 헤세' }}
 *   updatedAt="2026-02-06T09:12:30"
 *   onSave={handleSave}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
const PreOpinionWriteHeader = ({
  book,
  updatedAt,
  onSave,
  onSubmit,
  isSaving,
  isSubmitting,
  isReviewValid = false,
}: PreOpinionWriteHeaderProps) => {
  const isScrolled = useScrollShadow()

  return (
    <div
      className={cn(
        'sticky top-[123px] z-30 bg-white transition-shadow duration-200',
        isScrolled && 'shadow-drop-bottom'
      )}
    >
        <div className="mx-auto max-w-layout-max px-layout-padding h-[65px] pb-tiny">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-xtiny">
              <h3 className="typo-heading3 text-black">사전 의견 작성하기</h3>
              <p className="text-grey-600">
                {book.title} · {book.author}
              </p>
            </div>
            <div className="flex items-center">
              {updatedAt && (
                <p className="typo-body6 text-grey-600 mr-large">{formatUpdatedAt(updatedAt)}</p>
              )}
              <Button
                className="mr-xsmall"
                variant={'secondary'}
                outline
                onClick={onSave}
                disabled={isSaving || !isReviewValid}
              >
                {isSaving ? '저장 중...' : '저장하기'}
              </Button>
              <Button onClick={onSubmit} disabled={isSubmitting || isSaving || !isReviewValid}>
                {isSubmitting ? '공유 중...' : '공유하기'}
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default PreOpinionWriteHeader
