/**
 * @file personalRetrospective.api.ts
 * @description 개인 회고 API 요청 함수
 */

import { api } from '@/api/client'

import { PERSONAL_RETROSPECTIVE_ENDPOINTS } from './personalRetrospective.endpoints'
import { getMockPersonalRetrospectiveDetail } from './personalRetrospective.mock'
import type {
  GetPersonalRetrospectiveParams,
  GetPersonalRetrospectiveResponse,
} from './personalRetrospective.types'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 개인 회고 조회
 *
 * @description
 * 약속에 대한 개인 회고 정보를 조회합니다.
 * 모임명, 책 정보, 내 사전 의견, 확정된 토픽, 참여 멤버 목록을 포함합니다.
 *
 * @param params - 모임 ID와 약속 ID
 *
 * @returns 개인 회고 응답 데이터
 */
export const getPersonalRetrospective = async ({
  gatheringId,
  meetingId,
}: GetPersonalRetrospectiveParams): Promise<GetPersonalRetrospectiveResponse> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockPersonalRetrospectiveDetail()
  }

  const data = await api.get<GetPersonalRetrospectiveResponse>(
    PERSONAL_RETROSPECTIVE_ENDPOINTS.DETAIL(gatheringId, meetingId)
  )

  return {
    ...data,
    preOpinions: data.preOpinions ?? [],
    topics: data.topics ?? [],
    meetingMembers: data.meetingMembers ?? [],
  }
}
