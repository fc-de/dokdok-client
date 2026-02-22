/**
 * @file personalRetrospective.mock.ts
 * @description 개인 회고 API 목데이터
 */

import type { GetPersonalRetrospectiveResponse } from './personalRetrospective.types'

/**
 * 개인 회고 조회 목데이터
 */
const mockPersonalRetrospectiveDetail: GetPersonalRetrospectiveResponse = {
  gatheringName: '책을 읽자',
  bookTitle: '데미안',
  bookAuthor: '헤르만 헤세',
  meetingId: 1,
  preOpinions: [
    {
      topicId: 1,
      topicName: '깨끗한 코드',
      content: '사전 의견 내용을 작성합니다.',
    },
  ],
  topics: [
    {
      topicId: 1,
      topicName: '깨끗한 코드',
      confirmOrder: 1,
    },
  ],
  meetingMembers: [
    {
      meetingMemberId: 10,
      nickname: '독서왕',
      profileImage: 'https://example.com/profile.jpg',
    },
  ],
}

/**
 * 개인 회고 조회 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 개인 회고 목데이터를 반환합니다.
 */
export const getMockPersonalRetrospectiveDetail = (): GetPersonalRetrospectiveResponse => {
  return mockPersonalRetrospectiveDetail
}
