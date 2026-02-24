/**
 * @file usePersonalRetrospectiveForm.ts
 * @description 개인 회고 작성 폼 전체 상태를 관리하는 최상위 훅
 */

import { useState } from 'react'

import { ApiError } from '@/api/errors'

import type { PersonalRetrospectivePreOpinion, PersonalRetrospectiveTopic } from '../personalRetrospective.types'
import { useChangedThoughts } from './useChangedThoughts'
import { useFreeRecord } from './useFreeRecord'
import { useOthersPerspective } from './useOthersPerspective'
import { useSavePersonalRetrospective } from './useSavePersonalRetrospective'

export type SectionKey = 'changedThoughts' | 'othersPerspective' | 'freeRecord'

type UsePersonalRetrospectiveFormParams = {
  meetingId: number
  topics: PersonalRetrospectiveTopic[]
  preOpinions: PersonalRetrospectivePreOpinion[]
  onSuccess?: () => void
  onError?: (error: ApiError) => void
}

/**
 * 개인 회고 작성 폼 전체 상태 훅
 *
 * @description
 * 바뀐 나의 생각, 타인의 관점, 자유 기록 섹션의 폼 상태를 통합 관리합니다.
 * 섹션별 가시성 제어(showSection/hideSection), 저장 핸들러를 제공합니다.
 * 닫힌 섹션은 POST 시 빈 배열로 전송됩니다.
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
  onSuccess,
  onError,
}: UsePersonalRetrospectiveFormParams) {
  const changedThoughts = useChangedThoughts(topics, preOpinions)
  const othersPerspective = useOthersPerspective()
  const freeRecord = useFreeRecord()
  const { mutate: save, isPending } = useSavePersonalRetrospective()
  const [showErrors, setShowErrors] = useState(false)
  const [scrollTrigger, setScrollTrigger] = useState(0)
  const [sectionVisibility, setSectionVisibility] = useState({
    changedThoughts: true,
    othersPerspective: false,
    freeRecord: false,
  })

  const showSection = (section: SectionKey) => {
    setSectionVisibility((prev) => ({ ...prev, [section]: true }))
    if (section === 'othersPerspective' && othersPerspective.items.length === 0) {
      othersPerspective.addItem()
    }
    if (section === 'freeRecord' && freeRecord.entries.length === 0) {
      freeRecord.addEntry()
    }
  }

  const hideSection = (section: SectionKey) => {
    setSectionVisibility((prev) => ({ ...prev, [section]: false }))
    if (section === 'changedThoughts') changedThoughts.reset()
    if (section === 'othersPerspective') othersPerspective.reset()
    if (section === 'freeRecord') freeRecord.reset()
  }

  const submit = () => {
    const hasPartial =
      (sectionVisibility.changedThoughts && changedThoughts.hasPartialInput) ||
      (sectionVisibility.othersPerspective && othersPerspective.hasPartialInput) ||
      (sectionVisibility.freeRecord && freeRecord.hasPartialInput)

    if (hasPartial) {
      setShowErrors(true)
      setScrollTrigger((prev) => prev + 1)
      return
    }

    const toNullable = (value: string) => value.trim() || null

    const requestBody = {
      changedThoughts: sectionVisibility.changedThoughts
        ? changedThoughts.formValues
            .filter(({ coreSummary, postOpinion }) => coreSummary.trim() !== '' || postOpinion.trim() !== '')
            .map(({ topicId, coreSummary, postOpinion }) => ({
              topicId,
              keyIssue: toNullable(coreSummary),
              postOpinion: toNullable(postOpinion),
            }))
        : [],
      othersPerspectives: sectionVisibility.othersPerspective
        ? othersPerspective.items
            .filter(
              (item) =>
                item.speakerMemberId !== null &&
                item.topicId !== null &&
                item.opinion.trim() !== '' &&
                item.impact.trim() !== '',
            )
            .map((item) => ({
              topicId: item.topicId!,
              meetingMemberId: item.speakerMemberId!,
              opinionContent: item.opinion.trim(),
              impressiveReason: item.impact.trim(),
            }))
        : [],
      freeTexts: sectionVisibility.freeRecord
        ? freeRecord.entries
            .filter((entry) => entry.title.trim() !== '' || entry.content.trim() !== '')
            .map(({ title, content }) => ({
              title: toNullable(title),
              content: toNullable(content),
            }))
        : [],
    }
    save(
      { meetingId, body: requestBody },
      { onSuccess, onError },
    )
  }

  return {
    changedThoughts,
    othersPerspective,
    freeRecord,
    submit,
    isSubmitting: isPending,
    showErrors,
    scrollTrigger,
    sectionVisibility,
    showSection,
    hideSection,
  }
}

export type UsePersonalRetrospectiveFormReturn = ReturnType<typeof usePersonalRetrospectiveForm>
