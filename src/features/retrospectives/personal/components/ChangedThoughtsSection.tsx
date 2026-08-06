import { X } from 'lucide-react'

import { Container, Input, Textarea, TextButton } from '@/shared/ui'

import type { UseChangedThoughtsReturn } from '../hooks/useChangedThoughts'
import { CHANGED_THOUGHTS_LIMITS } from '../personalRetrospective.constants'
import type { PersonalRetrospectiveTopic } from '../personalRetrospective.types'

export interface ChangedThoughtsSectionProps {
  topics: PersonalRetrospectiveTopic[]
  form: UseChangedThoughtsReturn
  showErrors: boolean
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
  showErrors,
  onClose,
}: ChangedThoughtsSectionProps) {
  const { formValues, updateField, getPreOpinion, isItemPartial } = form

  return (
    <section>
      {/* 모바일: 타이틀을 카드 바깥에 노출 */}
      <div className="hidden max-lg:flex justify-between items-center mb-medium">
        <h3 className="text-black typo-heading3 max-lg:typo-subtitle2">바뀐 나의 생각</h3>
        <TextButton
          onClick={onClose}
          className="text-grey-500 typo-m-caption2 hover:text-black"
          aria-label="바뀐 나의 생각 섹션 닫기"
        >
          삭제하기
        </TextButton>
      </div>

      <div className="flex flex-col">
        <Container className="gap-0 max-lg:bg-transparent max-lg:rounded-none max-lg:p-0 max-lg:shadow-none">
          <div className="flex justify-between items-center mb-large max-lg:hidden">
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
          <div className="flex flex-col gap-xlarge max-lg:gap-small">
            {formValues.map((item) => {
              const coreSummaryRequiredError = showErrors && isItemPartial(item.topicId)
              const coreSummaryExceeded =
                item.coreSummary.length >= CHANGED_THOUGHTS_LIMITS.CORE_ISSUE_MAX
              const coreSummaryError = coreSummaryRequiredError || coreSummaryExceeded
              const coreSummaryErrorMessage = coreSummaryExceeded
                ? `${CHANGED_THOUGHTS_LIMITS.CORE_ISSUE_MAX}자 이내로 작성이 가능해요`
                : '핵심 쟁점을 입력해주세요'

              return (
                <div
                  key={item.topicId}
                  className="flex flex-col gap-[20px] max-lg:gap-small"
                  {...(coreSummaryRequiredError ? { 'data-field-error': '' } : {})}
                >
                  <div>
                    <p className="text-black typo-subtitle3 mb-small max-lg:typo-body2">
                      {topics.find((t) => t.topicId === item.topicId)?.topicName}
                    </p>

                    <div className="max-lg:hidden">
                      <Input
                        placeholder="핵심 쟁점을 요약해주세요"
                        value={item.coreSummary}
                        onChange={(e) => updateField(item.topicId, 'coreSummary', e.target.value)}
                        maxLength={CHANGED_THOUGHTS_LIMITS.CORE_ISSUE_MAX}
                        error={coreSummaryError}
                        errorMessage={coreSummaryErrorMessage}
                      />
                    </div>
                    {/* 모바일: 입력 내용에 따라 높이가 늘어나는 텍스트영역 */}
                    <div className="hidden max-lg:block">
                      <Textarea
                        format="comment"
                        placeholder="핵심 쟁점을 요약해주세요"
                        value={item.coreSummary}
                        onChange={(e) => updateField(item.topicId, 'coreSummary', e.target.value)}
                        maxLength={CHANGED_THOUGHTS_LIMITS.CORE_ISSUE_MAX}
                        error={coreSummaryError}
                        errorMessage={coreSummaryErrorMessage}
                      />
                    </div>
                  </div>

                  {getPreOpinion(item.topicId) ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-base max-lg:gap-small">
                      <div className="flex flex-col gap-tiny">
                        <span className="text-grey-600 typo-body4 max-lg:typo-body3">
                          모임 전 내 의견
                        </span>
                        <Textarea
                          value={getPreOpinion(item.topicId)}
                          disabled
                          scrollable
                          height={180}
                          className="bg-grey-200 text-black"
                        />
                      </div>
                      <div className="flex flex-col gap-tiny">
                        <span className="text-grey-600 typo-body4 max-lg:typo-body3">
                          모임 후 내 의견
                        </span>
                        <Textarea
                          placeholder="감상문을 입력해주세요"
                          value={item.postOpinion}
                          onChange={(e) => updateField(item.topicId, 'postOpinion', e.target.value)}
                          height={154}
                          maxLength={CHANGED_THOUGHTS_LIMITS.POST_OPINION_MAX}
                          error={
                            item.postOpinion.length >= CHANGED_THOUGHTS_LIMITS.POST_OPINION_MAX
                          }
                          errorMessage={`${CHANGED_THOUGHTS_LIMITS.POST_OPINION_MAX.toLocaleString()}자 이내로 작성이 가능해요`}
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
                        maxLength={CHANGED_THOUGHTS_LIMITS.POST_OPINION_MAX}
                        error={item.postOpinion.length >= CHANGED_THOUGHTS_LIMITS.POST_OPINION_MAX}
                        errorMessage={`${CHANGED_THOUGHTS_LIMITS.POST_OPINION_MAX.toLocaleString()}자 이내로 작성이 가능해요`}
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
