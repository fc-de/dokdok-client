/**
 * @file useLikeTopic.ts
 * @description 주제 좋아요 토글 mutation 훅 (낙관적 업데이트)
 */

import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

import { likeTopicToggle } from '../topics.api'
import type { GetProposedTopicsResponse, LikeTopicParams, LikeTopicResponse } from '../topics.types'
import { topicQueryKeys } from './topicQueryKeys'

/**
 * 주제 좋아요 토글 mutation 훅 (낙관적 업데이트)
 *
 * @description
 * 주제 좋아요를 토글하고 낙관적 업데이트를 적용합니다.
 * - onMutate: 즉시 UI 업데이트 (isLiked 토글, likeCount 증감)
 * - onError: 실패 시 이전 상태로 롤백
 * - onSettled: 서버 데이터와 동기화
 *
 * @example
 * ```tsx
 * const likeMutation = useLikeTopic()
 * likeMutation.mutate({
 *   gatheringId: 1,
 *   meetingId: 2,
 *   topicId: 3,
 * })
 * ```
 */

type LikeTopicContext = {
  previousQueries: Array<{
    queryKey: readonly unknown[]
    data: InfiniteData<GetProposedTopicsResponse>
  }>
}

export const useLikeTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<LikeTopicResponse, ApiError, LikeTopicParams, LikeTopicContext>({
    mutationFn: (params: LikeTopicParams) => likeTopicToggle(params),

    // 낙관적 업데이트: 즉시 UI 업데이트
    onMutate: async (variables) => {
      const { topicId } = variables

      // Partial matching을 위한 base 쿼리 키 (pageSize와 무관하게 모든 쿼리 매칭)
      const baseQueryKey = topicQueryKeys.proposedLists()

      // 진행 중인 모든 관련 쿼리 취소 (낙관적 업데이트 덮어쓰기 방지)
      await queryClient.cancelQueries({ queryKey: baseQueryKey })

      // 모든 매칭되는 쿼리의 이전 데이터 스냅샷 저장
      const previousQueries = queryClient
        .getQueriesData<InfiniteData<GetProposedTopicsResponse>>({ queryKey: baseQueryKey })
        .map(([queryKey, data]) => ({ queryKey, data: data! }))
        .filter((query) => query.data !== undefined)

      // 모든 관련 캐시에 낙관적 업데이트 적용
      previousQueries.forEach(({ queryKey }) => {
        queryClient.setQueryData<InfiniteData<GetProposedTopicsResponse>>(queryKey, (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((topic) => {
                if (topic.topicId === topicId) {
                  const newIsLiked = !topic.isLiked
                  return {
                    ...topic,
                    isLiked: newIsLiked,
                    likeCount: newIsLiked ? topic.likeCount + 1 : topic.likeCount - 1,
                  }
                }
                return topic
              }),
            })),
          }
        })
      })

      // 롤백을 위한 이전 데이터 반환
      return { previousQueries }
    },

    // 에러 발생 시 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousQueries) {
        // 저장된 모든 쿼리를 이전 상태로 복원
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    // 성공/실패 여부와 상관없이 서버 데이터와 동기화
    onSettled: () => {
      // 모든 제안된 주제 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: topicQueryKeys.proposedLists(),
      })
    },
  })
}
