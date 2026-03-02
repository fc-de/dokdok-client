/**
 * @file retrospectives.mock.ts
 * @description Retrospectives API 목데이터
 */

import type {
  CollectedAnswerItem,
  GetCollectedAnswersResponse,
  GetCommentsResponse,
  MeetingRetrospectiveDetailResponse,
  RetrospectiveComment,
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

/**
 * 약속회고 상세 목데이터
 */
const mockMeetingRetrospectiveDetail: MeetingRetrospectiveDetailResponse = {
  meetingId: 1,
  meetingName: '데미안을 읽어보아요 데미안을 읽어보아요 데미안을 읽어보아요 데미안을 읽어보아요',
  meetingDate: '2026-01-15',
  meetingTime: '19:00-20:00',
  meetingLeaderId: 123,
  gathering: {
    gatheringId: 1,
    gatheringName: '독서 모임',
  },
  topics: [
    {
      topicId: 1,
      confirmOrder: 1,
      topicTitle: '가짜 욕망, 유사 욕망',
      topicDescription: '가짜욕망, 유사욕망에 대해 이야기해봅시다.',
      summary:
        '참여자들은 『데미안』 속 싱클레어가 느꼈던 혼란을 자신들의 경험과 연결하며, 스스로의 욕망이라고 믿어왔던 선택들 중 상당수가 사회적 기대와 타인의 시선에서 비롯되었을 가능성에 대해 이야기했다. 진짜 욕망은 명확한 목표나 언어로 쉽게 설명되지 않으며, 오히려 불안과 책임을 함께 요구한다는 점에 공감이 모였다.',
      keyPoints: [
        {
          title: '사회가 만든 욕망의 구조',
          details: [
            '안정적인 직업, 성과, 인정 욕구가 개인의 욕망처럼 내면화된 경험 공유',
            '원해서 선택했다기보다 선택하지 않으면 불안해서 택했다는 표현이 반복됨',
          ],
        },
        {
          title: '유사 욕망과 진짜 욕망의 차이',
          details: [
            '유사 욕망은 비교와 평가 속에서 강화되고, 타인에게 인정받기 위한 것',
            '진짜 욕망은 오히려 혼자 은밀히 품게 되고, 선뜻 말하기 어렵다는 의견 교환',
          ],
        },
        {
          title: '욕망을 점검하는 기준',
          details: [
            '이 선택을 아무도 몰라도 똑같이 할 것인가?라는 질문이 제속됨',
            '불안해지더라도 포기하지 않는 것이 진짜 욕망인지 이야기 나눔',
          ],
        },
      ],
    },
    {
      topicId: 2,
      confirmOrder: 2,
      topicTitle: '선과 악, 현실과 연결고리',
      topicDescription: '현해서 선택했다기보다 선택하지 않으면 불안해서 택했다는 표현이 반복됨',
      summary:
        '참여자들은 데미안이 제시한 "선악은 절대적이 아니라 상황과 개인의 맥락에 따라 달라진다"는 메시지에 대해 깊이 공감하며, 현대 사회에서 겪는 도덕적 딜레마와 연결지어 생각했다. 특히 착한 아이로 살아온 경험이 있는 참여자들은 싱클레어의 내적 갈등을 통해 자신의 억압된 감정을 돌아보는 계기를 가졌다.',
      keyPoints: [
        {
          title: '선악 이분법의 한계',
          details: [
            '어린 시절 "착한 아이"로 살며 자신의 진짜 욕망을 억누른 경험 공유',
            '선과 악은 환경과 관점에 따라 달라질 수 있다는 점에 대한 논의',
          ],
        },
        {
          title: '억압된 감정과 그림자',
          details: [
            '융의 그림자 개념과 연결하여, 우리 안의 어두운 면을 인정하는 것의 중요성 강조',
            '감정을 억누르면 오히려 왜곡된 형태로 표출될 수 있다는 의견 교환',
          ],
        },
      ],
    },
  ],
}

/**
 * 약속회고 상세 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 약속회고 상세 목데이터를 반환합니다.
 */
export const getMockMeetingRetrospectiveDetail = (): MeetingRetrospectiveDetailResponse => {
  return mockMeetingRetrospectiveDetail
}

/**
 * 약속회고 댓글 목데이터
 */
const mockComments: RetrospectiveComment[] = [
  {
    commentId: 1,
    userId: 1,
    nickname: '곰곰',
    profileImageUrl: 'https://i.pravatar.cc/150?img=1',
    comment:
      '모임 하기 전엔 욕망에 대해 단순하게 생각했는데, 누구의 이런 말을 듣고 생각이 많이 바뀌었어요. 정말 좋은 논의였습니다.',
    createdAt: '2026-01-15T20:30:00',
  },
  {
    commentId: 2,
    userId: 2,
    nickname: '독서왕',
    profileImageUrl: 'https://i.pravatar.cc/150?img=2',
    comment: '이번 회고를 통해 제 자신을 돌아볼 수 있는 시간이었어요. 감사합니다!',
    createdAt: '2026-01-15T20:25:00',
  },
  {
    commentId: 3,
    userId: 3,
    nickname: '문학소녀',
    profileImageUrl: 'https://i.pravatar.cc/150?img=3',
    comment:
      '데미안의 메시지가 우리 삶과 이렇게 연결될 수 있다는 점이 놀라웠습니다. 다음 모임도 기대됩니다.',
    createdAt: '2026-01-15T20:20:00',
  },
  {
    commentId: 4,
    userId: 4,
    nickname: '분석가',
    profileImageUrl: 'https://i.pravatar.cc/150?img=4',
    comment: '사회적 욕망과 개인의 욕망을 구분하는 기준에 대한 논의가 특히 인상 깊었어요.',
    createdAt: '2026-01-15T20:15:00',
  },
  {
    commentId: 5,
    userId: 5,
    nickname: '공감왕',
    profileImageUrl: 'https://i.pravatar.cc/150?img=5',
    comment: '다들 솔직하게 자신의 경험을 나눠주셔서 감동적이었습니다. 저도 많은 용기를 얻었어요.',
    createdAt: '2026-01-15T20:10:00',
  },
  {
    commentId: 6,
    userId: 6,
    nickname: '철학자',
    profileImageUrl: 'https://i.pravatar.cc/150?img=6',
    comment: '플라톤의 동굴 비유와 연결하니 더 깊은 이해가 되었습니다. 좋은 통찰이었어요.',
    createdAt: '2026-01-15T20:05:00',
  },
  {
    commentId: 7,
    userId: 7,
    nickname: '사회학도',
    profileImageUrl: 'https://i.pravatar.cc/150?img=7',
    comment: '개인과 사회의 관계에 대해 다시 한번 생각해보게 되었습니다.',
    createdAt: '2026-01-15T20:00:00',
  },
  {
    commentId: 8,
    userId: 8,
    nickname: '열정독서',
    profileImageUrl: 'https://i.pravatar.cc/150?img=8',
    comment: '명상과 성찰의 중요성을 다시 깨달았어요. 실천해봐야겠습니다.',
    createdAt: '2026-01-15T19:55:00',
  },
  {
    commentId: 9,
    userId: 1,
    nickname: '곰곰',
    profileImageUrl: 'https://i.pravatar.cc/150?img=1',
    comment: '다음 모임에서도 이렇게 깊이 있는 대화를 나눌 수 있었으면 좋겠어요.',
    createdAt: '2026-01-15T19:50:00',
  },
  {
    commentId: 10,
    userId: 2,
    nickname: '독서왕',
    profileImageUrl: 'https://i.pravatar.cc/150?img=2',
    comment: '회고 요약이 잘 정리되어 있어서 다시 읽어보기 좋네요!',
    createdAt: '2026-01-15T19:45:00',
  },
  {
    commentId: 11,
    userId: 3,
    nickname: '문학소녀',
    profileImageUrl: 'https://i.pravatar.cc/150?img=3',
    comment: '진짜 욕망을 찾는 여정, 함께 할 수 있어서 의미 있었습니다.',
    createdAt: '2026-01-15T19:40:00',
  },
  {
    commentId: 12,
    userId: 4,
    nickname: '분석가',
    profileImageUrl: 'https://i.pravatar.cc/150?img=4',
    comment: '이론적 접근과 실제 경험이 잘 조화된 논의였어요.',
    createdAt: '2026-01-15T19:35:00',
  },
  {
    commentId: 13,
    userId: 5,
    nickname: '공감왕',
    profileImageUrl: 'https://i.pravatar.cc/150?img=5',
    comment: '모두의 이야기를 들으며 제 자신도 성장한 것 같아요. 감사합니다.',
    createdAt: '2026-01-15T19:30:00',
  },
  {
    commentId: 14,
    userId: 6,
    nickname: '철학자',
    profileImageUrl: 'https://i.pravatar.cc/150?img=6',
    comment: '철학적 사유가 일상과 만나는 순간, 정말 아름다웠습니다.',
    createdAt: '2026-01-15T19:25:00',
  },
  {
    commentId: 15,
    userId: 7,
    nickname: '사회학도',
    profileImageUrl: 'https://i.pravatar.cc/150?img=7',
    comment: '사회학적 관점에서 바라본 욕망 구조, 흥미로웠어요.',
    createdAt: '2026-01-15T19:20:00',
  },
]

/**
 * 약속회고 댓글 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 댓글 목데이터를 커서 기반 페이지네이션 형태로 반환합니다.
 */
export const getMockComments = (
  pageSize: number = 10,
  cursorCreatedAt?: string,
  cursorCommentId?: number
): GetCommentsResponse => {
  let items = [...mockComments]

  // 커서가 있으면 해당 커서 이후의 데이터만 필터링
  if (cursorCreatedAt !== undefined && cursorCommentId !== undefined) {
    const cursorIndex = items.findIndex(
      (item) => item.createdAt === cursorCreatedAt && item.commentId === cursorCommentId
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
          createdAt: pageItems[pageItems.length - 1].createdAt,
          commentId: pageItems[pageItems.length - 1].commentId,
        }
      : null

  return {
    items: pageItems,
    pageSize,
    hasNext,
    nextCursor,
    totalCount: cursorCreatedAt === undefined ? mockComments.length : undefined,
  }
}
