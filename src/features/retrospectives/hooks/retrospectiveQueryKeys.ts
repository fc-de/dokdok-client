/**
 * @file retrospectiveQueryKeys.ts
 * @description 회고 관련 Query Key Factory
 */

import type { GetCollectedAnswersParams } from '../retrospectives.types'

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
}
