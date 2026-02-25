import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { publishSummary } from '../retrospectives.api'
import type { PublishSummaryParams, RetrospectiveSummaryResponse } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

export const usePublishSummary = () => {
  const queryClient = useQueryClient()

  return useMutation<RetrospectiveSummaryResponse, ApiError, PublishSummaryParams>({
    mutationFn: (params: PublishSummaryParams) => publishSummary(params),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(retrospectiveQueryKeys.summary(variables.meetingId), data)
    },
  })
}
