import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { toggleFavorite } from '../gatherings.api'
import type {
  FavoriteGatheringListResponse,
  GatheringDetailResponse,
  GatheringListResponse,
} from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 모임 즐겨찾기 토글 훅
 *
 * - Optimistic update 적용
 * - 실패 시 롤백
 */
interface ToggleFavoriteContext {
  previousLists: unknown
  previousFavorites: unknown
  previousDetail: unknown
}

export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, number, ToggleFavoriteContext>({
    mutationFn: async (gatheringId: number) => {
      await toggleFavorite(gatheringId)
    },
    onMutate: async (gatheringId) => {
      // 진행 중인 쿼리 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: gatheringQueryKeys.lists() }),
        queryClient.cancelQueries({ queryKey: gatheringQueryKeys.favorites() }),
        queryClient.cancelQueries({ queryKey: gatheringQueryKeys.detail(gatheringId) }),
      ])

      // 이전 데이터 스냅샷
      const previousLists = queryClient.getQueryData(gatheringQueryKeys.lists())
      const previousFavorites = queryClient.getQueryData(gatheringQueryKeys.favorites())
      const previousDetail = queryClient.getQueryData(gatheringQueryKeys.detail(gatheringId))

      // Optimistic update - 목록에서 isFavorite 토글
      queryClient.setQueryData<InfiniteData<GatheringListResponse>>(
        gatheringQueryKeys.lists(),
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.gatheringId === gatheringId ? { ...item, isFavorite: !item.isFavorite } : item
              ),
            })),
          }
        }
      )

      // Optimistic update - 즐겨찾기 목록
      queryClient.setQueryData<FavoriteGatheringListResponse>(
        gatheringQueryKeys.favorites(),
        (old) => {
          if (!old) return old
          const existing = old.gatherings.find((g) => g.gatheringId === gatheringId)
          if (existing) {
            // 즐겨찾기에서 제거
            return {
              ...old,
              gatherings: old.gatherings.filter((g) => g.gatheringId !== gatheringId),
            }
          }
          return old
        }
      )

      // Optimistic update - 상세 페이지
      queryClient.setQueryData<GatheringDetailResponse>(
        gatheringQueryKeys.detail(gatheringId),
        (old) => {
          if (!old) return old
          return { ...old, isFavorite: !old.isFavorite }
        }
      )

      return { previousLists, previousFavorites, previousDetail }
    },
    onError: (error, gatheringId, context) => {
      console.error('Failed to toggle favorite:', { error, gatheringId })
      // 에러 시 롤백
      if (context?.previousLists) {
        queryClient.setQueryData(gatheringQueryKeys.lists(), context.previousLists)
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(gatheringQueryKeys.favorites(), context.previousFavorites)
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(gatheringQueryKeys.detail(gatheringId), context.previousDetail)
      }
    },
    onSettled: (_data, _error, gatheringId) => {
      // 즐겨찾기 목록만 최신 데이터로 갱신 (전체 목록은 optimistic update로 충분)
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.favorites() })
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.detail(gatheringId) })
    },
  })
}
