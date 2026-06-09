/**
 * @file useBookRecords.ts
 * @description 기록 타임라인 조회 훅 (무한스크롤 지원)
 */

import { useInfiniteQuery } from '@tanstack/react-query'

import { getBookTimeline } from '../book.api'
import type { GetBookTimelineParams, GetBookTimelineResponse } from '../book.types'

/** 감상 기록 쿼리 키 팩토리 */
export const bookRecordsKeys = {
  all: ['bookRecords'] as const,
  list: (
    personalBookId: number,
    params: Omit<GetBookTimelineParams, 'cursorEventAt' | 'cursorSourceId'>
  ) => [...bookRecordsKeys.all, personalBookId, params] as const,
}

/**
 * 기록 타임라인을 무한스크롤로 조회하는 훅
 *
 * @param personalBookId - 개인 책 ID
 * @param params - 필터 및 정렬 파라미터
 *
 * @example
 * ```tsx
 * function BookLogList({ bookId }: { bookId: number }) {
 *   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
 *     useBookRecords(bookId, { sort: 'DESC' })
 *
 *   const records = data?.pages.flatMap(page => page.items) ?? []
 *
 *   return <div>{records.length}개의 기록</div>
 * }
 * ```
 */
export function useBookRecords(
  personalBookId: number,
  params: Omit<GetBookTimelineParams, 'cursorEventAt' | 'cursorSourceId'> = {}
) {
  return useInfiniteQuery({
    queryKey: bookRecordsKeys.list(personalBookId, params),
    queryFn: ({ pageParam }) =>
      getBookTimeline(personalBookId, {
        ...params,
        cursorEventAt: pageParam?.eventAt,
        cursorSourceId: pageParam?.sourceId,
      }),
    initialPageParam: undefined as GetBookTimelineResponse['nextCursor'] | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled: personalBookId > 0,
  })
}
