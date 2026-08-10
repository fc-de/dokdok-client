/**
 * @file useChangedThoughts.ts
 * @description 바뀐 나의 생각 섹션 폼 상태 관리 훅
 */

import { useCallback, useState } from 'react'

import type {
  ChangedThoughtFormItem,
  PersonalRetrospectivePreOpinion,
  PersonalRetrospectiveTopic,
} from '../personalRetrospective.types'

type ChangedThoughtOverrides = Record<string, { coreSummary?: string; postOpinion?: string }>

/**
 * 바뀐 나의 생각 섹션 폼 상태 훅
 *
 * @description
 * 토픽별로 핵심 쟁점 요약(coreSummary)과 모임 후 내 의견(postOpinion)을 관리합니다.
 * 핵심 쟁점 요약은 항상 필수이며, 모임 후 내 의견은 선택 입력입니다.
 * 사용자가 변경한 값만 저장하고, 나머지는 빈 문자열을 기본값으로 사용합니다.
 * 수정 모드에서는 initialOverrides를 통해 기존 저장값으로 초기화할 수 있습니다.
 *
 * @example
 * ```tsx
 * const form = useChangedThoughts(topics, preOpinions)
 * form.updateField(topicId, 'coreSummary', '핵심은...')
 * ```
 */
export function useChangedThoughts(
  topics: PersonalRetrospectiveTopic[],
  preOpinions: PersonalRetrospectivePreOpinion[],
  initialOverrides?: ChangedThoughtOverrides
) {
  const [overrides, setOverrides] = useState<ChangedThoughtOverrides>(initialOverrides ?? {})

  const updateField = useCallback(
    (topicId: number, field: 'coreSummary' | 'postOpinion', value: string) => {
      setOverrides((prev) => ({
        ...prev,
        [topicId]: { ...prev[topicId], [field]: value },
      }))
    },
    []
  )

  const getPreOpinion = useCallback(
    (topicId: number) => preOpinions.find((p) => p.topicId === topicId)?.content ?? '',
    [preOpinions]
  )

  const formValues: ChangedThoughtFormItem[] = topics.map((t) => ({
    topicId: t.topicId,
    coreSummary: overrides[t.topicId]?.coreSummary ?? '',
    postOpinion: overrides[t.topicId]?.postOpinion ?? '',
  }))

  // 핵심 쟁점 요약(coreSummary)은 항상 필수입니다.
  const isItemPartial = useCallback(
    (topicId: number) => {
      const item = formValues.find((f) => f.topicId === topicId)
      if (!item) return false
      return item.coreSummary.trim() === ''
    },
    [formValues]
  )

  const hasPartialInput = formValues.some((item) => item.coreSummary.trim() === '')

  const reset = useCallback(() => {
    setOverrides({})
  }, [])

  const reinit = useCallback((overrides: ChangedThoughtOverrides) => {
    setOverrides(overrides)
  }, [])

  return { formValues, updateField, getPreOpinion, isItemPartial, hasPartialInput, reset, reinit }
}

export type UseChangedThoughtsReturn = ReturnType<typeof useChangedThoughts>
