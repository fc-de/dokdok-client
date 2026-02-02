/**
 * @file useCreateBookRecord.ts
 * @description 감상 기록 생성 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createBookRecord } from '../book.api'
import type { CreateBookRecordBody } from '../book.types'
import { bookRecordsKeys } from './useBookRecords'

/**
 * 감상 기록을 생성하는 뮤테이션 훅
 *
 * @param personalBookId - 개인 책 ID
 *
 * @example
 * ```tsx
 * const { mutate } = useCreateBookRecord(bookId)
 * mutate({ recordType: 'MEMO', recordContent: '내용' })
 * ```
 */
export function useCreateBookRecord(personalBookId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBookRecordBody) => createBookRecord(personalBookId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookRecordsKeys.all })
    },
  })
}
