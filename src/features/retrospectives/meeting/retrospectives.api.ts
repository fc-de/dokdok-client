/**
 * @file retrospectives.api.ts
 * @description Retrospectives API 요청 함수
 */

import { api } from '@/api/client'
import { PAGE_SIZES } from '@/shared/constants'

import { RETROSPECTIVES_ENDPOINTS } from './retrospectives.endpoints'
import {
  getMockCollectedAnswers,
  getMockComments,
  getMockMeetingRetrospectiveDetail,
  getMockSummary,
  mockPublishSummary,
  mockUpdateSummary,
} from './retrospectives.mock'
import type {
  CreateCommentParams,
  CreateCommentResponse,
  CreateSttJobParams,
  DeleteCommentParams,
  GetCollectedAnswersParams,
  GetCollectedAnswersResponse,
  GetCommentsParams,
  GetCommentsResponse,
  GetMeetingRetrospectiveDetailParams,
  MeetingRetrospectiveDetailResponse,
  PublishSummaryParams,
  RetrospectiveSummaryResponse,
  SttJobResponse,
  UpdateSummaryParams,
} from './retrospectives.types'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/** STT 요청 타임아웃: 5분 (동기 API이므로 충분히 길게) */
const STT_TIMEOUT = 5 * 60 * 1000

/**
 * 수집된 사전 의견 조회
 *
 * @description
 * 약속의 수집된 사전 의견 목록을 커서 기반 페이지네이션으로 조회합니다.
 * 사용자별로 각 주제에 대한 답변을 확인할 수 있습니다.
 *
 * @param params - 조회 파라미터
 * @param params.meetingId - 약속 식별자
 * @param params.pageSize - 페이지 크기 (기본값: 10)
 * @param params.cursorUserId - 커서: 이전 페이지 마지막 항목의 사용자 ID
 *
 * @returns 수집된 사전 의견 목록
 */
export const getCollectedAnswers = async (
  params: GetCollectedAnswersParams
): Promise<GetCollectedAnswersResponse> => {
  const { meetingId, pageSize = PAGE_SIZES.COLLECTED_ANSWERS, cursorUserId } = params

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockCollectedAnswers(pageSize, cursorUserId)
  }

  return api.get<GetCollectedAnswersResponse>(
    RETROSPECTIVES_ENDPOINTS.COLLECTED_ANSWERS(meetingId),
    {
      params: {
        pageSize,
        cursorUserId,
      },
    }
  )
}

/**
 * STT Job 생성 (AI 요약 트리거)
 *
 * @description
 * 녹음 파일을 업로드하거나 사전 의견만으로 STT + AI 요약을 실행합니다.
 * 동기 API이므로 완료될 때까지 블로킹됩니다.
 *
 * @param params - 생성 파라미터
 * @param signal - AbortSignal (취소 지원)
 */
export const createSttJob = async (
  params: CreateSttJobParams,
  signal?: AbortSignal
): Promise<SttJobResponse> => {
  if (USE_MOCK) {
    await new Promise<void>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error('canceled'))
        return
      }
      const onAbort = () => {
        clearTimeout(timer)
        reject(new Error('canceled'))
      }
      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort)
        resolve()
      }, 2000)
      signal?.addEventListener('abort', onAbort, { once: true })
    })
    return {
      jobId: 1,
      meetingId: params.meetingId,
      userId: 1,
      status: 'DONE',
      summary: null,
      highlights: null,
      errorMessage: null,
      createdAt: new Date().toISOString(),
    }
  }

  const { gatheringId, meetingId, file } = params

  const formData = new FormData()
  if (file) {
    formData.append('file', file)
  }

  return api.post<SttJobResponse>(
    RETROSPECTIVES_ENDPOINTS.STT_JOBS(gatheringId, meetingId),
    formData,
    {
      headers: { 'Content-Type': undefined },
      timeout: STT_TIMEOUT,
      signal,
    }
  )
}

/**
 * 회고 요약 조회
 *
 * @param meetingId - 약속 식별자
 */
export const getSummary = async (meetingId: number): Promise<RetrospectiveSummaryResponse> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockSummary(meetingId)
  }

  return api.get<RetrospectiveSummaryResponse>(RETROSPECTIVES_ENDPOINTS.SUMMARY(meetingId))
}

/**
 * 회고 요약 수정
 *
 * @param params - 수정 파라미터 (meetingId + topics 데이터)
 */
export const updateSummary = async (
  params: UpdateSummaryParams
): Promise<RetrospectiveSummaryResponse> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockUpdateSummary(params.meetingId, params.data)
  }

  const { meetingId, data } = params
  return api.patch<RetrospectiveSummaryResponse>(RETROSPECTIVES_ENDPOINTS.SUMMARY(meetingId), data)
}

/**
 * 회고 요약 발행 (약속 회고 생성)
 *
 * @param params - 발행 파라미터 (meetingId)
 */
export const publishSummary = async (
  params: PublishSummaryParams
): Promise<RetrospectiveSummaryResponse> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockPublishSummary(params.meetingId)
  }

  return api.post<RetrospectiveSummaryResponse>(RETROSPECTIVES_ENDPOINTS.PUBLISH(params.meetingId))
}

/**
 * 약속회고 상세 조회
 *
 * @description
 * 발행된 약속회고의 상세 내용을 조회합니다.
 * 약속 정보, 모임 정보, 주제별 요약 및 주요 포인트를 포함합니다.
 *
 * @param params - 조회 파라미터
 * @param params.meetingId - 약속 식별자
 *
 * @returns 약속회고 상세 정보
 */
export const getMeetingRetrospectiveDetail = async (
  params: GetMeetingRetrospectiveDetailParams
): Promise<MeetingRetrospectiveDetailResponse> => {
  const { meetingId } = params

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockMeetingRetrospectiveDetail()
  }

  return api.get<MeetingRetrospectiveDetailResponse>(RETROSPECTIVES_ENDPOINTS.DETAIL(meetingId))
}

/**
 * 댓글 조회
 *
 * @description
 * 약속회고의 댓글 목록을 커서 기반 페이지네이션으로 조회합니다.
 *
 * @param params - 조회 파라미터
 * @param params.meetingId - 약속 식별자
 * @param params.pageSize - 페이지 크기
 * @param params.cursorCreatedAt - 커서: 이전 페이지 마지막 항목의 작성일시
 * @param params.cursorCommentId - 커서: 이전 페이지 마지막 항목의 댓글 ID
 *
 * @returns 댓글 목록
 */
export const getComments = async (params: GetCommentsParams): Promise<GetCommentsResponse> => {
  const {
    meetingId,
    pageSize = PAGE_SIZES.RETROSPECTIVE_COMMENTS,
    cursorCreatedAt,
    cursorCommentId,
  } = params

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockComments(pageSize, cursorCreatedAt, cursorCommentId)
  }

  return api.get<GetCommentsResponse>(RETROSPECTIVES_ENDPOINTS.COMMENTS(meetingId), {
    params: {
      pageSize,
      cursorCreatedAt,
      cursorCommentId,
    },
  })
}

/**
 * 댓글 작성
 *
 * @description
 * 약속회고에 댓글을 작성합니다.
 *
 * @param params - 작성 파라미터
 * @param params.meetingId - 약속 식별자
 * @param params.comment - 댓글 내용
 *
 * @returns 작성된 댓글 정보
 */
export const createComment = async (
  params: CreateCommentParams
): Promise<CreateCommentResponse> => {
  const { meetingId, comment } = params

  return api.post<CreateCommentResponse>(RETROSPECTIVES_ENDPOINTS.COMMENTS(meetingId), {
    comment,
  })
}

/**
 * 댓글 삭제
 *
 * @description
 * 약속회고의 댓글을 삭제합니다.
 *
 * @param params - 삭제 파라미터
 * @param params.meetingId - 약속 식별자
 * @param params.commentId - 댓글 식별자
 *
 * @returns void
 */
export const deleteComment = async (params: DeleteCommentParams): Promise<void> => {
  const { meetingId, commentId } = params

  return api.delete<void>(RETROSPECTIVES_ENDPOINTS.COMMENT_DELETE(meetingId, commentId))
}
