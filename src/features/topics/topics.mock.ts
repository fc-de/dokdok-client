/**
 * @file topics.mock.ts
 * @description Topic API 목데이터
 */

import type {
  ConfirmedTopicItem,
  ConfirmTopicsResponse,
  GetConfirmedTopicsResponse,
  GetProposedTopicsResponse,
  ProposedTopicItem,
} from './topics.types'

/**
 * 제안된 주제 목데이터
 */
const mockProposedTopics: ProposedTopicItem[] = [
  {
    topicId: 1,
    meetingId: 1,
    title: '이 책의 핵심 메시지는 무엇인가?',
    description: '저자가 전달하고자 하는 핵심 메시지에 대해 토론합니다.',
    topicType: 'DISCUSSION',
    topicTypeLabel: '토론형',
    topicStatus: 'PROPOSED',
    likeCount: 25,
    isLiked: true,
    canDelete: true,
    createdByInfo: {
      userId: 1,
      nickname: '독서왕',
    },
  },
  {
    topicId: 2,
    meetingId: 1,
    title: '주인공의 심리 변화 과정',
    description: '주인공이 겪는 내면의 변화를 분석해봅시다.',
    topicType: 'CHARACTER_ANALYSIS',
    topicTypeLabel: '인물 분석형',
    topicStatus: 'PROPOSED',
    likeCount: 20,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 2,
      nickname: '문학소녀',
    },
  },
  {
    topicId: 3,
    meetingId: 1,
    title: '책을 읽고 느낀 감정 공유',
    description: '이 책을 읽으며 느낀 솔직한 감정들을 나눠요.',
    topicType: 'EMOTION',
    topicTypeLabel: '감정 공유형',
    topicStatus: 'PROPOSED',
    likeCount: 18,
    isLiked: true,
    canDelete: false,
    createdByInfo: {
      userId: 3,
      nickname: '감성독서',
    },
  },
  {
    topicId: 4,
    meetingId: 1,
    title: '작가의 문체와 서술 방식',
    description: '이 작품만의 독특한 문체와 서술 기법을 살펴봅니다.',
    topicType: 'STRUCTURE',
    topicTypeLabel: '구조 분석형',
    topicStatus: 'PROPOSED',
    likeCount: 15,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 4,
      nickname: '분석가',
    },
  },
  {
    topicId: 5,
    meetingId: 1,
    title: '비슷한 경험이 있었나요?',
    description: '책 속 상황과 유사한 개인적 경험을 공유해봐요.',
    topicType: 'EXPERIENCE',
    topicTypeLabel: '경험 연결형',
    topicStatus: 'PROPOSED',
    likeCount: 13,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 5,
      nickname: '공감왕',
    },
  },
  {
    topicId: 6,
    meetingId: 1,
    title: '이 책이 주는 교훈',
    description: '책을 통해 얻은 삶의 교훈을 이야기해봅시다.',
    topicType: 'DISCUSSION',
    topicTypeLabel: '토론형',
    topicStatus: 'PROPOSED',
    likeCount: 12,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 6,
      nickname: '철학자',
    },
  },
  {
    topicId: 7,
    meetingId: 1,
    title: '현대 사회와의 연결고리',
    description: '작품 속 이야기가 현대 사회와 어떻게 연결되는지 논의합니다.',
    topicType: 'COMPARISON',
    topicTypeLabel: '비교 분석형',
    topicStatus: 'PROPOSED',
    likeCount: 10,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 7,
      nickname: '사회학도',
    },
  },
  {
    topicId: 8,
    meetingId: 1,
    title: '인상 깊었던 장면',
    description: '가장 인상 깊었던 장면과 그 이유를 공유해요.',
    topicType: 'EMOTION',
    topicTypeLabel: '감정 공유형',
    topicStatus: 'PROPOSED',
    likeCount: 9,
    isLiked: true,
    canDelete: false,
    createdByInfo: {
      userId: 8,
      nickname: '열정독서',
    },
  },
  {
    topicId: 9,
    meetingId: 1,
    title: '작가가 전달하려던 메시지',
    description: '작가의 의도와 숨겨진 메시지를 파헤쳐봅시다.',
    topicType: 'IN_DEPTH',
    topicTypeLabel: '심층 분석형',
    topicStatus: 'PROPOSED',
    likeCount: 8,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 9,
      nickname: '심층분석가',
    },
  },
  {
    topicId: 10,
    meetingId: 1,
    title: '다른 작품과의 비교',
    description: '비슷한 주제의 다른 작품들과 비교해봅시다.',
    topicType: 'COMPARISON',
    topicTypeLabel: '비교 분석형',
    topicStatus: 'PROPOSED',
    likeCount: 7,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 10,
      nickname: '비교문학',
    },
  },
  {
    topicId: 11,
    meetingId: 1,
    title: '등장인물들의 관계',
    description: '등장인물들 간의 복잡한 관계를 분석합니다.',
    topicType: 'CHARACTER_ANALYSIS',
    topicTypeLabel: '인물 분석형',
    topicStatus: 'PROPOSED',
    likeCount: 6,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 11,
      nickname: '관계분석',
    },
  },
  {
    topicId: 12,
    meetingId: 1,
    title: '책의 배경과 시대상',
    description: '작품의 배경이 되는 시대와 사회상을 이해해봅시다.',
    topicType: 'STRUCTURE',
    topicTypeLabel: '구조 분석형',
    topicStatus: 'PROPOSED',
    likeCount: 5,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 12,
      nickname: '역사탐구',
    },
  },
  {
    topicId: 13,
    meetingId: 1,
    title: '이 책으로 만든 창작물',
    description: '책에서 영감을 받아 짧은 글이나 그림을 만들어봐요.',
    topicType: 'CREATIVE',
    topicTypeLabel: '창작형',
    topicStatus: 'PROPOSED',
    likeCount: 4,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 13,
      nickname: '창작러',
    },
  },
  {
    topicId: 14,
    meetingId: 1,
    title: '나라면 어떻게 했을까?',
    description: '주인공의 입장이 되어 나의 선택을 상상해봅시다.',
    topicType: 'EXPERIENCE',
    topicTypeLabel: '경험 연결형',
    topicStatus: 'PROPOSED',
    likeCount: 3,
    isLiked: true,
    canDelete: false,
    createdByInfo: {
      userId: 14,
      nickname: '상상력',
    },
  },
  {
    topicId: 15,
    meetingId: 1,
    title: '책의 결말에 대한 생각',
    description: '책의 결말이 적절했는지, 다른 결말은 없었을지 토론합니다.',
    topicType: 'DISCUSSION',
    topicTypeLabel: '토론형',
    topicStatus: 'PROPOSED',
    likeCount: 2,
    isLiked: false,
    canDelete: false,
    createdByInfo: {
      userId: 15,
      nickname: '결말탐구',
    },
  },
]

/**
 * 확정된 주제 목데이터
 */
const mockConfirmedTopics: ConfirmedTopicItem[] = [
  {
    topicId: 20,
    title: '데미안에서 자기 자신이란?',
    description: '주인공이 찾아가는 자아의 의미를 탐구합니다.',
    topicType: 'IN_DEPTH',
    topicTypeLabel: '심층 분석형',
    likeCount: 5,
    confirmOrder: 1,
    createdByInfo: {
      userId: 1,
      nickname: '독서왕',
    },
  },
  {
    topicId: 21,
    title: '새와 알의 상징',
    description: '작품 속 핵심 상징인 새와 알이 의미하는 바를 논의합니다.',
    topicType: 'DISCUSSION',
    topicTypeLabel: '토론형',
    likeCount: 5,
    confirmOrder: 2,
    createdByInfo: {
      userId: 2,
      nickname: '문학소녀',
    },
  },
  {
    topicId: 22,
    title: '싱클레어의 성장 과정',
    description: '주인공 싱클레어의 정신적 성장을 단계별로 분석합니다.',
    topicType: 'CHARACTER_ANALYSIS',
    topicTypeLabel: '인물 분석형',
    likeCount: 5,
    confirmOrder: 3,
    createdByInfo: {
      userId: 3,
      nickname: '감성독서',
    },
  },
  {
    topicId: 23,
    title: '빛과 어둠의 이중성',
    description: '작품 속에서 빛과 어둠이 상징하는 의미를 탐구합니다.',
    topicType: 'IN_DEPTH',
    topicTypeLabel: '심층 분석형',
    likeCount: 5,
    confirmOrder: 4,
    createdByInfo: {
      userId: 4,
      nickname: '분석가',
    },
  },
  {
    topicId: 24,
    title: '데미안이라는 인물의 의미',
    description: '데미안이 싱클레어에게 미친 영향을 분석합니다.',
    topicTypeLabel: '인물 분석형',
    likeCount: 5,
    topicType: 'CHARACTER_ANALYSIS',
    confirmOrder: 5,
    createdByInfo: {
      userId: 5,
      nickname: '공감왕',
    },
  },
  {
    topicId: 25,
    title: '아브락사스의 상징',
    description: '선과 악을 초월한 신, 아브락사스의 의미를 논의합니다.',
    topicType: 'DISCUSSION',
    topicTypeLabel: '토론형',
    likeCount: 2,
    confirmOrder: 6,
    createdByInfo: {
      userId: 6,
      nickname: '철학자',
    },
  },
  {
    topicId: 26,
    title: '꿈과 현실의 경계',
    description: '작품 속 꿈과 현실이 혼재하는 장면들을 분석합니다.',
    topicType: 'STRUCTURE',
    topicTypeLabel: '구조 분석형',
    likeCount: 1,
    confirmOrder: 7,
    createdByInfo: {
      userId: 7,
      nickname: '사회학도',
    },
  },
  {
    topicId: 27,
    title: '에바 부인의 역할',
    description: '싱클레어의 정신적 어머니 역할을 한 에바 부인을 논의합니다.',
    topicType: 'CHARACTER_ANALYSIS',
    topicTypeLabel: '인물 분석형',
    likeCount: 0,
    confirmOrder: 8,
    createdByInfo: {
      userId: 8,
      nickname: '열정독서',
    },
  },
  {
    topicId: 28,
    title: '종교적 상징과 의미',
    description: '작품에 나타난 다양한 종교적 상징들을 탐구합니다.',
    topicType: 'IN_DEPTH',
    topicTypeLabel: '심층 분석형',
    likeCount: 5,
    confirmOrder: 9,
    createdByInfo: {
      userId: 9,
      nickname: '심층분석가',
    },
  },
  {
    topicId: 29,
    title: '성장소설로서의 데미안',
    description: '성장소설 장르로서 데미안이 가진 특징을 분석합니다.',
    topicType: 'STRUCTURE',
    topicTypeLabel: '구조 분석형',
    likeCount: 5,
    confirmOrder: 10,
    createdByInfo: {
      userId: 10,
      nickname: '비교문학',
    },
  },
]

/**
 * 제안된 주제 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 제안된 주제 목데이터를 커서 기반 페이지네이션 형태로 반환합니다.
 */
export const getMockProposedTopics = (
  pageSize: number = 10,
  cursorLikeCount?: number,
  cursorTopicId?: number
): GetProposedTopicsResponse => {
  let items = [...mockProposedTopics]

  // 커서가 있으면 해당 커서 이후의 데이터만 필터링
  if (cursorLikeCount !== undefined && cursorTopicId !== undefined) {
    const cursorIndex = items.findIndex(
      (item) => item.likeCount === cursorLikeCount && item.topicId === cursorTopicId
    )
    if (cursorIndex !== -1) {
      items = items.slice(cursorIndex + 1)
    }
  }

  // 페이지 크기만큼 자르기
  const pageItems = items.slice(0, pageSize)
  const hasNext = items.length > pageSize

  // 다음 커서 생성
  const nextCursor =
    hasNext && pageItems.length > 0
      ? {
          likeCount: pageItems[pageItems.length - 1].likeCount,
          topicId: pageItems[pageItems.length - 1].topicId,
        }
      : null

  return {
    items: pageItems,
    pageSize,
    hasNext,
    nextCursor,
    totalCount: cursorLikeCount === undefined ? mockProposedTopics.length : undefined,
    actions: {
      canConfirm: true,
      canSuggest: true,
    },
  }
}

/**
 * 확정된 주제 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 확정된 주제 목데이터를 커서 기반 페이지네이션 형태로 반환합니다.
 */
export const getMockConfirmedTopics = (
  pageSize: number = 10,
  cursorConfirmOrder?: number,
  cursorTopicId?: number
): GetConfirmedTopicsResponse => {
  let items = [...mockConfirmedTopics]

  // 커서가 있으면 해당 커서 이후의 데이터만 필터링
  if (cursorConfirmOrder !== undefined && cursorTopicId !== undefined) {
    const cursorIndex = items.findIndex(
      (item) => item.confirmOrder === cursorConfirmOrder && item.topicId === cursorTopicId
    )
    if (cursorIndex !== -1) {
      items = items.slice(cursorIndex + 1)
    }
  }

  // 페이지 크기만큼 자르기
  const pageItems = items.slice(0, pageSize)
  const hasNext = items.length > pageSize

  // 다음 커서 생성
  const nextCursor =
    hasNext && pageItems.length > 0
      ? {
          confirmOrder: pageItems[pageItems.length - 1].confirmOrder,
          topicId: pageItems[pageItems.length - 1].topicId,
        }
      : null

  return {
    items: pageItems,
    pageSize,
    hasNext,
    nextCursor,
    totalCount: cursorConfirmOrder === undefined ? mockConfirmedTopics.length : undefined,
    actions: {
      canViewPreOpinions: true,
      canWritePreOpinions: false,
    },
  }
}

/**
 * 주제 확정 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 주제 확정 응답 목데이터를 반환합니다.
 */
export const getMockConfirmTopics = (
  meetingId: number,
  topicIds: number[]
): ConfirmTopicsResponse => {
  return {
    meetingId,
    topicStatus: 'CONFIRMED',
    topics: topicIds.map((topicId, index) => ({
      topicId,
      confirmOrder: index + 1,
    })),
  }
}
