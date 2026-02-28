/**
 * @file retrospectives.api.ts
 * @description Retrospectives API 요청 함수
 */

import { api } from '@/api/client'
import { PAGE_SIZES } from '@/shared/constants'

import { RETROSPECTIVES_ENDPOINTS } from './retrospectives.endpoints'
import {
  getMockCollectedAnswers,
  getMockSummary,
  mockPublishSummary,
  mockUpdateSummary,
} from './retrospectives.mock'
import type {
  CreateSttJobParams,
  GetCollectedAnswersParams,
  GetCollectedAnswersResponse,
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
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 2000)
      signal?.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new Error('canceled'))
      })
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
