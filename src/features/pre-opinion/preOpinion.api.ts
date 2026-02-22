/**
 * @file preOpinion.api.ts
 * @description 사전 의견 API 요청 함수
 */

import { api } from '@/api/client'
import { PRE_OPINION_ENDPOINTS } from '@/features/pre-opinion/preOpinion.endpoints'
import {
  getMockPreOpinionAnswers,
  getMockPreOpinionDetail,
} from '@/features/pre-opinion/preOpinion.mock'
import type {
  DeleteMyPreOpinionAnswerParams,
  GetPreOpinionAnswersParams,
  GetPreOpinionParams,
  GetPreOpinionResponse,
  PreOpinionAnswersData,
  SavePreOpinionBody,
  SavePreOpinionParams,
  SubmitPreOpinionBody,
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

  return api.get<GetPreOpinionResponse>(PRE_OPINION_ENDPOINTS.DETAIL(gatheringId, meetingId))
}

/**
 * 사전 의견 저장
 *
 * @description
 * updatedAt이 null이면 최초 저장(POST), 값이 있으면 수정(PATCH)으로 요청합니다.
 *
 * @param params - 모임 ID, 약속 ID, 최초 저장 여부
 * @param body - 리뷰 평가 및 주제별 답변
 */
export const savePreOpinion = async (
  { gatheringId, meetingId, isFirstSave }: SavePreOpinionParams,
  body: SavePreOpinionBody
): Promise<void> => {
  if (USE_MOCK) return

  if (isFirstSave) {
    return api.post(PRE_OPINION_ENDPOINTS.CREATE(gatheringId, meetingId), body)
  }
  return api.patch(PRE_OPINION_ENDPOINTS.UPDATE(gatheringId, meetingId), body)
}

/**
 * 사전 의견 공유(제출)
 *
 * @description
 * 작성한 사전 의견을 멤버들에게 공유합니다.
 *
 * @param gatheringId - 모임 ID
 * @param meetingId - 약속 ID
 * @param body - 리뷰 평가 및 제출할 주제 ID 목록
 */
export const submitPreOpinion = async (
  gatheringId: number,
  meetingId: number,
  body: SubmitPreOpinionBody
): Promise<void> => {
  if (USE_MOCK) return

  return api.patch(PRE_OPINION_ENDPOINTS.SUBMIT(gatheringId, meetingId), body)
}

/**
 * 사전 의견 목록 조회
 *
 * @description
 * 약속의 사전 의견 목록(멤버별 책 평가 + 주제 의견)을 조회합니다.
 *
 * @param params - 모임 ID와 약속 ID
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

  return api.get<PreOpinionAnswersData>(PRE_OPINION_ENDPOINTS.ANSWERS(gatheringId, meetingId))
}

/**
 * 내 사전 의견 삭제
 *
 * @description
 * 현재 로그인한 사용자의 사전 의견을 삭제합니다.
 *
 * @param params - 모임 ID와 약속 ID
 */
export const deleteMyPreOpinionAnswer = async (
  params: DeleteMyPreOpinionAnswerParams
): Promise<void> => {
  if (USE_MOCK) return

  const { gatheringId, meetingId } = params
  return api.delete(PRE_OPINION_ENDPOINTS.DELETE_MY_ANSWER(gatheringId, meetingId))
}
