import { useQuery } from '@tanstack/react-query'

import { ApiError, type ApiResponse } from '@/api'

import { getGatheringByInviteCode } from '../gatherings.api'
import type { GatheringByInviteCodeResponse } from '../gatherings.types'
import { gatheringQueryKeys } from './gatheringQueryKeys'

/**
 * 초대 코드로 모임 정보 조회 훅
 *
 * @param invitationCode - 초대 코드
 */
export const useGatheringByInviteCode = (invitationCode: string | undefined) => {
  return useQuery<ApiResponse<GatheringByInviteCodeResponse>, ApiError>({
    queryKey: gatheringQueryKeys.byInviteCode(invitationCode ?? ''),
    queryFn: () => getGatheringByInviteCode(invitationCode!),
    enabled: !!invitationCode,
  })
}
