/**
 * @file retrospectiveQueryKeys.ts
 * @description 회고 관련 Query Key Factory
 */

import type { GetCollectedAnswersParams, GetCommentsParams } from '../retrospectives.types'

/**
 * Query Key Factory
 *
 * @description
 * 회고 관련 Query Key를 일관되게 관리하기 위한 팩토리 함수
 */
export const retrospectiveQueryKeys = {
  all: ['retrospectives'] as const,

  // 수집된 사전 의견 리스트
  collectedAnswersList: (params: Omit<GetCollectedAnswersParams, 'cursorUserId'>) =>
    [...retrospectiveQueryKeys.all, 'collectedAnswers', params] as const,

  // 회고 요약
  summaries: () => [...retrospectiveQueryKeys.all, 'summary'] as const,
  summary: (meetingId: number) => [...retrospectiveQueryKeys.summaries(), meetingId] as const,

  // 약속회고 상세
  details: () => [...retrospectiveQueryKeys.all, 'detail'] as const,
  detail: (meetingId: number) => [...retrospectiveQueryKeys.details(), meetingId] as const,

  // 댓글
  commentsList: (params: Omit<GetCommentsParams, 'cursorCreatedAt' | 'cursorCommentId'>) =>
    [...retrospectiveQueryKeys.all, 'comments', params] as const,
}
