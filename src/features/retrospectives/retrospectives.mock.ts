/**
 * @file retrospectives.mock.ts
 * @description Retrospectives API 목데이터
 */

import type {
  CollectedAnswerItem,
  GetCollectedAnswersResponse,
  RetrospectiveSummaryResponse,
  UpdateSummaryRequest,
} from './retrospectives.types'

/**
 * 수집된 사전 의견 목데이터
 */
const mockCollectedAnswers: CollectedAnswerItem[] = [
  {
    userId: 1,
    nickname: '곰곰',
    profileImageUrl: 'https://i.pravatar.cc/150?img=1',
    topics: [
      {
        topicId: 1,
        title: '가짜욕망, 유사 욕망',
        confirmOrder: 1,
        answerId: 101,
        content:
          '이 책에서 가장 인상 깊었던 부분은 우리가 흔히 자신의 욕망이라고 생각하는 것들이 실제로는 타인의 욕망을 모방한 것일 수 있다는 점이었습니다. 저도 제 삶을 돌아보니 많은 선택들이 타인의 시선과 기대를 의식한 결과였던 것 같아요.',
      },
      {
        topicId: 2,
        title: '진정한 자아 찾기',
        confirmOrder: 2,
        answerId: 102,
        content:
          '진정한 자아를 찾는다는 것은 결국 타인의 욕망에서 벗어나 내가 진정으로 원하는 것이 무엇인지 깨닫는 과정인 것 같습니다. 이 책을 읽으며 그동안 무의식적으로 따라온 욕망들을 의식적으로 바라볼 수 있게 되었어요.',
      },
    ],
  },
  {
    userId: 2,
    nickname: '독서왕',
    profileImageUrl: 'https://i.pravatar.cc/150?img=2',
    topics: [
      {
        topicId: 1,
        title: '가짜욕망, 유사 욕망',
        confirmOrder: 1,
        answerId: 103,
        content:
          '현대 사회에서 SNS를 통해 타인의 삶을 끊임없이 들여다보게 되면서 욕망의 모방이 더욱 심화되고 있다고 생각합니다. 저도 모르게 타인의 성공을 부러워하며 그들과 같은 삶을 살아야 한다고 생각했던 것 같아요.',
      },
      {
        topicId: 2,
        title: '진정한 자아 찾기',
        confirmOrder: 2,
        answerId: 104,
        content:
          '자아를 찾는 여정은 외부가 아닌 내부를 향한 탐구라는 점이 중요한 것 같습니다. 책에서 제시하는 방법론들을 실천해보며 저만의 욕망과 가치를 발견해나가고 있습니다.',
      },
    ],
  },
  {
    userId: 3,
    nickname: '문학소녀',
    profileImageUrl: 'https://i.pravatar.cc/150?img=3',
    topics: [
      {
        topicId: 1,
        title: '가짜욕망, 유사 욕망',
        confirmOrder: 1,
        answerId: 105,
        content:
          '욕망의 삼각형 이론이 정말 흥미로웠어요. 우리가 무언가를 욕망하는 이유가 그 대상 자체의 가치보다는 다른 누군가가 그것을 욕망하기 때문이라는 관점이 새로웠습니다.',
      },
      {
        topicId: 2,
        title: '진정한 자아 찾기',
        confirmOrder: 2,
        answerId: 106,
        content:
          '진정한 자아란 고정된 실체가 아니라 끊임없이 발견하고 구성해나가는 과정이라는 생각이 들었어요. 이 책이 그 여정의 좋은 나침반이 되어줄 것 같습니다.',
      },
    ],
  },
  {
    userId: 4,
    nickname: '분석가',
    profileImageUrl: 'https://i.pravatar.cc/150?img=4',
    topics: [
      {
        topicId: 1,
        title: '가짜욕망, 유사 욕망',
        confirmOrder: 1,
        answerId: 107,
        content:
          '르네 지라르의 미메틱 이론을 통해 욕망의 메커니즘을 분석한 부분이 인상적이었습니다. 사회학적 관점에서 욕망을 바라보니 개인의 선택이라고 생각했던 것들이 실은 사회적 구조의 산물임을 깨달았어요.',
      },
    ],
  },
  {
    userId: 5,
    nickname: '공감왕',
    profileImageUrl: 'https://i.pravatar.cc/150?img=5',
    topics: [
      {
        topicId: 1,
        title: '가짜욕망, 유사 욕망',
        confirmOrder: 1,
        answerId: 108,
        content:
          '책을 읽으며 저의 많은 욕망들이 실제로는 제 것이 아니었다는 것을 깨달았습니다. 특히 직업 선택이나 인생 목표에서 부모님과 주변의 기대가 얼마나 큰 영향을 미쳤는지 생각해보게 되었어요.',
      },
      {
        topicId: 2,
        title: '진정한 자아 찾기',
        confirmOrder: 2,
        answerId: 109,
        content:
          '자아를 찾기 위해서는 용기가 필요하다는 것을 느꼈습니다. 타인의 시선과 기대에서 벗어나 나만의 길을 가는 것은 외롭고 두려운 일이지만, 그만큼 가치 있는 여정인 것 같아요.',
      },
    ],
  },
  {
    userId: 6,
    nickname: '철학자',
    profileImageUrl: 'https://i.pravatar.cc/150?img=6',
    topics: [
      {
        topicId: 1,
        title: '가짜욕망, 유사 욕망',
        confirmOrder: 1,
        answerId: 110,
        content:
          '플라톤의 동굴 비유와 연결지어 생각해보면, 우리가 욕망하는 많은 것들이 실체가 아닌 그림자일 수 있다는 점이 흥미롭습니다. 진정한 욕망에 도달하기 위해서는 먼저 그림자를 욕망하고 있음을 인식해야 하겠죠.',
      },
    ],
  },
  {
    userId: 7,
    nickname: '사회학도',
    profileImageUrl: 'https://i.pravatar.cc/150?img=7',
    topics: [
      {
        topicId: 2,
        title: '진정한 자아 찾기',
        confirmOrder: 2,
        answerId: 111,
        content:
          '개인주의와 집단주의 사이에서 균형을 찾는 것이 중요하다고 생각합니다. 완전히 타인의 영향에서 벗어난 순수한 자아란 존재하기 어렵지만, 그럼에도 나만의 중심을 찾는 노력은 필요한 것 같아요.',
      },
    ],
  },
  {
    userId: 8,
    nickname: '열정독서',
    profileImageUrl: 'https://i.pravatar.cc/150?img=8',
    topics: [
      {
        topicId: 1,
        title: '가짜욕망, 유사 욕망',
        confirmOrder: 1,
        answerId: 112,
        content:
          '광고와 미디어가 우리의 욕망을 어떻게 조작하는지에 대한 분석이 매우 예리했습니다. 앞으로는 더 비판적인 시각으로 소비 문화를 바라볼 수 있을 것 같아요.',
      },
      {
        topicId: 2,
        title: '진정한 자아 찾기',
        confirmOrder: 2,
        answerId: 113,
        content:
          '명상과 성찰의 시간을 통해 내면의 목소리에 귀 기울이는 것이 중요하다고 느꼈습니다. 바쁜 일상 속에서도 자신과 대화하는 시간을 만들어야겠어요.',
      },
    ],
  },
]

// ─── 회고 요약 목데이터 ───

const defaultSummaryTopics: RetrospectiveSummaryResponse['topics'] = [
  {
    topicId: 1,
    confirmOrder: 1,
    topicTitle: '가짜욕망, 유사 욕망',
    topicDescription: '우리가 흔히 자신의 욕망이라고 생각하는 것들의 본질에 대해 이야기해봅시다.',
    summary:
      '참여자들은 르네 지라르의 미메틱 이론을 중심으로 현대 사회에서의 욕망 모방 현상에 대해 깊이 있는 토론을 진행했습니다. SNS와 미디어가 욕망의 모방을 심화시키고 있으며, 개인의 선택이라고 생각했던 많은 것들이 실제로는 사회적 구조의 산물임을 공유했습니다.',
    keyPoints: [
      {
        title: '욕망의 삼각형 이론',
        details: [
          '무언가를 욕망하는 이유가 대상 자체의 가치보다 타인이 그것을 욕망하기 때문이라는 관점 공유',
          '플라톤의 동굴 비유와 연결하여 욕망의 실체와 그림자에 대한 논의',
        ],
      },
      {
        title: 'SNS와 욕망의 모방',
        details: [
          '타인의 삶을 끊임없이 들여다보며 욕망이 더욱 심화되는 현상',
          '광고와 미디어가 소비 욕구를 조작하는 메커니즘 분석',
        ],
      },
      {
        title: '개인적 경험과 성찰',
        details: [
          '직업 선택이나 인생 목표에서 부모님과 주변의 기대가 미친 영향 공유',
          '무의식적으로 따라온 욕망들을 의식적으로 바라보게 된 경험',
        ],
      },
    ],
  },
  {
    topicId: 2,
    confirmOrder: 2,
    topicTitle: '진정한 자아 찾기',
    topicDescription: '타인의 욕망에서 벗어나 진정한 자아를 찾는 방법에 대해 논의합니다.',
    summary:
      '진정한 자아를 찾는 과정은 외부가 아닌 내부를 향한 탐구이며, 고정된 실체가 아니라 끊임없이 발견하고 구성해나가는 여정이라는 데 공감대가 형성되었습니다. 용기와 성찰의 시간이 필요하다는 의견이 주를 이루었습니다.',
    keyPoints: [
      {
        title: '자아 탐구의 방향',
        details: [
          '진정한 자아는 외부가 아닌 내부를 향한 탐구에서 시작',
          '고정된 실체가 아닌 끊임없이 구성해나가는 과정으로 이해',
        ],
      },
      {
        title: '실천 방법',
        details: [
          '명상과 성찰의 시간을 통해 내면의 목소리에 귀 기울이기',
          '바쁜 일상 속에서도 자신과 대화하는 시간 확보의 중요성',
        ],
      },
    ],
  },
]

/** meetingId별 회고 요약 목데이터 저장소 */
const mockSummaryByMeeting: Record<number, RetrospectiveSummaryResponse> = {}

const getOrCreateMockSummary = (meetingId: number): RetrospectiveSummaryResponse => {
  if (!mockSummaryByMeeting[meetingId]) {
    mockSummaryByMeeting[meetingId] = {
      meetingId,
      isPublished: false,
      publishedAt: null,
      topics: structuredClone(defaultSummaryTopics),
    }
  }
  return mockSummaryByMeeting[meetingId]
}

/**
 * 회고 요약 목데이터 반환 함수
 */
export const getMockSummary = (meetingId: number): RetrospectiveSummaryResponse => {
  return structuredClone(getOrCreateMockSummary(meetingId))
}

/**
 * 회고 요약 수정 목데이터 처리
 */
export const mockUpdateSummary = (
  meetingId: number,
  data: UpdateSummaryRequest
): RetrospectiveSummaryResponse => {
  const current = getOrCreateMockSummary(meetingId)
  mockSummaryByMeeting[meetingId] = {
    ...current,
    topics: current.topics.map((topic) => {
      const updated = data.topics.find((t) => t.topicId === topic.topicId)
      if (!updated) return topic
      return {
        ...topic,
        summary: updated.summary,
        keyPoints: updated.keyPoints,
      }
    }),
  }
  return structuredClone(mockSummaryByMeeting[meetingId])
}

/**
 * 회고 요약 발행 목데이터 처리
 */
export const mockPublishSummary = (meetingId: number): RetrospectiveSummaryResponse => {
  const current = getOrCreateMockSummary(meetingId)
  mockSummaryByMeeting[meetingId] = {
    ...current,
    isPublished: true,
    publishedAt: new Date().toISOString(),
  }
  return structuredClone(mockSummaryByMeeting[meetingId])
}

// ─── 수집된 사전 의견 ───

/**
 * 수집된 사전 의견 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 수집된 사전 의견 목데이터를 커서 기반 페이지네이션 형태로 반환합니다.
 */
export const getMockCollectedAnswers = (
  pageSize: number = 10,
  cursorUserId?: number
): GetCollectedAnswersResponse => {
  let items = [...mockCollectedAnswers]

  // 커서가 있으면 해당 커서 이후의 데이터만 필터링
  if (cursorUserId !== undefined) {
    const cursorIndex = items.findIndex((item) => item.userId === cursorUserId)
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
          userId: pageItems[pageItems.length - 1].userId,
        }
      : null

  return {
    items: pageItems,
    pageSize,
    hasNext,
    nextCursor,
    totalCount: cursorUserId === undefined ? mockCollectedAnswers.length : undefined,
  }
}
