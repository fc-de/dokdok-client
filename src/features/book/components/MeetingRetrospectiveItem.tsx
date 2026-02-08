import type { MeetingPersonalRecord } from '@/features/book/book.types'
import BookLogActionMenu from '@/features/book/components/BookLogActionMenu'
import { Division } from '@/shared/components/Division'
import { formatToDateTimeWithDay } from '@/shared/lib/date'
import { Badge } from '@/shared/ui'
import { FoldedCard } from '@/shared/ui/FoldedCard'

import ExcerptBlock from './ExcerptBlock'

type MeetingRetrospectiveItemProps = {
  record: MeetingPersonalRecord
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * 모임 개인 회고 아이템 컴포넌트
 * - 독서 모임 후 작성한 개인 회고를 토픽별로 표시합니다.
 * - 각 토픽의 핵심 쟁점, 생각 변화, 타인 관점을 포함합니다.
 *
 * @example
 * ```tsx
 * <MeetingRetrospectiveItem record={meetingPersonalRecord} />
 * ```
 */
const MeetingRetrospectiveItem = ({ record, onEdit, onDelete }: MeetingRetrospectiveItemProps) => {
  const { gatheringName, createdAt, topicGroups, freeTexts } = record

  return (
    <FoldedCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xsmall">
          <Badge color={'yellow'}>{gatheringName}</Badge>
          <p className="text-grey-600 px-xsmall py-xtiny typo-body4 ml-xsmall mr-small">
            개인 회고
          </p>
          <span className="typo-body4 text-grey-600">{formatToDateTimeWithDay(createdAt)}</span>
        </div>
        {(onEdit || onDelete) && <BookLogActionMenu onEdit={onEdit} onDelete={onDelete} />}
      </div>

      <div className="flex flex-col">
        {/* 토픽별 회고 */}
        {topicGroups.map((topic, index) => (
          <div key={topic.topicId} className="flex flex-col gap-large">
            {index > 0 && <Division className="mt-medium" />}
            <div>
              <h4 className="typo-subtitle2 text-grey-800 mb-xxtiny">
                주제 {topic.confirmOrder}. {topic.topicTitle}
              </h4>

              {/* 생각 변화 */}
              {topic.changedThoughts && (
                <div className="flex flex-col gap-small">
                  <p className="typo-body1 text-grey-700">{topic.changedThoughts.keyIssue}</p>
                  <p className="typo-body1 text-black">{topic.changedThoughts.postOpinion}</p>
                </div>
              )}
            </div>

            {/* 타인 관점 */}
            {topic.othersPerspectives.length > 0 && (
              <div className="flex flex-col gap-small">
                {topic.othersPerspectives.map((perspective) => (
                  <div key={perspective.meetingMemberId} className="flex flex-col gap-medium">
                    <ExcerptBlock>
                      <p className="typo-subtitle5 text-grey-800">{perspective.opinionContent}</p>
                      <span className="typo-body1 text-grey-600">{perspective.memberNickname}</span>
                    </ExcerptBlock>
                    <p className="typo-body1 text-grey-800">{perspective.impressiveReason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 자유 텍스트 */}
        {freeTexts.map((text, idx) => (
          <div key={`free-${idx}`} className="flex flex-col">
            {(topicGroups.length > 0 || idx > 0) && <Division className="mt-medium mb-large" />}
            <div className="flex flex-col gap-small">
              <h5 className="typo-subtitle2 text-grey-800">{text.title}</h5>
              <p className="typo-body1 text-black">{text.content}</p>
            </div>
          </div>
        ))}
      </div>
    </FoldedCard>
  )
}

export default MeetingRetrospectiveItem
