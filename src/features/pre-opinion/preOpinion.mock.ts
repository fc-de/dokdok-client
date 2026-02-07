/**
 * @file preOpinion.mock.ts
 * @description 사전 의견 API 목데이터
 */

import type { GetPreOpinionResponse } from '@/features/pre-opinion/preOpinion.types'

/**
 * 사전 의견 조회 목데이터
 */
const mockPreOpinionDetail: GetPreOpinionResponse = {
  book: {
    bookId: 10,
    title: '아주 작은 습관의 힘',
    author: '제임스 클리어',
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
