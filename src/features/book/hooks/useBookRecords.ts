/**
 * @file useBookRecords.ts
 * @description 책 감상 기록 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import { getBookRecords } from '../book.api'
import type { GetBookRecordsParams } from '../book.types'

/** 감상 기록 쿼리 키 팩토리 */
export const bookRecordsKeys = {
  all: ['bookRecords'] as const,
  list: (personalBookId: number, params: GetBookRecordsParams) =>
    [...bookRecordsKeys.all, personalBookId, params] as const,
}

/**
 * 책 감상 기록을 조회하는 훅
 *
 * @param personalBookId - 개인 책 ID
 * @param params - 필터 및 정렬 파라미터
 *
 * @example
 * ```tsx
 * function BookLogList({ bookId }: { bookId: number }) {
 *   const { data, isLoading } = useBookRecords(bookId, {
 *     sort: 'LATEST',
 *     recordType: 'MEMO',
 *   })
 *
 *   if (isLoading) return <div>로딩 중...</div>
 *
 *   return <div>{data.personalRecords.length}개의 기록</div>
 * }
 * ```
 */
export function useBookRecords(personalBookId: number, params: GetBookRecordsParams = {}) {
  return useQuery({
    queryKey: bookRecordsKeys.list(personalBookId, params),
    queryFn: () => getBookRecords(personalBookId, params),
    enabled: personalBookId > 0,
  })
}
