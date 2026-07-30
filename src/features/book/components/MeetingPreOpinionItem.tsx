import type { MeetingPreOpinion } from '@/features/book/book.types'
import BookLogActionMenu from '@/features/book/components/BookLogActionMenu'
import { Division } from '@/shared/components/Division'
import { formatToDateTimeWithDay } from '@/shared/lib/date'
import { Badge } from '@/shared/ui/Badge'
import { FoldedCard } from '@/shared/ui/FoldedCard'

type MeetingPreOpinionItemProps = {
  record: MeetingPreOpinion
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * 모임 사전의견 아이템 컴포넌트
 * - 독서 모임 전 작성한 사전의견을 토픽별 질문-답변 형태로 표시합니다.
 *
 * @example
 * ```tsx
 * <MeetingPreOpinionItem record={meetingPreOpinion} />
 * ```
 */
const MeetingPreOpinionItem = ({ record, onEdit, onDelete }: MeetingPreOpinionItemProps) => {
  const sortedTopics = [...record.topics].sort((a, b) => a.confirmOrder - b.confirmOrder)

  return (
    <FoldedCard className="flex flex-col gap-large">
      <div className="flex flex-wrap items-center gap-x-xsmall gap-y-0">
        <div className="flex items-center gap-xsmall max-lg:w-full max-lg:justify-between">
          <Badge color={'yellow'}>{record.gatheringName}</Badge>
          {(onEdit || onDelete) && (
            <span className="hidden max-lg:-my-xsmall max-lg:block">
              <BookLogActionMenu onEdit={onEdit} onDelete={onDelete} />
            </span>
          )}
        </div>
        <div className="flex items-center gap-xsmall max-lg:w-full max-lg:mt-xsmall">
          <p className="text-grey-600 px-xsmall py-xtiny typo-body4 max-lg:typo-m-body4 max-lg:px-0 max-lg:py-0">
            사전 의견
          </p>
          <p className="text-grey-600 typo-body4 max-lg:typo-m-body4">
            {formatToDateTimeWithDay(record.sharedAt)}
          </p>
        </div>
        {(onEdit || onDelete) && (
          <span className="ml-auto max-lg:hidden">
            <BookLogActionMenu onEdit={onEdit} onDelete={onDelete} />
          </span>
        )}
      </div>

      {sortedTopics.map((topic, idx) => (
        <div key={topic.confirmOrder}>
          <div className="flex flex-col gap-small pl-xtiny">
            <div>
              <h4 className="typo-subtitle2 text-grey-800">
                주제 {topic.confirmOrder}. {topic.topicTitle}
              </h4>
              <p className="mt-xxtiny typo-body1 text-grey-700 whitespace-pre-wrap">
                {topic.topicDescription}
              </p>
            </div>
            {topic.answer && (
              <p className="typo-body1 text-black whitespace-pre-wrap">{topic.answer}</p>
            )}
          </div>
          {idx !== sortedTopics.length - 1 && <Division className="mt-medium" />}
        </div>
      ))}
    </FoldedCard>
  )
}

export default MeetingPreOpinionItem
