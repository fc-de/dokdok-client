/**
 * @file useFreeRecord.ts
 * @description 자유 기록 섹션 폼 상태 관리 훅
 */

import { useCallback, useState } from 'react'

import type { FreeRecordEntryFormItem } from '../personalRetrospective.types'

function createEntry(): FreeRecordEntryFormItem {
  return { id: crypto.randomUUID(), title: '', content: '' }
}

/**
 * 자유 기록 섹션 폼 상태 훅
 *
 * @description
 * 제목+상세내용 항목의 동적 추가/삭제/수정을 관리합니다.
 *
 * @example
 * ```tsx
 * const { entries, addEntry, removeEntry, updateEntry } = useFreeRecord()
 * ```
 */
export function useFreeRecord() {
  const [entries, setEntries] = useState<FreeRecordEntryFormItem[]>([createEntry()])

  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, createEntry()])
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const updateEntry = useCallback((id: string, field: 'title' | 'content', value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }, [])

  const isEntryPartial = useCallback(
    (id: string) => {
      const entry = entries.find((e) => e.id === id)
      if (!entry) return false
      const hasTitle = entry.title.trim() !== ''
      const hasContent = entry.content.trim() !== ''
      return hasTitle !== hasContent
    },
    [entries],
  )

  const hasPartialInput = entries.some((e) => (e.title.trim() !== '') !== (e.content.trim() !== ''))

  const reset = useCallback(() => {
    setEntries([createEntry()])
  }, [])

  return { entries, addEntry, removeEntry, updateEntry, isEntryPartial, hasPartialInput, reset }
}

export type UseFreeRecordReturn = ReturnType<typeof useFreeRecord>
