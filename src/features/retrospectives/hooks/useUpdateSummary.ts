import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api'
import type { ApiResponse } from '@/api/types'

import { updateSummary } from '../retrospectives.api'
import type { RetrospectiveSummaryResponse, UpdateSummaryParams } from '../retrospectives.types'
import { retrospectiveQueryKeys } from './retrospectiveQueryKeys'

export const useUpdateSummary = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<RetrospectiveSummaryResponse>,
    ApiError,
    UpdateSummaryParams
  >({
    mutationFn: (params: UpdateSummaryParams) => updateSummary(params),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        retrospectiveQueryKeys.summary(variables.meetingId),
        response.data
      )
    },
  })
}
