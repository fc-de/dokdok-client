import type { PreOpinionTopic } from '@/features/pre-opinion/preOpinion.types'
import { Badge, Container, Textarea } from '@/shared/ui'

interface PreOpinionQuestionSectionProps {
  topics: PreOpinionTopic[]
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
 * <PreOpinionQuestionSection topics={preOpinion.topics} />
 * ```
 */
const PreOpinionQuestionSection = ({ topics }: PreOpinionQuestionSectionProps) => {
  const sortedTopics = [...topics].sort((a, b) => a.confirmOrder - b.confirmOrder)

  return (
    <>
      {sortedTopics.map((topic) => (
        <Container key={topic.topicId} className="gap-small">
          <Container.Title
            className="typo-subtitle3 pl-xxtiny"
            badge={<Badge>{topic.topicTypeLabel}</Badge>}
          >
            {`주제 ${topic.confirmOrder}. ${topic.topicTitle}`}
          </Container.Title>
          <Container.Content>
            <div className="flex flex-col gap-small">
              <p className="typo-body4 text-grey-600">{topic.topicDescription}</p>
              <Textarea placeholder="자유롭게 작성해주세요" defaultValue={topic.content ?? ''} />
            </div>
          </Container.Content>
        </Container>
      ))}
    </>
  )
}

export default PreOpinionQuestionSection
