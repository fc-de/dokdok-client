/**
 * @file preOpinion.api.ts
 * @description 사전 의견 API 요청 함수
 */

import { api } from '@/api/client'
import { PRE_OPINION_ENDPOINTS } from '@/features/pre-opinion/preOpinion.endpoints'
import { getMockPreOpinionDetail } from '@/features/pre-opinion/preOpinion.mock'
import type {
  GetPreOpinionParams,
  GetPreOpinionResponse,
} from '@/features/pre-opinion/preOpinion.types'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 사전 의견 조회
 *
 * @description
 * 약속에 대한 사전 의견 정보를 조회합니다.
 * 책 정보, 리뷰(평가), 주제별 사전 의견 내용을 포함합니다.
 *
 * @param params - 모임 ID와 약속 ID
 *
 * @returns 사전 의견 응답 데이터
 */
export const getPreOpinion = async ({
  gatheringId,
  meetingId,
}: GetPreOpinionParams): Promise<GetPreOpinionResponse> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockPreOpinionDetail()
  }

  return api.get<GetPreOpinionResponse>(
    PRE_OPINION_ENDPOINTS.DETAIL(gatheringId, meetingId)
  )
}
