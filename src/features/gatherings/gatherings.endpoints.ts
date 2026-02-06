import { API_PATHS } from '@/api'

export const GATHERINGS_ENDPOINTS = {
  /** 모임 목록/생성 */
  BASE: API_PATHS.GATHERINGS,
  /** 즐겨찾기 모임 목록 조회 */
  FAVORITES: `${API_PATHS.GATHERINGS}/favorites`,
  /** 즐겨찾기 토글 */
  TOGGLE_FAVORITE: (gatheringId: number) => `${API_PATHS.GATHERINGS}/${gatheringId}/favorites`,
  /** 초대 코드로 모임 정보 조회 / 가입 신청 */
  JOIN_REQUEST: (invitationCode: string) =>
    `${API_PATHS.GATHERINGS}/join-request/${invitationCode}`,
} as const
