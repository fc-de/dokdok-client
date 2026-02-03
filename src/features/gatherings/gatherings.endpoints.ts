import { API_PATHS } from '@/api'

export const GATHERINGS_ENDPOINTS = {
  /** 모임 목록/생성 */
  BASE: API_PATHS.GATHERINGS,
  /** 초대 코드로 모임 정보 조회 / 가입 신청 */
  JOIN_REQUEST: (invitationCode: string) =>
    `${API_PATHS.GATHERINGS}/join-request/${invitationCode}`,
} as const
