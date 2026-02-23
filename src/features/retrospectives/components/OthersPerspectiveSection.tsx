import { Trash2 } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Container,
  Input,
  Select,
  Textarea,
} from '@/shared/ui'

import type { UseOthersPerspectiveReturn } from '../hooks/useOthersPerspective'
import type {
  PersonalRetrospectiveMember,
  PersonalRetrospectiveTopic,
} from '../personalRetrospective.types'

export interface OthersPerspectiveSectionProps {
  topics: PersonalRetrospectiveTopic[]
  members: PersonalRetrospectiveMember[]
  form: UseOthersPerspectiveReturn
}

/**
 * 타인의 관점 섹션
 *
 * @description
 * 모임에서 들은 타인의 의견을 기록하는 동적 폼 섹션입니다.
 * 관점 항목을 추가/삭제할 수 있습니다.
 *
 * @example
 * ```tsx
 * <OthersPerspectiveSection topics={topics} members={members} form={othersPerspectiveForm} />
 * ```
 */
export default function OthersPerspectiveSection({
  topics,
  members,
  form,
}: OthersPerspectiveSectionProps) {
  const { items, addItem, removeItem, updateItem } = form

  return (
    <section>
      <Container className="gap-large">
        <h3 className="text-black typo-heading3">타인의 관점</h3>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-base rounded-small bg-grey-100 border border-grey-300 p-medium"
          >
            <div className="flex flex-col gap-small">
              <span className="text-grey-600 typo-body4">누가 말했나요?</span>
              <Select
                placeholder="멤버를 선택하세요"
                className="w-full md:max-w-full bg-white border-grey-300"
                value={item.speakerMemberId?.toString() ?? ''}
                onValueChange={(v) => updateItem(item.id, 'speakerMemberId', Number(v))}
              >
                {members.map((member) => (
                  <Select.SelectItem
                    key={member.meetingMemberId}
                    value={member.meetingMemberId.toString()}
                  >
                    <span className="flex gap-small items-center">
                      <Avatar className="size-8">
                        <AvatarImage src={member.profileImage ?? undefined} alt={member.nickname} />
                        <AvatarFallback>{member.nickname.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      {member.nickname}
                    </span>
                  </Select.SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-small">
              <span className="text-grey-600 typo-body4">어떤 주제에서 나온 의견인가요?</span>
              <Select
                placeholder="주제를 선택하세요"
                className="w-full md:max-w-full bg-white border-grey-300"
                value={item.topicId?.toString() ?? ''}
                onValueChange={(v) => updateItem(item.id, 'topicId', Number(v))}
              >
                {topics.map((topic) => (
                  <Select.SelectItem key={topic.topicId} value={topic.topicId.toString()}>
                    {topic.topicName}
                  </Select.SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-small">
              <span className="text-grey-600 typo-body4">어떤 의견이었나요?</span>
              <Input
                placeholder="의견의 내용을 작성해주세요"
                value={item.opinion}
                onChange={(e) => updateItem(item.id, 'opinion', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-small">
              <span className="text-grey-600 typo-body4">
                이 의견이 나에게 어떤 영향을 주었나요?
              </span>
              <Textarea
                placeholder="주제에 대해 구별되는 관점을 적어주세요"
                value={item.impact}
                onChange={(e) => updateItem(item.id, 'impact', e.target.value)}
                height={104}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-grey-400 hover:text-accent-300 transition-colors"
                onClick={() => removeItem(item.id)}
                aria-label="관점 삭제"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>
        ))}
        <Button variant="secondary" outline onClick={addItem}>
          + 관점 추가하기
        </Button>
      </Container>
    </section>
  )
}
