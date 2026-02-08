/**
 * @file preOpinions.api.ts
 * @description 사전 의견 API 요청 함수
 */

import { api } from '@/api/client'

import { PRE_OPINIONS_ENDPOINTS } from './preOpinions.endpoints'
import { getMockPreOpinionAnswers } from './preOpinions.mock'
import type { GetPreOpinionAnswersParams, PreOpinionAnswersData } from './preOpinions.types'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 사전 의견 목록 조회
 *
 * @description
 * 약속의 사전 의견 목록(멤버별 책 평가 + 주제 의견)을 조회합니다.
 *
 * @param params - 조회 파라미터
 * @param params.gatheringId - 모임 식별자
 * @param params.meetingId - 약속 식별자
 *
 * @returns 사전 의견 목록 데이터 (topics + members)
 */
export const getPreOpinionAnswers = async (
  params: GetPreOpinionAnswersParams
): Promise<PreOpinionAnswersData> => {
  const { gatheringId, meetingId } = params

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockPreOpinionAnswers()
  }

  return api.get<PreOpinionAnswersData>(PRE_OPINIONS_ENDPOINTS.ANSWERS(gatheringId, meetingId))
}
