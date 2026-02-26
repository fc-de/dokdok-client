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

function isPartialItem(item: OthersPerspectiveFormItem): boolean {
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
}

/**
 * 타인의 관점 섹션 폼 상태 훅
 *
 * @description
 * 관점 항목 동적 추가/삭제/수정을 관리합니다.
 * 수정 모드에서는 initialItems를 통해 기존 저장값으로 초기화할 수 있습니다.
 *
 * @example
 * ```tsx
 * const { items, addItem, removeItem, updateItem } = useOthersPerspective()
 * ```
 */
export function useOthersPerspective(initialItems?: OthersPerspectiveFormItem[]) {
  const [items, setItems] = useState<OthersPerspectiveFormItem[]>(initialItems ?? [])

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, createItem()])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateItem = useCallback(
    (
      id: string,
      field: keyof Omit<OthersPerspectiveFormItem, 'id'>,
      value: string | number | null
    ) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    },
    []
  )

  const isItemPartial = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id)
      if (!item) return false
      return isPartialItem(item)
    },
    [items]
  )

  const hasPartialInput = items.some(isPartialItem)

  const reset = useCallback(() => {
    setItems([])
  }, [])

  const reinit = useCallback((items: OthersPerspectiveFormItem[]) => {
    setItems(items)
  }, [])

  return { items, addItem, removeItem, updateItem, isItemPartial, hasPartialInput, reset, reinit }
}

export type UseOthersPerspectiveReturn = ReturnType<typeof useOthersPerspective>
