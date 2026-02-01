import type { MeetingPreOpinion } from '@/features/book/book.types'
import { Division } from '@/shared/components/Division'
import { formatToDateTimeWithDay } from '@/shared/lib/date'
import { Badge } from '@/shared/ui/Badge'
import { FoldedCard } from '@/shared/ui/FoldedCard'
import { TextButton } from '@/shared/ui/TextButton'

type MeetingPreOpinionItemProps = {
  record: MeetingPreOpinion
  onEdit?: () => void
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
const MeetingPreOpinionItem = ({ record, onEdit }: MeetingPreOpinionItemProps) => {
  const sortedTopics = [...record.topics].sort((a, b) => a.confirmOrder - b.confirmOrder)

  return (
    <FoldedCard className="flex flex-col gap-large">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xsmall">
          <Badge color={'yellow'}>{record.gatheringName}</Badge>
          <p className="text-grey-600 px-xsmall py-xtiny typo-body4 ml-xsmall mr-small">
            사전 의견
          </p>
          <p className="text-grey-600 typo-body4">{formatToDateTimeWithDay(record.sharedAt)}</p>
        </div>
        {onEdit && <TextButton size={'medium'}>수정하기</TextButton>}
      </div>

      {sortedTopics.map((topic, idx) => (
        <div key={topic.confirmOrder}>
          <div className="flex flex-col gap-small pl-xtiny">
            <div>
              <h4 className="typo-subtitle2 text-grey-800">
                주제 {topic.confirmOrder}. {topic.topicTitle}
              </h4>
              <p className="mt-xxtiny typo-body1 text-grey-700">{topic.topicDescription}</p>
            </div>
            <p className="typo-body1 text-black">{topic.answer}</p>
          </div>
          {idx !== sortedTopics.length - 1 && <Division className="mt-medium" />}
        </div>
      ))}
    </FoldedCard>
  )
}

export default MeetingPreOpinionItem
