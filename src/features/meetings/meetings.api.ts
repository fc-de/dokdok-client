/**
 * @file meetings.api.ts
 * @description Meeting API 요청 함수
 */

import { api, apiClient } from '@/api/client'
import type { ApiResponse, PaginatedResponse } from '@/api/types'
import { MEETINGS_ENDPOINTS } from '@/features/meetings/meetings.endpoints'
import { getMockMeetingApprovals, getMockMeetingDetail } from '@/features/meetings/meetings.mock'
import type {
  ConfirmMeetingResponse,
  CreateMeetingRequest,
  CreateMeetingResponse,
  GetMeetingApprovalsParams,
  GetMeetingDetailResponse,
  GetMyMeetingsParams,
  MeetingApprovalItem,
  MyMeetingListResponse,
  MyMeetingTabCountsResponse,
  RejectMeetingResponse,
  UpdateMeetingRequest,
  UpdateMeetingResponse,
} from '@/features/meetings/meetings.types'
import { PAGE_SIZES } from '@/shared/constants'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 약속 승인 리스트 조회
 *
 * @description
 * 모임의 약속 승인 대기/완료 리스트를 페이지네이션으로 조회합니다.
 *
 * @param params - 조회 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.status - 약속 상태 (PENDING: 확정 대기, CONFIRMED: 확정 완료)
 * @param params.page - 페이지 번호 (기본값: 0)
 * @param params.size - 페이지 크기 (기본값: 10)
 * @param params.sort - 정렬 기준 배열
 *
 * @returns 약속 승인 리스트 페이지네이션 응답
 * ```
 */
export const getMeetingApprovals = async (
  params: GetMeetingApprovalsParams
): Promise<PaginatedResponse<MeetingApprovalItem>> => {
  const { gatheringId, status, page = 0, size = PAGE_SIZES.MEETING_APPROVALS, sort } = params

  // 🚧 임시: 로그인 기능 개발 전까지 목데이터 사용
  // TODO: 로그인 완료 후 아래 주석을 해제하고 목데이터 로직 제거
  if (USE_MOCK) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockMeetingApprovals(status, page, size)
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.get<PaginatedResponse<MeetingApprovalItem>>(
    MEETINGS_ENDPOINTS.APPROVALS(gatheringId),
    {
      params: {
        status,
        page,
        size,
        sort,
      },
    }
  )
}

/**
 * 약속 거부
 *
 * @description
 * 약속을 거부합니다. (PENDING 상태만 거부 가능)
 *
 * @param meetingId - 약속 ID
 *
 * @returns 거부된 약속 정보와 서버 메시지
 *
 */
export const rejectMeeting = async (meetingId: number) => {
  const response = await apiClient.post<ApiResponse<RejectMeetingResponse>>(
    MEETINGS_ENDPOINTS.REJECT(meetingId)
  )
  return response.data
}

/**
 * 약속 승인
 *
 * @description
 * 약속을 승인합니다. (PENDING 상태만 승인 가능)
 *
 * @param meetingId - 약속 ID
 *
 * @returns 승인된 약속 정보와 서버 메시지
 *
 */
export const confirmMeeting = async (meetingId: number) => {
  const response = await apiClient.post<ApiResponse<ConfirmMeetingResponse>>(
    MEETINGS_ENDPOINTS.CONFIRM(meetingId)
  )
  return response.data
}

/**
 * 약속 삭제
 *
 * @description
 * 약속을 삭제합니다.
 * 권한: 모임장만 가능
 * 제약: 약속 시작 24시간 이내 삭제 불가
 *
 * @param meetingId - 약속 ID
 *
 * @returns 삭제 성공 메시지
 *
 */
export const deleteMeeting = async (meetingId: number) => {
  const response = await apiClient.delete<ApiResponse<null>>(MEETINGS_ENDPOINTS.DELETE(meetingId))
  return response.data
}

/**
 * 약속 상세 조회
 *
 * @description
 * 약속의 상세 정보를 조회합니다.
 * 모임 정보, 책 정보, 일정, 장소, 참가자 목록 등을 포함합니다.
 *
 * @param meetingId - 약속 ID
 *
 * @returns 약속 상세 정보
 *
 */
export const getMeetingDetail = async (meetingId: number): Promise<GetMeetingDetailResponse> => {
  // 🚧 임시: 로그인 기능 개발 전까지 목데이터 사용
  // TODO: 로그인 완료 후 아래 주석을 해제하고 목데이터 로직 제거
  if (USE_MOCK) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockMeetingDetail(meetingId)
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.get<GetMeetingDetailResponse>(MEETINGS_ENDPOINTS.DETAIL(meetingId))
}

/**
 * 약속 참가신청
 *
 * @description
 * 약속에 참가신청합니다.
 *
 * @param meetingId - 약속 ID
 *
 */
export const joinMeeting = async (meetingId: number) => {
  const response = await apiClient.post<ApiResponse<number>>(MEETINGS_ENDPOINTS.JOIN(meetingId))
  return response.data
}

/**
 * 약속 참가취소
 *
 * @description
 * 약속 참가를 취소합니다.
 *
 * @param meetingId - 약속 ID
 *
 */
export const cancelJoinMeeting = async (meetingId: number) => {
  const response = await apiClient.delete<ApiResponse<number>>(
    MEETINGS_ENDPOINTS.CANCEL_JOIN(meetingId)
  )
  return response.data
}

/**
 * 약속 생성
 *
 * @description
 * 새로운 약속을 생성합니다.
 * 생성된 약속은 PENDING 상태로 시작되며, 모임장의 승인을 기다립니다.
 *
 * @param data - 약속 생성 요청 데이터
 *
 * @returns 생성된 약속 정보
 *
 * @throws
 * - M013: 최대 참가 인원이 유효하지 않습니다.
 * - GA001: 모임을 찾을 수 없습니다.
 * - B001: 책을 찾을 수 없습니다.
 */
export const createMeeting = async (data: CreateMeetingRequest) => {
  const response = await apiClient.post<ApiResponse<CreateMeetingResponse>>(
    MEETINGS_ENDPOINTS.CREATE,
    data
  )
  return response.data
}

/**
 * 약속 수정
 *
 * @description
 * 약속 정보를 수정합니다.
 * 책 정보는 수정할 수 없습니다.
 *
 * @param meetingId - 약속 ID
 * @param data - 약속 수정 요청 데이터
 *
 * @returns 수정된 약속 정보
 *
 * @throws
 * - M001: 약속을 찾을 수 없습니다.
 * - M013: 최대 참가 인원이 유효하지 않습니다.
 */
export const updateMeeting = async (meetingId: number, data: UpdateMeetingRequest) => {
  const response = await apiClient.patch<ApiResponse<UpdateMeetingResponse>>(
    MEETINGS_ENDPOINTS.UPDATE(meetingId),
    data
  )
  return response.data
}

/**
 * 메인페이지 내 약속 리스트 조회
 *
 * @param params - 조회 파라미터 (filter, cursor, size)
 * @returns 내 약속 리스트 (커서 기반 페이지네이션)
 */
export const getMyMeetings = async (
  params: GetMyMeetingsParams
): Promise<MyMeetingListResponse> => {
  return api.get<MyMeetingListResponse>(MEETINGS_ENDPOINTS.MY_MEETINGS, { params })
}

/**
 * 메인페이지 내 약속 탭 카운트 조회
 *
 * @returns 탭별 약속 카운트 (all, upcoming, done)
 */
export const getMyMeetingTabCounts = async (): Promise<MyMeetingTabCountsResponse> => {
  return api.get<MyMeetingTabCountsResponse>(MEETINGS_ENDPOINTS.MY_MEETING_TAB_COUNTS)
}
