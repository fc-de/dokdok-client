import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'
import type { ApiResponse } from '@/api/types'

import { publishSummary } from '../retrospectives.api'
import type { PublishSummaryParams, RetrospectiveSummaryResponse } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

export const usePublishSummary = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<RetrospectiveSummaryResponse>, ApiError, PublishSummaryParams>({
    mutationFn: (params: PublishSummaryParams) => publishSummary(params),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(retrospectiveQueryKeys.summary(variables.meetingId), response.data)
    },
  })
}
