/**
 * @file preOpinionQueryKeys.ts
 * @description 사전 의견 관련 Query Key Factory
 */

export const preOpinionQueryKeys = {
  all: ['preOpinions'] as const,

  details: () => [...preOpinionQueryKeys.all, 'detail'] as const,
  detail: (meetingId: number) => [...preOpinionQueryKeys.details(), meetingId] as const,
}
