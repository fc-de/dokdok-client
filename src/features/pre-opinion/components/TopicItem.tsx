import { useState } from 'react'

import type { PreOpinionTopic } from '@/features/pre-opinion/preOpinion.types'
import { Badge, Container, Textarea } from '@/shared/ui'

interface TopicItemProps {
  topic: PreOpinionTopic
  onChange?: (topicId: number, content: string) => void
}

function TopicItem({ topic, onChange }: TopicItemProps) {
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
          <p className="typo-body4 text-grey-600 whitespace-pre-line">{topic.topicDescription}</p>
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

export default TopicItem
