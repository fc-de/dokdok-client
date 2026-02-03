/**
 * @file useDeleteBookRecord.ts
 * @description 감상 기록 삭제 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteBookRecord } from '../book.api'
import { bookRecordsKeys } from './useBookRecords'

/**
 * 감상 기록을 삭제하는 뮤테이션 훅
 *
 * @param personalBookId - 개인 책 ID
 * @param recordId - 기록 ID
 *
 * @example
 * ```tsx
 * const { mutate } = useDeleteBookRecord(bookId, recordId)
 * mutate()
 * ```
 */
export function useDeleteBookRecord(personalBookId: number, recordId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteBookRecord(personalBookId, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookRecordsKeys.all })
    },
  })
}
