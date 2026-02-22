/**
 * @file preOpinion.mock.ts
 * @description 사전 의견 API 목데이터
 */

import type { GetPreOpinionResponse, PreOpinionAnswersData } from '@/features/pre-opinion/preOpinion.types'

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
        { topicId: 1, content: '이 책의 핵심 메시지는 자기 성찰이라고 생각합니다.' },
        { topicId: 2, content: '주인공이 선택의 기로에 서는 장면이 가장 인상 깊었습니다.' },
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
        { topicId: 1, content: null },
        { topicId: 2, content: '잔잔하지만 오래 남는 장면들이 많았습니다.' },
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

export const getMockPreOpinionAnswers = (): PreOpinionAnswersData => mockPreOpinionAnswers

/**
 * 사전 의견 조회 목데이터
 */
const mockPreOpinionDetail: GetPreOpinionResponse = {
  book: {
    bookId: 10,
    title: '아주 작은 습관의 힘',
    author: '제임스 클리어',
  },
  review: {
    reviewId: 1,
    bookId: 10,
    userId: 1,
    rating: 4.5,
    keywords: [
      { id: 47, name: '성장', type: 'BOOK' },
      { id: 10, name: '감동적인', type: 'IMPRESSION' },
    ],
  },
  preOpinion: {
    updatedAt: '2026-02-06T09:12:30',
    topics: [
      {
        topicId: 1,
        topicTitle: '책의 주요 메시지',
        topicDescription: '이 책에서 전달하고자 하는 핵심 메시지는 무엇인가요?',
        topicType: 'DISCUSSION',
        topicTypeLabel: '토론형',
        confirmOrder: 1,
        content: '이 책은 작은 행동의 반복이 인생을 바꾼다고 생각합니다.',
      },
      {
        topicId: 2,
        topicTitle: '인상 깊은 구절',
        topicDescription: '가장 인상 깊었던 문장을 공유해주세요.',
        topicType: 'EMOTION',
        topicTypeLabel: '감정 공유형',
        confirmOrder: 2,
        content: null,
      },
    ],
  },
}

/**
 * 사전 의견 조회 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 사전 의견 목데이터를 반환합니다.
 */
export const getMockPreOpinionDetail = (): GetPreOpinionResponse => {
  return mockPreOpinionDetail
}
