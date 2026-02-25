/**
 * @file usePersonalRetrospectiveForm.ts
 * @description 개인 회고 작성/수정 폼 전체 상태를 관리하는 최상위 훅
 */

import { useEffect, useState } from 'react'

import { ApiError } from '@/api/errors'

import type {
  GetPersonalRetrospectiveEditFormResponse,
  PersonalRetrospectivePreOpinion,
  PersonalRetrospectiveTopic,
} from '../personalRetrospective.types'
import { useChangedThoughts } from './useChangedThoughts'
import { useFreeRecord } from './useFreeRecord'
import { useOthersPerspective } from './useOthersPerspective'
import { useSavePersonalRetrospective } from './useSavePersonalRetrospective'
import { useUpdatePersonalRetrospective } from './useUpdatePersonalRetrospective'

export type SectionKey = 'changedThoughts' | 'othersPerspective' | 'freeRecord'

type UsePersonalRetrospectiveFormParams = {
  meetingId: number
  topics: PersonalRetrospectiveTopic[]
  preOpinions: PersonalRetrospectivePreOpinion[]
  mode?: 'create' | 'edit'
  editFormData?: GetPersonalRetrospectiveEditFormResponse
  onSuccess?: () => void
  onError?: (error: ApiError) => void
}

/**
 * 개인 회고 작성/수정 폼 전체 상태 훅
 *
 * @description
 * 바뀐 나의 생각, 타인의 관점, 자유 기록 섹션의 폼 상태를 통합 관리합니다.
 * 섹션별 가시성 제어(showSection/hideSection), 저장 핸들러를 제공합니다.
 * 닫힌 섹션은 제출 시 빈 배열로 전송됩니다.
 * mode가 'edit'이면 PUT API를 사용하고, editFormData로 기존값을 초기화합니다.
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
  mode = 'create',
  editFormData,
  onSuccess,
  onError,
}: UsePersonalRetrospectiveFormParams) {
  const isEditMode = mode === 'edit'

  const initialChangedThoughtOverrides = editFormData
    ? Object.fromEntries(
        editFormData.retrospective.changedThoughts.map(({ topicId, keyIssue, postOpinion }) => [
          topicId,
          { coreSummary: keyIssue ?? '', postOpinion: postOpinion ?? '' },
        ])
      )
    : undefined

  const initialOthersPerspectiveItems = editFormData?.retrospective.othersPerspectives.map(
    (item) => ({
      id: crypto.randomUUID(),
      speakerMemberId: item.meetingMemberId,
      topicId: item.topicId,
      opinion: item.opinionContent,
      impact: item.impressiveReason,
    })
  )

  const initialFreeRecordEntries = editFormData?.retrospective.freeTexts.map((entry) => ({
    id: crypto.randomUUID(),
    title: entry.title ?? '',
    content: entry.content ?? '',
  }))

  const changedThoughts = useChangedThoughts(topics, preOpinions, initialChangedThoughtOverrides)
  const othersPerspective = useOthersPerspective(initialOthersPerspectiveItems)
  const freeRecord = useFreeRecord(initialFreeRecordEntries)
  const { mutate: save, isPending: isSavePending } = useSavePersonalRetrospective()
  const { mutate: update, isPending: isUpdatePending } = useUpdatePersonalRetrospective()
  const [showErrors, setShowErrors] = useState(false)
  const [scrollTrigger, setScrollTrigger] = useState(0)
  // 사용자가 직접 토글한 섹션만 오버라이드로 관리, 나머지는 editFormData에서 파생
  const [visibilityOverrides, setVisibilityOverrides] = useState<
    Partial<Record<SectionKey, boolean>>
  >({})

  const sectionVisibility = {
    changedThoughts: visibilityOverrides.changedThoughts ?? true,
    othersPerspective:
      visibilityOverrides.othersPerspective ??
      (isEditMode ? (editFormData?.retrospective.othersPerspectives.length ?? 0) > 0 : false),
    freeRecord:
      visibilityOverrides.freeRecord ??
      (isEditMode ? (editFormData?.retrospective.freeTexts.length ?? 0) > 0 : false),
  }

  // editFormData는 비동기로 로드되므로, 도착 시점에 폼 상태를 재초기화
  useEffect(() => {
    if (!editFormData) return

    const {
      changedThoughts: cts,
      othersPerspectives: ops,
      freeTexts: fts,
    } = editFormData.retrospective

    changedThoughts.reinit(
      Object.fromEntries(
        cts.map(({ topicId, keyIssue, postOpinion }) => [
          topicId,
          { coreSummary: keyIssue ?? '', postOpinion: postOpinion ?? '' },
        ])
      )
    )
    othersPerspective.reinit(
      ops.map((item) => ({
        id: crypto.randomUUID(),
        speakerMemberId: item.meetingMemberId,
        topicId: item.topicId,
        opinion: item.opinionContent,
        impact: item.impressiveReason,
      }))
    )
    freeRecord.reinit(
      fts.map((entry) => ({
        id: crypto.randomUUID(),
        title: entry.title ?? '',
        content: entry.content ?? '',
      }))
    )
  }, [editFormData]) // eslint-disable-line react-hooks/exhaustive-deps

  const showSection = (section: SectionKey) => {
    setVisibilityOverrides((prev) => ({ ...prev, [section]: true }))
    if (section === 'othersPerspective' && othersPerspective.items.length === 0) {
      othersPerspective.addItem()
    }
    if (section === 'freeRecord' && freeRecord.entries.length === 0) {
      freeRecord.addEntry()
    }
  }

  const hideSection = (section: SectionKey) => {
    setVisibilityOverrides((prev) => ({ ...prev, [section]: false }))
    if (section === 'changedThoughts') changedThoughts.reset()
    if (section === 'othersPerspective') othersPerspective.reset()
    if (section === 'freeRecord') freeRecord.reset()
  }

  const submit = () => {
    if (isSavePending || isUpdatePending) return

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
            .filter(
              ({ coreSummary, postOpinion }) =>
                coreSummary.trim() !== '' || postOpinion.trim() !== ''
            )
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
                item.impact.trim() !== ''
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

    if (isEditMode) {
      update({ meetingId, body: requestBody }, { onSuccess, onError })
    } else {
      save({ meetingId, body: requestBody }, { onSuccess, onError })
    }
  }

  return {
    changedThoughts,
    othersPerspective,
    freeRecord,
    submit,
    isSubmitting: isSavePending || isUpdatePending,
    showErrors,
    scrollTrigger,
    sectionVisibility,
    showSection,
    hideSection,
  }
}

export type UsePersonalRetrospectiveFormReturn = ReturnType<typeof usePersonalRetrospectiveForm>
