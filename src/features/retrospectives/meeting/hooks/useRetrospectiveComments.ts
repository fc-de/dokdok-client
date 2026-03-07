/**
 * @file useRetrospectiveComments.ts
 * @description 약속회고 댓글 조회 훅 (무한 스크롤)
 */

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'
import { PAGE_SIZES } from '@/shared/constants/pagination'

import { getComments } from '../retrospectives.api'
import type { CommentCursor, GetCommentsParams, GetCommentsResponse } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

/**
 * 약속회고 댓글 조회 훅 (무한 스크롤)
 *
 * @description
 * TanStack Query의 useInfiniteQuery를 사용하여 약속회고의 댓글 목록을 무한 스크롤로 조회합니다.
 *
 * @param params - 조회 파라미터
 * @param params.meetingId - 약속 식별자
 * @param params.pageSize - 페이지 크기 (기본값: 10)
 *
 * @returns TanStack Query 무한 스크롤 결과 객체
 */
export const useRetrospectiveComments = (
  params: Omit<GetCommentsParams, 'cursorCreatedAt' | 'cursorCommentId'>
) => {
  const { meetingId, pageSize = PAGE_SIZES.RETROSPECTIVE_COMMENTS } = params

  return useInfiniteQuery<
    GetCommentsResponse,
    ApiError,
    InfiniteData<GetCommentsResponse>,
    ReturnType<typeof retrospectiveQueryKeys.commentsList>,
    CommentCursor | null
  >({
    queryKey: retrospectiveQueryKeys.commentsList({ meetingId, pageSize }),
    queryFn: ({ pageParam }: { pageParam: CommentCursor | null }) =>
      getComments({
        meetingId,
        pageSize,
        // 첫 페이지: 커서 없이 요청 (pageParam = null), 다음 페이지: nextCursor 사용
        cursorCreatedAt: pageParam?.createdAt,
        cursorCommentId: pageParam?.commentId,
      }),
    // meetingId가 유효할 때만 쿼리 실행
    enabled: meetingId > 0,
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
