import { apiClient, type ApiResponse } from '@/api'

import { GATHERINGS_ENDPOINTS } from './gatherings.endpoints'
import type {
  CreateGatheringRequest,
  CreateGatheringResponse,
  GatheringByInviteCodeResponse,
  GatheringJoinResponse,
} from './gatherings.types'

/**
 * 독서모임 생성
 *
 * @param data - 모임 생성 요청 데이터
 * @param data.gatheringName - 모임 이름 (최대 12자)
 * @param data.gatheringDescription - 모임 설명 (최대 150자)
 * @returns 생성된 모임 정보
 */
export const createGathering = async (data: CreateGatheringRequest) => {
  const response = await apiClient.post<ApiResponse<CreateGatheringResponse>>(
    GATHERINGS_ENDPOINTS.BASE,
    data
  )
  return response.data
}

/**
 * 초대 코드로 모임 정보 조회 (로그인 불필요)
 *
 * @param invitationCode - 초대 코드
 * @returns 모임 정보
 */
export const getGatheringByInviteCode = async (invitationCode: string) => {
  const response = await apiClient.get<ApiResponse<GatheringByInviteCodeResponse>>(
    GATHERINGS_ENDPOINTS.JOIN_REQUEST(invitationCode)
  )
  return response.data
}

/**
 * 모임 가입 신청 (로그인 필요)
 *
 * @param invitationCode - 초대 코드
 * @returns 가입 신청 결과 (gatheringId, gatheringName, memberStatus)
 */
export const joinGathering = async (invitationCode: string) => {
  const response = await apiClient.post<ApiResponse<GatheringJoinResponse>>(
    GATHERINGS_ENDPOINTS.JOIN_REQUEST(invitationCode)
  )
  return response.data
}
