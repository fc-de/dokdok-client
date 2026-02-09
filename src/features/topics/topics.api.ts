/**
 * @file topics.api.ts
 * @description Topic API 요청 함수
 */

import { api } from '@/api/client'
import { PAGE_SIZES } from '@/shared/constants'

import { TOPICS_ENDPOINTS } from './topics.endpoints'
import { getMockConfirmedTopics, getMockProposedTopics } from './topics.mock'
import type {
  CreateTopicParams,
  CreateTopicResponse,
  DeleteTopicParams,
  GetConfirmedTopicsParams,
  GetConfirmedTopicsResponse,
  GetProposedTopicsParams,
  GetProposedTopicsResponse,
  LikeTopicParams,
  LikeTopicResponse,
} from './topics.types'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 제안된 주제 조회
 *
 * @description
 * 약속에 제안된 주제 목록을 커서 기반 페이지네이션으로 조회합니다.
 * 좋아요 수 기준 내림차순으로 정렬됩니다.
 *
 * @param params - 조회 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 * @param params.pageSize - 페이지 크기 (기본값: 5)
 * @param params.cursorLikeCount - 커서: 이전 페이지 마지막 항목의 좋아요 수
 * @param params.cursorTopicId - 커서: 이전 페이지 마지막 항목의 주제 ID
 *
 * @returns 제안된 주제 목록 및 액션 정보
 */
export const getProposedTopics = async (
  params: GetProposedTopicsParams
): Promise<GetProposedTopicsResponse> => {
  const {
    gatheringId,
    meetingId,
    pageSize = PAGE_SIZES.TOPICS,
    cursorLikeCount,
    cursorTopicId,
  } = params

  // 🚧 임시: 로그인 기능 개발 전까지 목데이터 사용
  // TODO: 로그인 완료 후 아래 주석을 해제하고 목데이터 로직 제거
  if (USE_MOCK) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockProposedTopics(pageSize, cursorLikeCount, cursorTopicId)
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.get<GetProposedTopicsResponse>(TOPICS_ENDPOINTS.PROPOSED(gatheringId, meetingId), {
    params: {
      pageSize,
      cursorLikeCount,
      cursorTopicId,
    },
  })
}

/**
 * 확정된 주제 조회
 *
 * @description
 * 약속의 확정된 주제 목록을 커서 기반 페이지네이션으로 조회합니다.
 * 확정 순서 기준 오름차순으로 정렬됩니다.
 *
 * @param params - 조회 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 * @param params.pageSize - 페이지 크기 (기본값: 5)
 * @param params.cursorConfirmOrder - 커서: 이전 페이지 마지막 항목의 확정 순서
 * @param params.cursorTopicId - 커서: 이전 페이지 마지막 항목의 주제 ID
 *
 * @returns 확정된 주제 목록 및 액션 정보
 */
export const getConfirmedTopics = async (
  params: GetConfirmedTopicsParams
): Promise<GetConfirmedTopicsResponse> => {
  const {
    gatheringId,
    meetingId,
    pageSize = PAGE_SIZES.TOPICS,
    cursorConfirmOrder,
    cursorTopicId,
  } = params

  // 🚧 임시: 로그인 기능 개발 전까지 목데이터 사용
  // TODO: 로그인 완료 후 아래 주석을 해제하고 목데이터 로직 제거
  if (USE_MOCK) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockConfirmedTopics(pageSize, cursorConfirmOrder, cursorTopicId)
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.get<GetConfirmedTopicsResponse>(TOPICS_ENDPOINTS.CONFIRMED(gatheringId, meetingId), {
    params: {
      pageSize,
      cursorConfirmOrder,
      cursorTopicId,
    },
  })
}

/**
 * 주제 삭제
 *
 * @description
 * 주제를 삭제합니다. 삭제 권한이 있는 경우에만 삭제가 가능합니다.
 *
 * @param params - 삭제 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 * @param params.topicId - 주제 식별자
 *
 * @returns void (성공 시 응답 데이터 없음)
 */
export const deleteTopic = async (params: DeleteTopicParams): Promise<void> => {
  const { gatheringId, meetingId, topicId } = params

  // 🚧 임시: 로그인 기능 개발 전까지 목데이터 사용
  // TODO: 로그인 완료 후 아래 주석을 해제하고 목데이터 로직 제거
  if (USE_MOCK) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    return
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.delete<void>(TOPICS_ENDPOINTS.DELETE(gatheringId, meetingId, topicId))
}

/**
 * 주제 제안
 *
 * @description
 * 약속에 새로운 주제를 제안합니다.
 *
 * @param params - 제안 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 * @param params.body - 요청 바디 (제목, 설명, 주제 타입)
 *
 * @returns 생성된 주제 정보
 */
export const createTopic = async (params: CreateTopicParams): Promise<CreateTopicResponse> => {
  const { gatheringId, meetingId, body } = params

  // 🚧 임시: 로그인 기능 개발 전까지 목데이터 사용
  // TODO: 로그인 완료 후 아래 주석을 해제하고 목데이터 로직 제거
  if (USE_MOCK) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      topicId: Math.floor(Math.random() * 1000),
      title: body.title,
      description: body.description || null,
      topicType: body.topicType,
    }
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.post<CreateTopicResponse>(TOPICS_ENDPOINTS.CREATE(gatheringId, meetingId), body)
}

/**
 * 주제 좋아요 토글
 *
 * @description
 * 주제 좋아요를 토글합니다. 좋아요 상태이면 취소하고, 아니면 좋아요를 추가합니다.
 *
 * @param params - 좋아요 토글 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 * @param params.topicId - 주제 식별자
 *
 * @returns 좋아요 토글 결과 (주제 ID, 좋아요 상태, 새로운 좋아요 수)
 */
export const likeTopicToggle = async (params: LikeTopicParams): Promise<LikeTopicResponse> => {
  const { gatheringId, meetingId, topicId } = params

  // 🚧 임시: 로그인 기능 개발 전까지 목데이터 사용
  // TODO: 로그인 완료 후 아래 주석을 해제하고 목데이터 로직 제거
  if (USE_MOCK) {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 300))
    // 목 응답 (랜덤하게 좋아요/취소)
    const liked = Math.random() > 0.5
    return {
      topicId,
      liked,
      newCount: liked ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 5),
    }
  }

  // 실제 API 호출 (로그인 완료 후 사용)
  return api.post<LikeTopicResponse>(TOPICS_ENDPOINTS.LIKE_TOGGLE(gatheringId, meetingId, topicId))
}
