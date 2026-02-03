/**
 * @file useUpdateBookRecord.ts
 * @description 감상 기록 수정 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateBookRecord } from '../book.api'
import type { UpdateBookRecordBody } from '../book.types'
import { bookRecordsKeys } from './useBookRecords'

/**
 * 감상 기록을 수정하는 뮤테이션 훅
 *
 * @param personalBookId - 개인 책 ID
 * @param recordId - 기록 ID
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateBookRecord(bookId, recordId)
 * mutate({ recordType: 'MEMO', recordContent: '수정된 내용' })
 * ```
 */
export function useUpdateBookRecord(personalBookId: number, recordId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateBookRecordBody) => updateBookRecord(personalBookId, recordId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookRecordsKeys.all })
    },
  })
}
