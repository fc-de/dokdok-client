import { apiClient, type ApiResponse } from '@/api'

import { GATHERINGS_ENDPOINTS } from './gatherings.endpoints'
import type {
  ApproveType,
  CreateGatheringRequest,
  CreateGatheringResponse,
  FavoriteGatheringListResponse,
  GatheringBookListResponse,
  GatheringByInviteCodeResponse,
  GatheringDetailResponse,
  GatheringJoinResponse,
  GatheringListResponse,
  GatheringMeetingListResponse,
  GatheringMemberListResponse,
  GatheringUpdateRequest,
  GatheringUpdateResponse,
  GetGatheringBooksParams,
  GetGatheringMeetingsParams,
  GetGatheringMembersParams,
  GetGatheringsParams,
  MeetingTabCountsResponse,
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

/**
 * 내 모임 전체 목록 조회 (커서 기반 무한 스크롤)
 *
 * @param params - 조회 파라미터
 * @param params.pageSize - 페이지 크기 (기본: 9)
 * @param params.cursorJoinedAt - 마지막 항목의 가입일시 (ISO 8601)
 * @param params.cursorId - 마지막 항목의 ID
 * @returns 모임 목록 및 페이지네이션 정보
 */
export const getGatherings = async (params?: GetGatheringsParams) => {
  const response = await apiClient.get<ApiResponse<GatheringListResponse>>(
    GATHERINGS_ENDPOINTS.BASE,
    {
      params,
    }
  )
  return response.data
}

/**
 * 즐겨찾기 모임 목록 조회
 *
 * @returns 즐겨찾기 모임 목록 (최대 4개)
 */
export const getFavoriteGatherings = async () => {
  const response = await apiClient.get<ApiResponse<FavoriteGatheringListResponse>>(
    GATHERINGS_ENDPOINTS.FAVORITES
  )
  return response.data
}

/**
 * 모임 즐겨찾기 토글
 *
 * @param gatheringId - 모임 ID
 */
export const toggleFavorite = async (gatheringId: number) => {
  const response = await apiClient.patch<ApiResponse<null>>(
    GATHERINGS_ENDPOINTS.TOGGLE_FAVORITE(gatheringId)
  )
  return response.data
}

/**
 * 모임 상세 조회
 *
 * @param gatheringId - 모임 ID
 * @returns 모임 상세 정보
 */
export const getGatheringDetail = async (gatheringId: number) => {
  const response = await apiClient.get<ApiResponse<GatheringDetailResponse>>(
    GATHERINGS_ENDPOINTS.DETAIL(gatheringId)
  )
  return response.data
}

/**
 * 모임 약속 목록 조회 (페이지 기반)
 *
 * @param params - 조회 파라미터
 * @returns 약속 목록 및 페이지네이션 정보
 */
export const getGatheringMeetings = async (params: GetGatheringMeetingsParams) => {
  const { gatheringId, ...queryParams } = params
  const response = await apiClient.get<ApiResponse<GatheringMeetingListResponse>>(
    GATHERINGS_ENDPOINTS.MEETINGS(gatheringId),
    { params: queryParams }
  )
  return response.data
}

/**
 * 모임 책장 조회 (페이지 기반)
 *
 * @param params - 조회 파라미터
 * @returns 책 목록 및 페이지네이션 정보
 */
export const getGatheringBooks = async (params: GetGatheringBooksParams) => {
  const { gatheringId, ...queryParams } = params
  const response = await apiClient.get<ApiResponse<GatheringBookListResponse>>(
    GATHERINGS_ENDPOINTS.BOOKS(gatheringId),
    { params: queryParams }
  )
  return response.data
}

/**
 * 모임 약속 탭별 카운트 조회
 *
 * @param gatheringId - 모임 ID
 * @returns 탭별 약속 카운트
 */
export const getMeetingTabCounts = async (gatheringId: number) => {
  const response = await apiClient.get<ApiResponse<MeetingTabCountsResponse>>(
    GATHERINGS_ENDPOINTS.MEETING_TAB_COUNTS,
    { params: { gatheringId } }
  )
  return response.data
}

/**
 * 모임 멤버 목록 조회 (커서 기반 무한 스크롤)
 *
 * @param params - 조회 파라미터
 * @returns 멤버 목록 및 페이지네이션 정보
 */
export const getGatheringMembers = async (params: GetGatheringMembersParams) => {
  const { gatheringId, ...queryParams } = params
  const response = await apiClient.get<ApiResponse<GatheringMemberListResponse>>(
    GATHERINGS_ENDPOINTS.MEMBERS(gatheringId),
    { params: queryParams }
  )
  return response.data
}

/**
 * 모임 정보 수정
 *
 * @param gatheringId - 모임 ID
 * @param data - 수정할 모임 정보
 * @returns 수정된 모임 정보
 */
export const updateGathering = async (gatheringId: number, data: GatheringUpdateRequest) => {
  const response = await apiClient.patch<ApiResponse<GatheringUpdateResponse>>(
    GATHERINGS_ENDPOINTS.DETAIL(gatheringId),
    data
  )
  return response.data
}

/**
 * 모임 삭제
 *
 * @param gatheringId - 모임 ID
 */
export const deleteGathering = async (gatheringId: number) => {
  const response = await apiClient.delete<ApiResponse<null>>(
    GATHERINGS_ENDPOINTS.DETAIL(gatheringId)
  )
  return response.data
}

/**
 * 가입 요청 승인/거절
 *
 * @param gatheringId - 모임 ID
 * @param memberId - 처리할 멤버의 유저 ID
 * @param approveType - 승인(ACTIVE) 또는 거절(REJECTED)
 */
export const handleJoinRequest = async (
  gatheringId: number,
  memberId: number,
  approveType: ApproveType
) => {
  const response = await apiClient.patch<ApiResponse<null>>(
    GATHERINGS_ENDPOINTS.HANDLE_JOIN_REQUEST(gatheringId, memberId),
    { approve_type: approveType }
  )
  return response.data
}

/**
 * 멤버 삭제(강퇴)
 *
 * @param gatheringId - 모임 ID
 * @param userId - 강퇴할 유저 ID
 */
export const removeMember = async (gatheringId: number, userId: number) => {
  const response = await apiClient.delete<ApiResponse<null>>(
    GATHERINGS_ENDPOINTS.REMOVE_MEMBER(gatheringId, userId)
  )
  return response.data
}
