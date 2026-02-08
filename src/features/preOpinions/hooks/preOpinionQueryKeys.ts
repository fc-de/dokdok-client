/**
 * @file preOpinionQueryKeys.ts
 * @description 사전 의견 관련 Query Key Factory
 */

import type { GetPreOpinionAnswersParams } from '../preOpinions.types'

/**
 * Query Key Factory
 *
 * @description
 * 사전 의견 관련 Query Key를 일관되게 관리하기 위한 팩토리 함수
 */
export const preOpinionQueryKeys = {
  all: ['preOpinions'] as const,

  // 사전 의견 목록 관련
  answers: () => [...preOpinionQueryKeys.all, 'answers'] as const,
  answerList: (params: GetPreOpinionAnswersParams) =>
    [...preOpinionQueryKeys.answers(), params] as const,
}
