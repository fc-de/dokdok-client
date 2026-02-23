/**
 * @file usePersonalRetrospectiveForm.ts
 * @description 개인 회고 작성 폼 전체 상태를 관리하는 최상위 훅
 */

import type { PersonalRetrospectivePreOpinion, PersonalRetrospectiveTopic } from '../personalRetrospective.types'
import { useChangedThoughts } from './useChangedThoughts'
import { useFreeRecord } from './useFreeRecord'
import { useOthersPerspective } from './useOthersPerspective'
import { useSavePersonalRetrospective } from './useSavePersonalRetrospective'

type UsePersonalRetrospectiveFormParams = {
  meetingId: number
  topics: PersonalRetrospectiveTopic[]
  preOpinions: PersonalRetrospectivePreOpinion[]
}

/**
 * 개인 회고 작성 폼 전체 상태 훅
 *
 * @description
 * 바뀐 나의 생각, 타인의 관점, 자유 기록 섹션의 폼 상태를 통합 관리합니다.
 * 작성 완료 버튼의 submit 핸들러를 제공합니다.
 *
 * @example
 * ```tsx
 * const form = usePersonalRetrospectiveForm({ meetingId, topics, preOpinions })
 * <Button onClick={form.submit} disabled={form.isSubmitting}>작성 완료</Button>
 * <PersonalRetrospectiveContent form={form} />
 * ```
 */
export function usePersonalRetrospectiveForm({
  meetingId,
  topics,
  preOpinions,
}: UsePersonalRetrospectiveFormParams) {
  const changedThoughts = useChangedThoughts(topics, preOpinions)
  const othersPerspective = useOthersPerspective()
  const freeRecord = useFreeRecord()
  const { mutate: save, isPending } = useSavePersonalRetrospective()

  const submit = () => {
    save({
      meetingId,
      body: {
        changedThoughts: changedThoughts.formValues.map(({ topicId, coreSummary, postOpinion }) => ({
          topicId,
          keyIssue: coreSummary,
          postOpinion,
        })),
        othersPerspectives: othersPerspective.items
          .filter((item) => item.speakerMemberId !== null && item.topicId !== null)
          .map((item) => ({
            topicId: item.topicId!,
            meetingMemberId: item.speakerMemberId!,
            opinionContent: item.opinion,
            impressiveReason: item.impact,
          })),
        freeTexts: freeRecord.entries
          .filter((entry) => entry.title.trim() !== '' || entry.content.trim() !== '')
          .map(({ title, content }) => ({ title, content })),
      },
    })
  }

  return {
    changedThoughts,
    othersPerspective,
    freeRecord,
    submit,
    isSubmitting: isPending,
  }
}

export type UsePersonalRetrospectiveFormReturn = ReturnType<typeof usePersonalRetrospectiveForm>
