/**
 * @file useCreateRetrospectiveComment.ts
 * @description 약속회고 댓글 작성 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/errors'

import { createComment } from '../retrospectives.api'
import type { CreateCommentParams, CreateCommentResponse } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

/**
 * 약속회고 댓글 작성 훅
 *
 * @description
 * TanStack Query의 useMutation을 사용하여 약속회고에 댓글을 작성합니다.
 * 작성 성공 시 댓글 목록을 invalidate하여 최신 데이터를 가져옵니다.
 *
 * @returns TanStack Query mutation 객체
 */
export const useCreateRetrospectiveComment = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateCommentResponse, ApiError, CreateCommentParams>({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      // 댓글 목록 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: retrospectiveQueryKeys.commentsList({ meetingId: variables.meetingId }),
      })
    },
  })
}
