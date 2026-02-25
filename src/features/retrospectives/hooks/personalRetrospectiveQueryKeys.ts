/**
 * @file personalRetrospectiveQueryKeys.ts
 * @description 개인 회고 관련 Query Key Factory
 */

import type { GetPersonalRetrospectiveParams } from '../personalRetrospective.types'

export const personalRetrospectiveQueryKeys = {
  all: ['personalRetrospectives'] as const,

  details: () => [...personalRetrospectiveQueryKeys.all, 'detail'] as const,
  detail: (params: GetPersonalRetrospectiveParams) =>
    [...personalRetrospectiveQueryKeys.details(), params] as const,

  views: () => [...personalRetrospectiveQueryKeys.all, 'view'] as const,
  view: (meetingId: number) => [...personalRetrospectiveQueryKeys.views(), meetingId] as const,
}
