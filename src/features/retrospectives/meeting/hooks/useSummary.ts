import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { getSummary } from '../retrospectives.api'
import type { RetrospectiveSummaryResponse } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

export const useSummary = (meetingId: number) => {
  const isValid = !Number.isNaN(meetingId) && meetingId > 0

  return useQuery<RetrospectiveSummaryResponse, ApiError>({
    queryKey: retrospectiveQueryKeys.summary(meetingId),
    queryFn: () => getSummary(meetingId),
    enabled: isValid,
  })
}
