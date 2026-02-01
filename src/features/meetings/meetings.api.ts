/**
 * @file meetings.api.ts
 * @description Meeting API 요청 함수
 */

import { api, apiClient } from '@/api/client'
import type { ApiResponse, PaginatedResponse } from '@/api/types'
import { getMockMeetingApprovals } from '@/features/meetings/meetings.mock'
import type {
  ConfirmMeetingResponse,
  CreateMeetingRequest,
  CreateMeetingResponse,
  GetMeetingApprovalsParams,
  MeetingApprovalItem,
  RejectMeetingResponse,
} from '@/features/meetings/meetings.types'
import { PAGE_SIZES } from '@/shared/constants'

/**
 * 목데이터 사용 여부
 * @description 로그인 기능 개발 전까지 true로 설정하여 목데이터 사용
 * TODO: 로그인 기능 완료 후 false로 변경하여 실제 API 호출
 */
const USE_MOCK_DATA = true

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
  if (USE_MOCK_DATA) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockMeetingApprovals(status, page, size)
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.get<PaginatedResponse<MeetingApprovalItem>>(
    `/api/gatherings/${gatheringId}/meetings/approvals`,
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
 * @throws
 * - M009: 약속 상태를 변경할 수 없습니다.
 * - M001: 약속을 찾을 수 없습니다.
 */
export const rejectMeeting = async (meetingId: number) => {
  const response = await apiClient.post<ApiResponse<RejectMeetingResponse>>(
    `/api/meetings/${meetingId}/reject`
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
 * @throws
 * - M009: 약속 상태를 변경할 수 없습니다.
 * - M001: 약속을 찾을 수 없습니다.
 */
export const confirmMeeting = async (meetingId: number) => {
  const response = await apiClient.post<ApiResponse<ConfirmMeetingResponse>>(
    `/api/meetings/${meetingId}/confirm`
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
 * @throws
 * - M015: 약속 시작 24시간 이내에는 삭제할 수 없습니다.
 * - ACCESS_DENIED: 접근 권한이 없습니다.
 * - M001: 약속을 찾을 수 없습니다.
 */
export const deleteMeeting = async (meetingId: number) => {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/meetings/${meetingId}`)
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
    '/api/meetings',
    data
  )
  return response.data
}
