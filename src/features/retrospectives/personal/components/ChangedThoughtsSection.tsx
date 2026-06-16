import { X } from 'lucide-react'

import { Container, Input, Textarea } from '@/shared/ui'

import type { UseChangedThoughtsReturn } from '../hooks/useChangedThoughts'
import type { PersonalRetrospectiveTopic } from '../personalRetrospective.types'

export interface ChangedThoughtsSectionProps {
  topics: PersonalRetrospectiveTopic[]
  form: UseChangedThoughtsReturn
  onClose: () => void
}

/**
 * 바뀐 나의 생각 섹션
 *
 * @description
 * 각 토픽별로 핵심 쟁점 요약, 모임 전/후 내 의견을 입력하는 폼 섹션입니다.
 * 모임 전 의견은 읽기 전용으로 표시되고, 모임 후 의견은 직접 작성합니다.
 * 에러 표시 및 스크롤 처리는 상위 컴포넌트에서 담당합니다.
 *
 * @example
 * ```tsx
 * <ChangedThoughtsSection topics={topics} form={changedThoughtsForm} onClose={handleClose} />
 * ```
 */
export default function ChangedThoughtsSection({
  topics,
  form,
  onClose,
}: ChangedThoughtsSectionProps) {
  const { formValues, updateField, getPreOpinion } = form

  return (
    <section>
      <div className="flex flex-col">
        <Container className="gap-0">
          <div className="flex justify-between items-center mb-large">
            <h3 className="text-black typo-heading3">바뀐 나의 생각</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-grey-400 hover:text-black transition-colors"
              aria-label="바뀐 나의 생각 섹션 닫기"
            >
              <X className="size-6 text-grey-600 cursor-pointer" />
            </button>
          </div>
          <div className="flex flex-col gap-xlarge">
            {formValues.map((item) => {
              return (
                <div key={item.topicId}>
                  <p className="text-black typo-subtitle3 mb-small">
                    {topics.find((t) => t.topicId === item.topicId)?.topicName}
                  </p>

                  <Input
                    placeholder="핵심 쟁점을 요약해주세요"
                    value={item.coreSummary}
                    onChange={(e) => updateField(item.topicId, 'coreSummary', e.target.value)}
                    className="mb-medium"
                  />

                  {getPreOpinion(item.topicId) ? (
                    <div className="grid grid-cols-2 gap-base">
                      <div className="flex flex-col gap-tiny">
                        <span className="text-grey-600 typo-body4">모임 전 내 의견</span>
                        <Textarea
                          value={getPreOpinion(item.topicId)}
                          disabled
                          scrollable
                          height={160}
                          className="bg-grey-200 text-black"
                        />
                      </div>
                      <div className="flex flex-col gap-tiny">
                        <span className="text-grey-600 typo-body4">모임 후 내 의견</span>
                        <Textarea
                          placeholder="감상문을 입력해주세요"
                          value={item.postOpinion}
                          onChange={(e) => updateField(item.topicId, 'postOpinion', e.target.value)}
                          height={160}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-xsmall">
                      <span className="text-grey-600 typo-body4">변화된 나의 생각</span>
                      <Textarea
                        placeholder="감상문을 입력해주세요"
                        value={item.postOpinion}
                        onChange={(e) => updateField(item.topicId, 'postOpinion', e.target.value)}
                        height={104}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Container>
      </div>
    </section>
  )
}
