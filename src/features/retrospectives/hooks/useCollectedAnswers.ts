/**
 * @file useCollectedAnswers.ts
 * @description 수집된 사전 의견 조회 훅 (무한 스크롤)
 */

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getCollectedAnswers } from '../retrospectives.api'
import type {
  CollectedAnswerCursor,
  GetCollectedAnswersParams,
  GetCollectedAnswersResponse,
} from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

/**
 * 수집된 사전 의견 조회 훅 (무한 스크롤)
 *
 * @description
 * TanStack Query의 useInfiniteQuery를 사용하여 약속의 수집된 사전 의견 목록을 무한 스크롤로 조회합니다.
 * 사용자별로 각 주제에 대한 답변을 확인할 수 있습니다.
 *
 * @param params - 조회 파라미터
 * @param params.meetingId - 약속 식별자
 * @param params.pageSize - 페이지 크기 (기본값: 10)
 *
 * @returns TanStack Query 무한 스크롤 결과 객체
 */
export const useCollectedAnswers = (params: Omit<GetCollectedAnswersParams, 'cursorUserId'>) => {
  const { meetingId, pageSize } = params
  const isValidParams = !Number.isNaN(meetingId) && meetingId > 0

  return useInfiniteQuery<
    GetCollectedAnswersResponse,
    ApiError,
    InfiniteData<GetCollectedAnswersResponse>,
    ReturnType<typeof retrospectiveQueryKeys.collectedAnswersList>,
    CollectedAnswerCursor | null
  >({
    queryKey: retrospectiveQueryKeys.collectedAnswersList({ meetingId, pageSize }),
    queryFn: ({ pageParam }: { pageParam: CollectedAnswerCursor | null }) =>
      getCollectedAnswers({
        meetingId,
        pageSize,
        // 첫 페이지: 커서 없이 요청 (pageParam = null), 다음 페이지: nextCursor 사용
        cursorUserId: pageParam?.userId,
      }),
    // meetingId가 유효할 때만 쿼리 실행
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
