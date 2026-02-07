/**
 * @file topicQueryKeys.ts
 * @description 주제 관련 Query Key Factory
 */

import type { GetConfirmedTopicsParams, GetProposedTopicsParams } from '../topics.types'

/**
 * Query Key Factory
 *
 * @description
 * 주제 관련 Query Key를 일관되게 관리하기 위한 팩토리 함수
 */
export const topicQueryKeys = {
  all: ['topics'] as const,

  // 제안된 주제 관련
  proposed: () => [...topicQueryKeys.all, 'proposed'] as const,
  proposedLists: () => [...topicQueryKeys.proposed(), 'list'] as const,
  proposedList: (params: GetProposedTopicsParams) =>
    [...topicQueryKeys.proposedLists(), params] as const,

  // 확정된 주제 관련
  confirmed: () => [...topicQueryKeys.all, 'confirmed'] as const,
  confirmedLists: () => [...topicQueryKeys.confirmed(), 'list'] as const,
  confirmedList: (params: GetConfirmedTopicsParams) =>
    [...topicQueryKeys.confirmedLists(), params] as const,
}
