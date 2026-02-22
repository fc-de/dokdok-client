/**
 * @file retrospectives.api.ts
 * @description 약속 회고 AI 요약 API 요청 함수
 */

import { api, apiClient } from '@/api/client'
import type { ApiResponse } from '@/api/types'

import { RETROSPECTIVES_ENDPOINTS } from './retrospectives.endpoints'
import type {
  CreateSttJobParams,
  PublishSummaryParams,
  RetrospectiveSummaryResponse,
  SttJobResponse,
  UpdateSummaryParams,
} from './retrospectives.types'

/** STT 요청 타임아웃: 5분 (동기 API이므로 충분히 길게) */
const STT_TIMEOUT = 5 * 60 * 1000

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
export const createSttJob = async (params: CreateSttJobParams, signal?: AbortSignal) => {
  const { gatheringId, meetingId, file } = params

  const formData = new FormData()
  if (file) {
    formData.append('file', file)
  }

  const response = await apiClient.post<ApiResponse<SttJobResponse>>(
    RETROSPECTIVES_ENDPOINTS.STT_JOBS(gatheringId, meetingId),
    formData,
    {
      headers: { 'Content-Type': undefined },
      timeout: STT_TIMEOUT,
      signal,
    }
  )
  return response.data
}

/**
 * 회고 요약 조회
 *
 * @param meetingId - 약속 식별자
 */
export const getSummary = async (meetingId: number): Promise<RetrospectiveSummaryResponse> => {
  return api.get<RetrospectiveSummaryResponse>(RETROSPECTIVES_ENDPOINTS.SUMMARY(meetingId))
}

/**
 * 회고 요약 수정
 *
 * @param params - 수정 파라미터 (meetingId + topics 데이터)
 */
export const updateSummary = async (params: UpdateSummaryParams) => {
  const { meetingId, data } = params
  const response = await apiClient.patch<ApiResponse<RetrospectiveSummaryResponse>>(
    RETROSPECTIVES_ENDPOINTS.SUMMARY(meetingId),
    data
  )
  return response.data
}

/**
 * 회고 요약 발행 (약속 회고 생성)
 *
 * @param params - 발행 파라미터 (meetingId)
 */
export const publishSummary = async (params: PublishSummaryParams) => {
  const response = await apiClient.post<ApiResponse<RetrospectiveSummaryResponse>>(
    RETROSPECTIVES_ENDPOINTS.PUBLISH(params.meetingId)
  )
  return response.data
}
