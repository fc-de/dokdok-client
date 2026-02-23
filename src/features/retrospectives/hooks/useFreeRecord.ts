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

  return { entries, addEntry, removeEntry, updateEntry }
}

export type UseFreeRecordReturn = ReturnType<typeof useFreeRecord>
