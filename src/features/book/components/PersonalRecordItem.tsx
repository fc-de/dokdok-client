import type { PersonalRecord } from '@/features/book/book.types'
import BookLogActionMenu from '@/features/book/components/BookLogActionMenu'
import { formatToDateTimeWithDay } from '@/shared/lib/date'
import { Badge } from '@/shared/ui/Badge'
import { FoldedCard } from '@/shared/ui/FoldedCard'

import ExcerptBlock from './ExcerptBlock'

type PersonalRecordItemProps = {
  record: PersonalRecord
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * 개인 회고 아이템 컴포넌트
 * - 메모(MEMO) 또는 발췌(QUOTE) 타입의 개인 기록을 표시합니다.
 * - 오른쪽 하단에 종이 접힌 효과가 있는 카드 형태입니다.
 *
 * @example
 * ```tsx
 * <PersonalRecordItem record={personalRecord} onEdit={() => handleEdit(record.id)} />
 * ```
 */
const PersonalRecordItem = ({ record, onEdit, onDelete }: PersonalRecordItemProps) => {
  const isMemo = record.recordType === 'MEMO'

  return (
    <FoldedCard>
      <div className="flex flex-wrap items-center gap-x-small gap-y-0">
        <div className="flex items-center gap-small max-lg:w-full max-lg:justify-between">
          <Badge color={isMemo ? 'green' : 'purple'}>{isMemo ? '메모' : '발췌'}</Badge>
          {(onEdit || onDelete) && (
            <span className="hidden max-lg:-my-xsmall max-lg:block">
              <BookLogActionMenu onEdit={onEdit} onDelete={onDelete} />
            </span>
          )}
        </div>
        <div className="max-lg:w-full max-lg:mt-xsmall">
          <span className="typo-body4 max-lg:typo-m-body4 text-grey-600">
            {formatToDateTimeWithDay(record.createdAt)}
          </span>
        </div>
        {(onEdit || onDelete) && (
          <span className="ml-auto max-lg:hidden">
            <BookLogActionMenu onEdit={onEdit} onDelete={onDelete} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-medium">
        {/* 발췌 텍스트 + 페이지 번호 */}
        {record.meta?.excerpt && (
          <ExcerptBlock>
            <p className="typo-subtitle5 text-grey-800">{record.meta.excerpt}</p>
            {record.meta?.page && (
              <span className="typo-body1 text-grey-600">
                {record.meta.page}
                {record.meta.page.endsWith('p') ? '' : 'p'}
              </span>
            )}
          </ExcerptBlock>
        )}

        {/* 개인 감상/메모 */}
        <p className="typo-body1 text-grey-800 whitespace-pre-wrap">{record.recordContent}</p>
      </div>
    </FoldedCard>
  )
}

export default PersonalRecordItem
