import type { MeetingGroupRecord } from '@/features/book/book.types'
import { Division } from '@/shared/components/Division'
import { formatToDateWithDayAndTime } from '@/shared/lib/date'
import { Badge } from '@/shared/ui/Badge'
import { FoldedCard } from '@/shared/ui/FoldedCard'
import { TextButton } from '@/shared/ui/TextButton'

type MeetingGroupRecordItemProps = {
  record: MeetingGroupRecord
  onEdit?: () => void
}

/**
 * 모임 공동 회고 아이템 컴포넌트
 * - 독서 모임의 공동 회고 기록을 표시합니다.
 * - 토픽별 요약 의견과 참여자 댓글을 포함합니다.
 *
 * @example
 * ```tsx
 * <MeetingGroupRecordItem record={meetingGroupRecord} />
 * ```
 */
const MeetingGroupRecordItem = ({ record, onEdit }: MeetingGroupRecordItemProps) => {
  return (
    <FoldedCard>
      {/* 모임 헤더 */}
      <div className="flex flex-col gap-xsmall">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xsmall">
            <Badge color={'yellow'}>{record.gathering.gatheringName}</Badge>
            <p className="text-grey-600 px-xsmall py-xtiny typo-body4 ml-xsmall mr-small">
              약속 회고
            </p>
            <span className="typo-caption1 text-grey-600">
              {formatToDateWithDayAndTime(record.meetingDate, record.meetingTime)}
            </span>
          </div>
          {onEdit && <TextButton size={'medium'}>수정하기</TextButton>}
        </div>
      </div>

      {/* 토픽 목록 */}
      <div className="flex flex-col gap-large pl-xtiny">
        {record.topics.map((topic, idx) => (
          <div key={topic.topicId}>
            <div className="flex flex-col gap-small">
              <div className="flex flex-col gap-xxtiny">
                <h3 className="typo-subtitle2 text-grey-800 mb-xxtiny">
                  {'주제 ' + topic.confirmOrder}. {topic.topicTitle}
                </h3>
                <p className="typo-body1 text-grey-600">{topic.topicDescription}</p>
              </div>

              {/* 요약 */}
              {topic.summary && (
                <div>
                  <h4 className="typo-body2 text-grey-600 mb-xxtiny">핵심 요약</h4>
                  <p className="typo-body1 text-grey-800">{topic.summary}</p>
                </div>
              )}

              {/* 핵심 포인트 */}
              {topic.keyPoints.length > 0 && (
                <div>
                  <h4 className="typo-body2 text-grey-600 mb-xxtiny">주요 포인트</h4>
                  <div className="flex flex-col gap-small">
                    {topic.keyPoints.map((keyPoint, idx) => (
                      <div key={idx} className="flex flex-col gap-tiny">
                        <span className="typo-subtitle5 text-grey-800">
                          {idx + 1 + ') '}
                          {keyPoint.title}
                        </span>
                        <ul className="flex flex-col gap-tiny pl-small">
                          {keyPoint.details.map((detail, dIdx) => (
                            <li
                              key={dIdx}
                              className="typo-body1 text-grey-600 list-disc list-inside"
                            >
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {record.topics.length - 1 !== idx && <Division className="mt-medium" />}
          </div>
        ))}
      </div>
    </FoldedCard>
  )
}

export default MeetingGroupRecordItem
