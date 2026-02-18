import { useState } from 'react'

import type { PreOpinionTopic } from '@/features/pre-opinion/preOpinion.types'
import { Badge, Container, Textarea } from '@/shared/ui'

interface PreOpinionQuestionSectionProps {
  topics: PreOpinionTopic[]
  onChange?: (topicId: number, content: string) => void
}

/**
 * 사전 의견 주제별 질문 섹션
 *
 * @description
 * 확정된 주제 목록을 confirmOrder 순서대로 렌더링합니다.
 * 각 주제는 Container 컴포넌트로 감싸며,
 * 주제 설명과 텍스트 입력 영역을 포함합니다.
 *
 * @example
 * ```tsx
 * <PreOpinionQuestionSection
 *   topics={preOpinion.topics}
 *   onChange={(topicId, content) => handleTopicChange(topicId, content)}
 * />
 * ```
 */
function TopicItem({
  topic,
  onChange,
}: {
  topic: PreOpinionTopic
  onChange?: (topicId: number, content: string) => void
}) {
  const [value, setValue] = useState(topic.content ?? '')
  const [prevContent, setPrevContent] = useState(topic.content)

  if (topic.content !== prevContent) {
    setPrevContent(topic.content)
    setValue(topic.content ?? '')
  }

  return (
    <Container className="gap-small">
      <Container.Title
        className="typo-subtitle3 pl-xxtiny"
        badge={<Badge>{topic.topicTypeLabel}</Badge>}
      >
        {`주제 ${topic.confirmOrder}. ${topic.topicTitle}`}
      </Container.Title>
      <Container.Content>
        <div className="flex flex-col gap-small">
          <p className="typo-body4 text-grey-600">{topic.topicDescription}</p>
          <Textarea
            placeholder="자유롭게 작성해주세요"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              onChange?.(topic.topicId, e.target.value)
            }}
          />
        </div>
      </Container.Content>
    </Container>
  )
}

const PreOpinionQuestionSection = ({ topics, onChange }: PreOpinionQuestionSectionProps) => {
  const sortedTopics = [...topics].sort((a, b) => a.confirmOrder - b.confirmOrder)

  return (
    <>
      {sortedTopics.map((topic) => (
        <TopicItem key={topic.topicId} topic={topic} onChange={onChange} />
      ))}
    </>
  )
}

export default PreOpinionQuestionSection
