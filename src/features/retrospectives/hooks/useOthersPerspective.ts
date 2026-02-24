/**
 * @file useOthersPerspective.ts
 * @description 타인의 관점 섹션 폼 상태 관리 훅
 */

import { useCallback, useState } from 'react'

import type { OthersPerspectiveFormItem } from '../personalRetrospective.types'

function createItem(): OthersPerspectiveFormItem {
  return {
    id: crypto.randomUUID(),
    speakerMemberId: null,
    topicId: null,
    opinion: '',
    impact: '',
  }
}

/**
 * 타인의 관점 섹션 폼 상태 훅
 *
 * @description
 * 관점 항목 동적 추가/삭제/수정을 관리합니다.
 * 초기값으로 빈 항목 하나가 생성됩니다.
 *
 * @example
 * ```tsx
 * const { items, addItem, removeItem, updateItem } = useOthersPerspective()
 * ```
 */
export function useOthersPerspective() {
  const [items, setItems] = useState<OthersPerspectiveFormItem[]>([])

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, createItem()])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateItem = useCallback(
    (id: string, field: keyof Omit<OthersPerspectiveFormItem, 'id'>, value: string | number | null) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    },
    [],
  )

  const isItemPartial = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id)
      if (!item) return false
      const hasAny =
        item.speakerMemberId !== null ||
        item.topicId !== null ||
        item.opinion.trim() !== '' ||
        item.impact.trim() !== ''
      const hasAll =
        item.speakerMemberId !== null &&
        item.topicId !== null &&
        item.opinion.trim() !== '' &&
        item.impact.trim() !== ''
      return hasAny && !hasAll
    },
    [items],
  )

  const hasPartialInput = items.some((item) => {
    const hasAny =
      item.speakerMemberId !== null ||
      item.topicId !== null ||
      item.opinion.trim() !== '' ||
      item.impact.trim() !== ''
    const hasAll =
      item.speakerMemberId !== null &&
      item.topicId !== null &&
      item.opinion.trim() !== '' &&
      item.impact.trim() !== ''
    return hasAny && !hasAll
  })

  const reset = useCallback(() => {
    setItems([])
  }, [])

  return { items, addItem, removeItem, updateItem, isItemPartial, hasPartialInput, reset }
}

export type UseOthersPerspectiveReturn = ReturnType<typeof useOthersPerspective>
