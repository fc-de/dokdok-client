import { API_PATHS } from '@/api'

export const GATHERINGS_ENDPOINTS = {
  /** 모임 목록/생성 */
  BASE: API_PATHS.GATHERINGS,
  /** 모임 상세 조회 */
  DETAIL: (gatheringId: number) => `${API_PATHS.GATHERINGS}/${gatheringId}`,
  /** 즐겨찾기 모임 목록 조회 */
  FAVORITES: `${API_PATHS.GATHERINGS}/favorites`,
  /** 즐겨찾기 토글 */
  TOGGLE_FAVORITE: (gatheringId: number) => `${API_PATHS.GATHERINGS}/${gatheringId}/favorites`,
  /** 초대 코드로 모임 정보 조회 / 가입 신청 */
  JOIN_REQUEST: (invitationCode: string) =>
    `${API_PATHS.GATHERINGS}/join-request/${invitationCode}`,
  /** 모임 약속 목록 조회 */
  MEETINGS: (gatheringId: number) => `${API_PATHS.GATHERINGS}/${gatheringId}/meetings`,
  /** 모임 책장 조회 */
  BOOKS: (gatheringId: number) => `${API_PATHS.GATHERINGS}/${gatheringId}/books`,
  /** 약속 탭별 카운트 조회 */
  MEETING_TAB_COUNTS: `${API_PATHS.MEETINGS}/tab-counts`,
  /** 멤버 목록 조회 */
  MEMBERS: (gatheringId: number) => `${API_PATHS.GATHERINGS}/${gatheringId}/members`,
  /** 가입 요청 승인/거절 */
  HANDLE_JOIN_REQUEST: (gatheringId: number, memberId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/join-requests/${memberId}`,
  /** 멤버 삭제(강퇴) */
  REMOVE_MEMBER: (gatheringId: number, userId: number) =>
    `${API_PATHS.GATHERINGS}/${gatheringId}/members/${userId}`,
} as const
