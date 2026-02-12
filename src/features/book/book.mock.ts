/**
 * @file book.mock.ts
 * @description Book API 목데이터
 */

import type {
  BookDetail,
  BookListItem,
  BookReview,
  CreateBookRecordBody,
  CreateBookReviewBody,
  GetBookRecordsParams,
  GetBookRecordsResponse,
  GetBookReviewHistoryResponse,
  GetBooksParams,
  GetBooksResponse,
  GetGatheringsResponse,
  PersonalRecord,
  UpdateBookRecordBody,
} from './book.types'

// ============================================================
// Mock Data
// ============================================================

const mockBookDetail: BookDetail = {
  bookId: 1,
  title: '물고기는 존재하지 않는다',
  publisher: '곰출판',
  authors: '룰루 밀러',
  bookReadingStatus: 'READING',
  thumbnail: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791189327156.jpg',
}

const mockBookListItems: BookListItem[] = [
  {
    bookId: 1,
    title: '우리에게는 매일 철학이 필요하다',
    publisher: '피터 홀린스',
    authors: '피터 홀린스',
    bookReadingStatus: 'READING',
    thumbnail: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791189327156.jpg',
    rating: 0.5,
    gatheringNames: ['책책책 책을 읽자', 'FCDE'],
  },
  {
    bookId: 2,
    title: '데미안',
    publisher: '민음사',
    authors: '헤르만 헤세',
    bookReadingStatus: 'READING',
    thumbnail: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937460449.jpg',
    rating: 4.5,
    gatheringNames: ['주말 독서 모임'],
  },
  {
    bookId: 3,
    title: '1984',
    publisher: '민음사',
    authors: '조지 오웰',
    bookReadingStatus: 'COMPLETED',
    thumbnail:
      'https://i.namu.wiki/i/OuId9i6YhTdBIk5XDIZWVre8GtdOv_OaaXSL_WlGUvPisTnbN2jwn0lf_b8sJp_bjBLoKgl6Fa4-enbgZJIRLA.webp',
    rating: 5,
    gatheringNames: [],
  },
]

const mockBookReview: BookReview = {
  reviewId: 1,
  bookId: 1,
  userId: 1,
  rating: 3.5,
  keywords: [
    { id: 3, name: '감동', type: 'BOOK' },
    { id: 7, name: '몰입', type: 'IMPRESSION' },
  ],
  createdAt: '2026-01-11T10:00:00',
}

const mockGatheringsResponse: GetGatheringsResponse = {
  items: [
    {
      gatheringId: 1,
      gatheringName: '책책책 책을 읽자',
      isFavorite: false,
      gatheringStatus: 'ACTIVE',
      totalMembers: 5,
      totalMeetings: 3,
      currentUserRole: 'LEADER',
      daysFromJoined: 30,
    },
    {
      gatheringId: 2,
      gatheringName: '주말 독서 모임 어쩌구저쩌구',
      isFavorite: true,
      gatheringStatus: 'ACTIVE',
      totalMembers: 8,
      totalMeetings: 2,
      currentUserRole: 'MEMBER',
      daysFromJoined: 45,
    },
    {
      gatheringId: 3,
      gatheringName: '고전 문학 탐독',
      isFavorite: false,
      gatheringStatus: 'INACTIVE',
      totalMembers: 3,
      totalMeetings: 1,
      currentUserRole: 'MEMBER',
      daysFromJoined: 60,
    },
  ],
  pageSize: 10,
  hasNext: false,
  nextCursor: null,
}

const mockBookRecordsResponse: GetBookRecordsResponse = {
  personalRecords: [
    {
      recordId: 1,
      recordType: 'MEMO',
      recordContent: '이 책에서 가장 인상 깊었던 부분은 물고기 분류학자의 이야기였다.',
      meta: {},
      bookId: 1,
      createdAt: '2026-01-05T14:30:00',
    },
    {
      recordId: 2,
      recordType: 'QUOTE',
      recordContent:
        '이 부분을 읽으면서 선과 악을 나누는 이야기라기보다 "보여주는 나"와 "숨기는 나"에 대한 이야기처럼 느껴졌다.\n나는 그동안 어두운 쪽을 없애야 할 문제라고만 생각했지, 그게 이미 나의 일부일 수 있다는 생각은 잘 안 했던 것 같다.',
      meta: {
        page: '4~6p',
        excerpt:
          '인간은 언제나 두 세계 사이에서 흔들린다. 하나는 이미 규칙이 정해진 안전한 세계이고, 다른 하나는 아직 이름 붙일 수 없는 혼란의 세계다.\n대부분의 사람들은 안전한 세계를 선택했다고 믿지만, 사실은 선택조차 하지 않은 채 그 안에 머문다.\n혼란을 두려워하기 때문이 아니라, 혼란 속에서 자신을 마주하는 일이 가장 어렵기 때문이다.',
      },
      bookId: 1,
      createdAt: '2026-01-05T21:38:00',
    },
  ],
  meetingGroupRecords: [
    {
      meetingId: 1,
      meetingName: '데미안을 읽어보아요',
      meetingDate: '2026-01-15',
      meetingTime: '19:00-20:00',
      gathering: {
        gatheringId: 1,
        gatheringName: '책책책 책을 읽자',
      },
      topics: [
        {
          topicId: 1,
          confirmOrder: 1,
          topicTitle: '가짜 욕망, 유사 욕망',
          topicDescription: '가짜욕망, 유사욕망에 대해 이야기해봅시다.',
          summary: '참여자들은 『데미안』 속 싱클레어가 느꼈던 혼란을 자신들의 경험과 연결하며...',
          keyPoints: [
            {
              title: '사회가 만든 욕망의 구조',
              details: [
                '안정적인 직업, 성과, 인정 욕구가 개인의 욕망처럼 내면화된 경험 공유',
                '"원해서 선택했다"기보다 "선택하지 않으면 불안해서 택했다"는 표현이 반복됨',
              ],
            },
            {
              title: '유사 욕망과 진짜 욕망의 차이',
              details: [
                '유사 욕망은 비교와 평가 속에서 강화되며, 타인의 반응에 민감함',
                '진짜 욕망은 오히려 혼자 있을 때 더 선명해지고, 남에게 말할수록 흐려지는 경우가 많다는 의견',
              ],
            },
          ],
          comments: [
            {
              meetingRetrospectiveId: 1,
              userId: 1,
              nickname: '사용자1',
              profileImageUrl: 'https://placehold.co/40x40',
              comment: '모임 하기전엔 이랬는데, 누구의 이런 말을 듣고 이렇게 생각이 바뀌었다.',
              createdAt: '2026-01-15T15:30:00',
            },
          ],
        },
        {
          topicId: 2,
          confirmOrder: 2,
          topicTitle: '선과 악',
          topicDescription: '인간의 세계에서 선과 악 어느 것이 힘이 더 셀까',
          summary: '선과 악 중 어느 쪽이 더 강한지를 묻기보다...',
          keyPoints: [
            {
              title: '악이 더 강해 보이는 이유',
              details: ['결과가 빠르고 명확하게 드러나며, 책임을 외부로 돌리기 쉬움'],
            },
          ],
          comments: [],
        },
      ],
    },
  ],
  meetingPersonalRecords: [
    {
      retrospectiveId: 1,
      gatheringName: '책책책 책을 읽자',
      recordType: '개인 회고',
      createdAt: '2026-01-05T21:38:00',
      topicGroups: [
        {
          topicId: 1,
          topicTitle: '가짜 욕망, 유사 욕망',
          confirmOrder: 1,
          changedThoughts: {
            keyIssue:
              '모임 이후에는 가짜 욕망과 유사 욕망을 명확히 구분하려는 태도 자체가 현실적이지 않을 수 있겠다는 생각이 들었다.',
            postOpinion:
              '어떤 욕망은 그 당시에는 진짜처럼 느껴지지만 시간이 지나면서 다르게 보이기도 하고, 유사 욕망을 거쳐서야 진짜 욕망에 가까워지는 경우도 있다는 이야기를 들었다.',
          },
          othersPerspectives: [],
        },
        {
          topicId: 2,
          topicTitle: '선과 악',
          confirmOrder: 2,
          changedThoughts: {
            keyIssue:
              '토론을 거치면서 어느 쪽이 더 강한지를 따지는 질문 자체가 핵심은 아닐 수 있겠다는 생각이 들었다.',
            postOpinion:
              '데미안과 아브락사스의 개념을 중심으로 보면, 선과 악은 분리된 두 힘이라기보다 한 인간 안에서 동시에 작동하는 요소에 가깝다.',
          },
          othersPerspectives: [
            {
              meetingMemberId: 10,
              memberNickname: '독서왕',
              opinionContent:
                '선과 악을 나눌 수 있느냐는 질문보다, 우리는 왜 그렇게 나눠야 마음이 편해지는지를 더 봐야 하는 것 같아요.',
              impressiveReason:
                '그동안 나는 선과 악을 어떻게 조율할지에만 집중했지, 왜 굳이 명확한 경계를 만들고 싶어 하는지는 생각해본 적이 없다.',
            },
          ],
        },
      ],
      freeTexts: [
        {
          title: '오늘의 한 줄',
          content:
            '이 의견을 통해 아브락사스가 하나의 결론이 아니라 질문의 역할을 한다는 점이 인상 깊었고, 주제를 바라보는 시야가 넓어졌다.',
        },
        {
          title: '오늘의 한 줄',
          content:
            '이 의견을 통해 아브락사스가 하나의 결론이 아니라 질문의 역할을 한다는 점이 인상 깊었고, 주제를 바라보는 시야가 넓어졌다.',
        },
      ],
    },
  ],
  meetingPreOpinions: [
    {
      type: 'PRE_OPINION',
      gatheringName: '책책책 책을 읽자',
      sharedAt: '2026-01-05T21:38:00',
      topics: [
        {
          confirmOrder: 2,
          topicTitle: '선과 악',
          topicDescription: '본인에게 충격과 변화를 가져온 경험이 있다면 이야기해 주세요.',
          answer:
            '이 질문에 대해 단순히 선이 더 세다거나, 악이 더 강하다고 말하기는 어렵다고 느꼈다. 오히려 현실에서는 악이 더 즉각적으로 힘을 발휘하는 경우가 많다고 생각했다. 선은 보통 인내, 조율, 기다림을 필요로 하고 악은 빠르고 직관적으로 작동한다. 그래서 순간적인 영향력이나 파괴력은 악이 더 커 보일 때가 많다. 하지만 데미안에서 말하는 선과 악은 서로 싸우는 두 진영이라기보다 한 인간 안에서 공존하는 힘처럼 느껴졌다. 이 관점에서 보면 문제는 어느 쪽이 더 세냐가 아니라 어느 쪽을 끝까지 외면하느냐에 더 가까운 것 같다. 악을 없애려 하기보다 존재를 인정하지 않을 때 오히려 더 왜곡된 형태로 나타나는 게 아닐까 생각해봤다.',
        },
        {
          confirmOrder: 1,
          topicTitle: '진짜 욕망이란',
          topicDescription: '진짜 욕망에 대해 자유롭게 이야기해봅시다.',
          answer: '진짜 욕망은 내면에서 자연스럽게 올라오는 것이라고 생각한다.',
        },
      ],
    },
  ],
}

const mockBookReviewHistoryResponse: GetBookReviewHistoryResponse = {
  items: [
    {
      bookReviewHistoryId: 2,
      createdAt: '2025-12-15T10:30:00',
      rating: 3.5,
      bookKeywords: [
        { id: 1, name: '관계', type: 'BOOK' },
        { id: 2, name: '성장', type: 'BOOK' },
      ],
      impressionKeywords: [
        { id: 10, name: '즐거운', type: 'IMPRESSION' },
        { id: 11, name: '여운이 남는', type: 'IMPRESSION' },
      ],
    },
    {
      bookReviewHistoryId: 1,
      createdAt: '2025-12-08T14:20:00',
      rating: 4,
      bookKeywords: [{ id: 3, name: '감동', type: 'BOOK' }],
      impressionKeywords: [{ id: 12, name: '몰입되는', type: 'IMPRESSION' }],
    },
  ],
  pageSize: 5,
  hasNext: false,
  nextCursor: {
    historyId: null,
  },
}

// ============================================================
// Mock Helper Functions
// ============================================================

/** 목데이터 응답 지연 시뮬레이션 (ms) */
const MOCK_DELAY = 500

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 책 상세 목데이터 반환
 */
export const getMockBookDetail = async (bookId: number): Promise<BookDetail> => {
  await delay(MOCK_DELAY)
  return { ...mockBookDetail, bookId }
}

/**
 * 책 읽기 상태 토글 목데이터 반환
 */
export const getMockToggleBookReadingStatus = async (bookId: number): Promise<BookDetail> => {
  await delay(MOCK_DELAY)
  mockBookDetail.bookReadingStatus =
    mockBookDetail.bookReadingStatus === 'READING' ? 'COMPLETED' : 'READING'
  return { ...mockBookDetail, bookId }
}

/**
 * 책 평가 목데이터 반환
 */
export const getMockBookReview = async (): Promise<BookReview> => {
  await delay(MOCK_DELAY)
  return mockBookReview
}

/**
 * 내 모임 목록 목데이터 반환
 */
export const getMockMyGatherings = async (): Promise<GetGatheringsResponse> => {
  await delay(MOCK_DELAY)
  return mockGatheringsResponse
}

/**
 * 감상 기록 목데이터 반환
 */
export const getMockBookRecords = async (
  params: GetBookRecordsParams = {}
): Promise<GetBookRecordsResponse> => {
  await delay(MOCK_DELAY)
  return filterMockBookRecords(mockBookRecordsResponse, params)
}

/**
 * 평가 히스토리 목데이터 반환
 */
export const getMockBookReviewHistory = async (): Promise<GetBookReviewHistoryResponse> => {
  await delay(MOCK_DELAY)
  return mockBookReviewHistoryResponse
}

/**
 * 감상 기록 생성 목데이터 반환
 */
export const getMockCreateBookRecord = async (
  personalBookId: number,
  body: CreateBookRecordBody
): Promise<PersonalRecord> => {
  await delay(MOCK_DELAY)
  return {
    recordId: Date.now(),
    recordType: body.recordType,
    recordContent: body.recordContent,
    meta: body.meta ?? {},
    bookId: personalBookId,
    createdAt: new Date().toISOString(),
  }
}

/**
 * 감상 기록 수정 목데이터 반환
 */
export const getMockUpdateBookRecord = async (
  personalBookId: number,
  recordId: number,
  body: UpdateBookRecordBody
): Promise<PersonalRecord> => {
  await delay(MOCK_DELAY)
  return {
    recordId,
    recordType: body.recordType,
    recordContent: body.recordContent,
    meta: body.meta ?? {},
    bookId: personalBookId,
    createdAt: new Date().toISOString(),
  }
}

/**
 * 감상 기록/책 삭제 목데이터 반환
 */
export const getMockDeleteResponse = async (): Promise<void> => {
  await delay(MOCK_DELAY)
}

/**
 * 책 평가 생성 목데이터 반환
 */
export const getMockCreateBookReview = async (
  bookId: number,
  body: CreateBookReviewBody
): Promise<BookReview> => {
  await delay(MOCK_DELAY)
  return {
    reviewId: Date.now(),
    bookId,
    userId: 1,
    rating: body.rating,
    keywords: body.keywordIds.map((id) => ({
      id,
      name: `키워드${id}`,
      type: id % 2 === 0 ? 'BOOK' : 'IMPRESSION',
    })),
    createdAt: new Date().toISOString(),
  }
}

/**
 * 책 목록 목데이터 반환
 */
export const getMockBooks = async (params: GetBooksParams = {}): Promise<GetBooksResponse> => {
  await delay(MOCK_DELAY)
  return filterMockBooks(params)
}

// ============================================================
// Mock Filter Functions
// ============================================================

function filterMockBooks(params: GetBooksParams): GetBooksResponse {
  const { status, gatheringId, ratingMin, ratingMax, sort = 'LATEST' } = params

  let filteredItems = [...mockBookListItems]

  // 상태 필터
  if (status) {
    filteredItems = filteredItems.filter((item) => item.bookReadingStatus === status)
  }

  // 모임 필터 - gatheringId가 있으면 해당 모임 이름을 가진 책만 필터링
  if (gatheringId !== undefined) {
    const gathering = mockGatheringsResponse.items.find((g) => g.gatheringId === gatheringId)
    if (gathering) {
      filteredItems = filteredItems.filter((item) =>
        item.gatheringNames.includes(gathering.gatheringName)
      )
    }
  }

  // 별점 필터 - 선택한 범위 내의 별점만 필터링 (정수 기준)
  if (ratingMin !== undefined && ratingMax !== undefined && ratingMin >= 0) {
    filteredItems = filteredItems.filter((item) => {
      const floorRating = Math.floor(item.rating)
      return floorRating >= ratingMin && floorRating <= ratingMax
    })
  }

  // 정렬 처리 (bookId 기준으로 시뮬레이션)
  const sortMultiplier = sort === 'LATEST' ? -1 : 1
  filteredItems.sort((a, b) => sortMultiplier * (a.bookId - b.bookId))

  const readingCount = mockBookListItems.filter(
    (item) => item.bookReadingStatus === 'READING'
  ).length
  const completedCount = mockBookListItems.filter(
    (item) => item.bookReadingStatus === 'COMPLETED'
  ).length

  return {
    items: filteredItems,
    pageSize: params.pageSize ?? 10,
    hasNext: false,
    nextCursor: null,
    totalCount: mockBookListItems.length,
    readingCount,
    completedCount,
  }
}

function filterMockBookRecords(
  data: GetBookRecordsResponse,
  params: GetBookRecordsParams
): GetBookRecordsResponse {
  const { gatheringId, recordType, sort = 'LATEST' } = params

  let personalRecords = [...data.personalRecords]
  let meetingGroupRecords = [...data.meetingGroupRecords]
  let meetingPersonalRecords = [...data.meetingPersonalRecords]
  let meetingPreOpinions = [...(data.meetingPreOpinions ?? [])]

  // 모임 필터 - 모임 선택 시 개인 기록 제외, 해당 모임 기록만 표시
  if (gatheringId !== undefined) {
    personalRecords = []
    meetingGroupRecords = meetingGroupRecords.filter(
      (record) => record.gathering.gatheringId === gatheringId
    )
    meetingPersonalRecords = meetingPersonalRecords.filter((record) => {
      const matching = data.meetingGroupRecords.find((g) => g.gathering.gatheringId === gatheringId)
      return matching && record.gatheringName === matching.gathering.gatheringName
    })
    meetingPreOpinions = meetingPreOpinions.filter((record) => {
      const matching = data.meetingGroupRecords.find((g) => g.gathering.gatheringId === gatheringId)
      return matching && record.gatheringName === matching.gathering.gatheringName
    })
  }

  // 기록 유형 필터 - 개인 기록만 필터링, 모임 기록 제외
  if (recordType) {
    personalRecords = personalRecords.filter((record) => record.recordType === recordType)
    meetingGroupRecords = []
    meetingPersonalRecords = []
    meetingPreOpinions = []
  }

  // 정렬 처리
  const sortMultiplier = sort === 'LATEST' ? -1 : 1

  personalRecords.sort((a, b) => {
    return sortMultiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  })

  meetingGroupRecords.sort((a, b) => {
    return sortMultiplier * (new Date(a.meetingDate).getTime() - new Date(b.meetingDate).getTime())
  })

  meetingPersonalRecords.sort((a, b) => {
    return sortMultiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  })

  meetingPreOpinions.sort((a, b) => {
    return sortMultiplier * (new Date(a.sharedAt).getTime() - new Date(b.sharedAt).getTime())
  })

  return {
    personalRecords,
    meetingGroupRecords,
    meetingPersonalRecords,
    meetingPreOpinions,
  }
}
