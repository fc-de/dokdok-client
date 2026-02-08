/**
 * @file preOpinions.mock.ts
 * @description 사전 의견 API 목데이터
 */

import type { PreOpinionAnswersData } from './preOpinions.types'

/**
 * 사전 의견 목록 목데이터
 */
const mockPreOpinionAnswers: PreOpinionAnswersData = {
  topics: [
    {
      topicId: 1,
      title: '책의 주요 메시지',
      description: '이 책에서 전달하고자 하는 핵심 메시지는 무엇인가요?',
      topicType: 'DISCUSSION',
      topicTypeLabel: '토론형',
      confirmOrder: 1,
    },
    {
      topicId: 2,
      title: '가장 인상 깊었던 장면',
      description: '책을 읽으며 가장 기억에 남았던 장면은 무엇인가요?',
      topicType: 'DISCUSSION',
      topicTypeLabel: '토론형',
      confirmOrder: 2,
    },
  ],
  members: [
    {
      memberInfo: {
        userId: 1,
        nickname: '독서왕',
        profileImage: 'https://picsum.photos/seed/user1/100/100',
        role: 'GATHERING_LEADER',
      },
      isSubmitted: true,
      bookReview: {
        rating: 4.5,
        keywordInfo: [
          { id: 3, name: '성장', type: 'BOOK' },
          { id: 7, name: '여운이 남는', type: 'IMPRESSION' },
        ],
      },
      topicOpinions: [
        {
          topicId: 1,
          content: '이 책의 핵심 메시지는 자기 성찰이라고 생각합니다.',
        },
        {
          topicId: 2,
          content: '주인공이 선택의 기로에 서는 장면이 가장 인상 깊었습니다.',
        },
      ],
    },
    {
      memberInfo: {
        userId: 10,
        nickname: '밤독서',
        profileImage: 'https://picsum.photos/seed/user3/100/100',
        role: 'MEETING_LEADER',
      },
      isSubmitted: true,
      bookReview: {
        rating: 3.0,
        keywordInfo: [
          { id: 5, name: '관계', type: 'BOOK' },
          { id: 7, name: '여운이 남는', type: 'IMPRESSION' },
        ],
      },
      topicOpinions: [
        {
          topicId: 1,
          content: null,
        },
        {
          topicId: 2,
          content: '잔잔하지만 오래 남는 장면들이 많았습니다.',
        },
      ],
    },
    {
      memberInfo: {
        userId: 2,
        nickname: '페이지러버',
        profileImage: 'https://picsum.photos/seed/user2/100/100',
        role: 'MEMBER',
      },
      isSubmitted: false,
      bookReview: null,
      topicOpinions: [],
    },
  ],
}

/**
 * 사전 의견 목록 목데이터 반환 함수
 */
export const getMockPreOpinionAnswers = (): PreOpinionAnswersData => {
  return mockPreOpinionAnswers
}
