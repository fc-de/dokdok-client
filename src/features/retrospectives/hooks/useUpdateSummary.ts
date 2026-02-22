import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'

import { updateSummary } from '../retrospectives.api'
import type { RetrospectiveSummaryResponse, UpdateSummaryParams } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

export const useUpdateSummary = () => {
  const queryClient = useQueryClient()

  return useMutation<RetrospectiveSummaryResponse, ApiError, UpdateSummaryParams>({
    mutationFn: (params: UpdateSummaryParams) => updateSummary(params),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(retrospectiveQueryKeys.summary(variables.meetingId), data)
    },
  })
}
