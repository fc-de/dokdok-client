import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { PAGE_SIZES } from '@/shared/constants'

import { getGatheringMembers } from '../gatherings.api'
import type { GatheringMemberListResponse, MemberStatusFilter } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/** 페이지 파라미터 타입: undefined = 첫 페이지, number = 다음 커서 ID */
type PageParam = number | undefined

/**
 * 모임 멤버 목록 조회 훅 (커서 기반 무한 스크롤)
 *
 * @param gatheringId - 모임 ID
 * @param status - 멤버 상태 필터 (PENDING | ACTIVE)
 */
export const useGatheringMembers = (gatheringId: number, status: MemberStatusFilter) => {
  return useInfiniteQuery<
    GatheringMemberListResponse,
    Error,
    InfiniteData<GatheringMemberListResponse, PageParam>,
    readonly (string | number)[],
    PageParam
  >({
    queryKey: gatheringQueryKeys.membersByStatus(gatheringId, status),
    queryFn: async ({ pageParam }: { pageParam: PageParam }) => {
      const response = await getGatheringMembers({
        gatheringId,
        status,
        pageSize: PAGE_SIZES.GATHERING_MEMBERS,
        cursorId: pageParam,
      })
      return response.data
    },
    initialPageParam: undefined as PageParam,
    getNextPageParam: (lastPage: GatheringMemberListResponse): PageParam => {
      if (!lastPage.hasNext || !lastPage.nextCursor) return undefined
      return lastPage.nextCursor.gatheringMemberId
    },
    enabled: gatheringId > 0,
  })
}
