/**
 * @file useConfirmedTopics.ts
 * @description 확정된 주제 조회 훅 (무한 스크롤)
 */

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getConfirmedTopics } from '../topics.api'
import type {
  ConfirmedTopicCursor,
  GetConfirmedTopicsParams,
  GetConfirmedTopicsResponse,
} from '../topics.types'

/**
 * 확정된 주제 조회 훅 (무한 스크롤)
 *
 * @description
 * TanStack Query의 useInfiniteQuery를 사용하여 약속의 확정된 주제 목록을 무한 스크롤로 조회합니다.
 * 확정 순서 기준 오름차순으로 정렬되며, 커서 기반 페이지네이션을 지원합니다.
 *
 * @param params - 조회 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 * @param params.pageSize - 페이지 크기 (기본값: 5)
 *
 * @returns TanStack Query 무한 스크롤 결과 객체
 */
export const useConfirmedTopics = (
  params: Omit<GetConfirmedTopicsParams, 'cursorConfirmOrder' | 'cursorTopicId'>
) => {
  const { gatheringId, meetingId, pageSize } = params
  const isValidParams =
    !Number.isNaN(gatheringId) && gatheringId > 0 && !Number.isNaN(meetingId) && meetingId > 0

  return useInfiniteQuery<
    GetConfirmedTopicsResponse,
    ApiError,
    InfiniteData<GetConfirmedTopicsResponse>,
    readonly [
      'topics',
      'confirmed',
      'list',
      { gatheringId: number; meetingId: number; pageSize?: number },
    ],
    ConfirmedTopicCursor | null
  >({
    queryKey: ['topics', 'confirmed', 'list', { gatheringId, meetingId, pageSize }] as const,
    queryFn: ({ pageParam }: { pageParam: ConfirmedTopicCursor | null }) =>
      getConfirmedTopics({
        gatheringId,
        meetingId,
        pageSize,
        // 첫 페이지: 커서 없이 요청 (pageParam = null), 다음 페이지: nextCursor 사용
        cursorConfirmOrder: pageParam?.confirmOrder,
        cursorTopicId: pageParam?.topicId,
      }),
    // gatheringId와 meetingId가 유효할 때만 쿼리 실행
    enabled: isValidParams,
    // 초기 페이지 파라미터 (첫 페이지는 커서 파라미터 없이 요청)
    initialPageParam: null,
    // 다음 페이지 파라미터 가져오기
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : null
    },
    // 캐시 데이터 10분간 유지
    gcTime: 10 * 60 * 1000,
  })
}
