/**
 * @file preOpinionQueryKeys.ts
 * @description 사전 의견 관련 Query Key Factory
 */

import type { GetPreOpinionParams } from '@/features/pre-opinion/preOpinion.types'

export const preOpinionQueryKeys = {
  all: ['preOpinions'] as const,

  details: () => [...preOpinionQueryKeys.all, 'detail'] as const,
  detail: (params: GetPreOpinionParams) => [...preOpinionQueryKeys.details(), params] as const,
}
