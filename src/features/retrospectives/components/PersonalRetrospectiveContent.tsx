import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
} from '@/shared/ui'

import type { GetPersonalRetrospectiveResponse } from '../personalRetrospective.types'

export interface PersonalRetrospectiveContentProps {
  data: GetPersonalRetrospectiveResponse
}

/**
 * 개인 회고 콘텐츠
 *
 * @description
 * 개인 회고 페이지의 전체 콘텐츠를 렌더링합니다.
 * 책 정보, 참여 멤버, 내 사전 의견, 토론 주제 섹션으로 구성됩니다.
 *
 * @example
 * ```tsx
 * <PersonalRetrospectiveContent data={personalRetrospectiveData} />
 * ```
 */
export default function PersonalRetrospectiveContent({
  data,
}: PersonalRetrospectiveContentProps) {
  const { gatheringName, bookTitle, bookAuthor, preOpinions, topics, meetingMembers } = data

  return (
    <div className="flex flex-col gap-large">
      {/* 책 정보 */}
      <Card>
        <p className="text-grey-500 typo-body4">{gatheringName}</p>
        <p className="mt-xsmall text-black typo-heading3">{bookTitle}</p>
        <p className="mt-xxsmall text-grey-600 typo-body3">{bookAuthor}</p>
      </Card>

      {/* 함께한 멤버 */}
      <section>
        <h4 className="mb-small text-black typo-heading4">함께한 멤버</h4>
        <div className="flex flex-wrap gap-small">
          {meetingMembers.map((member) => (
            <div key={member.meetingMemberId} className="flex flex-col items-center gap-xxsmall">
              <Avatar className="size-10">
                <AvatarImage src={member.profileImage} alt={member.nickname} />
                <AvatarFallback>{member.nickname.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <span className="text-grey-700 typo-body4">{member.nickname}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 토론 주제 */}
      <section>
        <h4 className="mb-small text-black typo-heading4">토론 주제</h4>
        <div className="flex flex-col gap-xsmall">
          {topics.map((topic) => (
            <Card key={topic.topicId} className="flex items-center gap-small p-small">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 typo-body4">
                {topic.confirmOrder}
              </span>
              <span className="text-black typo-body2">{topic.topicName}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* 내 사전 의견 */}
      <section>
        <h4 className="mb-small text-black typo-heading4">내 사전 의견</h4>
        <div className="flex flex-col gap-small">
          {preOpinions.map((opinion) => (
            <Card key={opinion.topicId}>
              <p className="text-grey-500 typo-body4">{opinion.topicName}</p>
              <p className="mt-xsmall text-black typo-body2">{opinion.content}</p>
            </Card>
          ))}
          {preOpinions.length === 0 && (
            <p className="text-grey-400 typo-body3">작성한 사전 의견이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  )
}
