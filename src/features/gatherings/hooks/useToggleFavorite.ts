import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { toggleFavorite } from '../gatherings.api'
import type { FavoriteGatheringListResponse, GatheringListResponse } from '../gatherings.types'
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
}

export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, number, ToggleFavoriteContext>({
    mutationFn: async (gatheringId: number) => {
      await toggleFavorite(gatheringId)
    },
    onMutate: async (gatheringId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: gatheringQueryKeys.lists() })
      await queryClient.cancelQueries({ queryKey: gatheringQueryKeys.favorites() })

      // 이전 데이터 스냅샷
      const previousLists = queryClient.getQueryData(gatheringQueryKeys.lists())
      const previousFavorites = queryClient.getQueryData(gatheringQueryKeys.favorites())

      // Optimistic update - 목록에서 isFavorite 토글
      queryClient.setQueryData<{ pages: GatheringListResponse[]; pageParams: unknown[] }>(
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

      return { previousLists, previousFavorites }
    },
    onError: (error, id, context) => {
      console.error('Failed to toggle favorite:', { error, gatheringId: id })
      // 에러 시 롤백
      if (context?.previousLists) {
        queryClient.setQueryData(gatheringQueryKeys.lists(), context.previousLists)
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(gatheringQueryKeys.favorites(), context.previousFavorites)
      }
    },
    onSettled: () => {
      // 즐겨찾기 목록만 최신 데이터로 갱신 (전체 목록은 optimistic update로 충분)
      queryClient.invalidateQueries({ queryKey: gatheringQueryKeys.favorites() })
    },
  })
}
