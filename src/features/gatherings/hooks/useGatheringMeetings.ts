import { useQuery } from '@tanstack/react-query'

import { PAGE_SIZES } from '@/shared/constants'

import { getGatheringMeetings } from '../gatherings.api'
import type { MeetingFilter } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

interface UseGatheringMeetingsOptions {
  gatheringId: number
  filter?: MeetingFilter
  page?: number
  size?: number
}

/**
 * 모임 약속 목록 조회 훅 (서버 페이지네이션)
 *
 * @param options - 조회 옵션
 * @param options.gatheringId - 모임 ID
 * @param options.filter - 필터 (기본: ALL)
 * @param options.page - 페이지 번호 (0부터 시작, 기본: 0)
 * @param options.size - 페이지 크기
 * @returns 약속 목록 쿼리 결과
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGatheringMeetings({
 *   gatheringId: 1,
 *   filter: 'UPCOMING',
 *   page: 0,
 *   size: 5,
 * })
 *
 * const meetings = data?.items ?? []
 * const totalPages = data?.totalPages ?? 0
 * ```
 */
export const useGatheringMeetings = ({
  gatheringId,
  filter = 'ALL',
  page = 0,
  size = PAGE_SIZES.GATHERING_MEETINGS,
}: UseGatheringMeetingsOptions) => {
  return useQuery({
    queryKey: [...gatheringQueryKeys.meetingsByFilter(gatheringId, filter), page, size],
    queryFn: async () => {
      const response = await getGatheringMeetings({
        gatheringId,
        filter,
        page,
        size,
      })
      return response.data
    },
    enabled: gatheringId > 0,
  })
}
