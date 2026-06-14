/**
 * @file useBookGatherings.ts
 * @description 책에 연결된 모임 목록 조회 훅
 */

import { useQuery } from '@tanstack/react-query'

import { getBookGatherings } from '../book.api'

/** 책에 연결된 모임 목록 쿼리 키 팩토리 */
export const bookGatheringsKeys = {
  all: ['bookGatherings'] as const,
  list: (personalBookId: number) => [...bookGatheringsKeys.all, personalBookId] as const,
}

/**
 * 책에 연결된 모임 목록을 조회하는 훅
 *
 * @param personalBookId - 개인 책 ID
 *
 * @example
 * ```tsx
 * function GatheringFilter({ personalBookId }: { personalBookId: number }) {
 *   const { data: gatherings = [] } = useBookGatherings(personalBookId)
 *
 *   return (
 *     <div>
 *       {gatherings.map((g) => (
 *         <div key={g.gatheringId}>{g.gatheringName}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useBookGatherings(personalBookId: number) {
  return useQuery({
    queryKey: bookGatheringsKeys.list(personalBookId),
    queryFn: () => getBookGatherings(personalBookId),
    enabled: personalBookId > 0,
  })
}
