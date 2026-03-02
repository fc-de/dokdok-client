/**
 * @file useDeleteRetrospectiveComment.ts
 * @description 약속회고 댓글 삭제 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

import { deleteComment } from '../retrospectives.api'
import type { DeleteCommentParams } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

/**
 * 약속회고 댓글 삭제 훅
 *
 * @description
 * TanStack Query의 useMutation을 사용하여 약속회고의 댓글을 삭제합니다.
 * 삭제 성공 시 댓글 목록을 invalidate하여 최신 데이터를 가져옵니다.
 *
 * @returns TanStack Query mutation 객체
 */
export const useDeleteRetrospectiveComment = () => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, DeleteCommentParams>({
    mutationFn: deleteComment,
    onSuccess: (_, variables) => {
      // 댓글 목록 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: retrospectiveQueryKeys.commentsList({ meetingId: variables.meetingId }),
      })
    },
  })
}
