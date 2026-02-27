/**
 * @file preOpinionQueryKeys.ts
 * @description 사전 의견 관련 Query Key Factory
 */

import type {
  GetPreOpinionAnswersParams,
  GetPreOpinionParams,
} from '@/features/pre-opinion/preOpinion.types'

/**
 * Query Key Factory
 *
 * @description
 * 사전 의견 관련 Query Key를 일관되게 관리하기 위한 팩토리 함수
 */
export const preOpinionQueryKeys = {
  all: ['preOpinions'] as const,

  // 내 사전 의견 작성/조회 관련
  details: () => [...preOpinionQueryKeys.all, 'detail'] as const,
  detail: (params: GetPreOpinionParams) => [...preOpinionQueryKeys.details(), params] as const,

  // 사전 의견 목록 관련
  answers: () => [...preOpinionQueryKeys.all, 'answers'] as const,
  answerList: (params: GetPreOpinionAnswersParams) =>
    [...preOpinionQueryKeys.answers(), params] as const,
}
