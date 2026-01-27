/**
 * @file book.api.ts
 * @description Book 도메인 API 함수
 */

import { api } from '@/api'

import type {
  BookDetail,
  BookReview,
  GetBookRecordsParams,
  GetBookRecordsResponse,
  GetGatheringsParams,
  GetGatheringsResponse,
} from './book.types'

// ============================================================
// Mock Data
// ============================================================

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = true

const mockBookDetail: BookDetail = {
  bookId: 1,
  title: '물고기는 존재하지 않는다',
  publisher: '곰출판',
  authors: '룰루 밀러',
  bookReadingStatus: 'READING',
  thumbnail: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791189327156.jpg',
}

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
  gatherings: [
    {
      gatheringId: 1,
      name: '책읽는 직장인들',
      gatheringStatus: 'ACTIVE',
      currentUserRole: 'LEADER',
      joinedAt: '2025-12-01T10:00:00',
    },
    {
      gatheringId: 2,
      name: '주말 독서 모임',
      gatheringStatus: 'ACTIVE',
      currentUserRole: 'MEMBER',
      joinedAt: '2025-11-15T14:30:00',
    },
    {
      gatheringId: 3,
      name: '고전 문학 탐독',
      gatheringStatus: 'INACTIVE',
      currentUserRole: 'MEMBER',
      joinedAt: '2025-10-20T09:00:00',
    },
  ],
  nextCursor: {
    cursorJoinedAt: null,
    cursorId: null,
  },
  hasNext: false,
}

/** 목데이터 응답 지연 시뮬레이션 (ms) */
const MOCK_DELAY = 500

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ============================================================
// API Functions
// ============================================================

/**
 * 책 상세 정보 조회
 *
 * @param bookId - 조회할 책 ID
 * @returns 책 상세 정보
 *
 * @example
 * ```typescript
 * const book = await getBookDetail(1)
 * console.log(book.title) // '예제 도서명'
 * ```
 */
export async function getBookDetail(bookId: number): Promise<BookDetail> {
  // 목데이터 사용 시
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    return { ...mockBookDetail, bookId }
  }

  // 실제 API 호출
  return api.get<BookDetail>(`/api/book/${bookId}`)
}

/**
 * 책 읽기 상태 토글 (READING ↔ COMPLETED)
 *
 * @param bookId - 토글할 책 ID
 * @returns 변경된 책 상세 정보
 *
 * @example
 * ```typescript
 * await toggleBookReadingStatus(1)
 * ```
 */
export async function toggleBookReadingStatus(bookId: number): Promise<BookDetail> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    // 목데이터에서는 상태 토글 시뮬레이션
    mockBookDetail.bookReadingStatus =
      mockBookDetail.bookReadingStatus === 'READING' ? 'COMPLETED' : 'READING'
    return { ...mockBookDetail, bookId }
  }

  return api.post<BookDetail>(`/api/book/${bookId}/isReading`)
}

/**
 * 책 평가 조회
 *
 * @param bookId - 조회할 책 ID
 * @returns 책 상세 정보
 *
 * @example
 * ```typescript
 * const book = await getBookReview(1)
 * console.log(book.title) // '예제 도서명'
 * ```
 */
export async function getBookReview(bookId: number): Promise<BookReview | null> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    return normalizeBookReview(mockBookReview)
  }

  const data = await api.get<Partial<BookReview>>(`/api/book/${bookId}/reviews/me`)

  return normalizeBookReview(data)
}

function normalizeBookReview(data: Partial<BookReview> | null | undefined): BookReview | null {
  // 리뷰가 존재한다면 반드시 있어야 하는 값 기준
  if (!data || !data.reviewId) {
    return null
  }

  return data as BookReview
}

/**
 * 내 모임 전체 목록 조회
 *
 * 커서 기반 무한 스크롤을 지원하며, 가입일 최신순으로 정렬됩니다.
 *
 * @param params - 조회 파라미터 (pageSize, cursorJoinedAt, cursorId)
 * @returns 모임 목록 및 다음 페이지 커서 정보
 *
 * @example
 * ```typescript
 * // 첫 페이지 조회
 * const result = await getMyGatherings({ pageSize: 10 })
 *
 * // 다음 페이지 조회
 * const nextResult = await getMyGatherings({
 *   pageSize: 10,
 *   cursorJoinedAt: result.nextCursor.cursorJoinedAt,
 *   cursorId: result.nextCursor.cursorId,
 * })
 * ```
 */
export async function getMyGatherings(
  params: GetGatheringsParams = {}
): Promise<GetGatheringsResponse> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    return mockGatheringsResponse
  }

  return api.get<GetGatheringsResponse>('/api/gatherings', { params })
}

// ============================================================
// Book Records (감상 기록) API
// ============================================================

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
        page: 4,
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
      topics: [
        {
          topicId: 1,
          topicName: '가볍 목업, 유사 목업',
          summarizedOpinions: [
            '실제적인 것에 찾기 과정이 없어 학습해야 고려할 때마다 알도다',
            '데미안이라는 인물이 실존하는지, 아니면 내면의 동일시인 때문에 찾아 온미팅다',
          ],
          comments: [
            {
              meetingRetrospectiveId: 1,
              userId: 1,
              nickname: '사용자1',
              profileImageUrl: 'https://placehold.co/40x40',
              comment: '모임 하기전엔 이랬는데, 누구의 이런 발언을 듣고 이렇게 생각이 바뀌었다.',
              createdAt: '2026-01-15T15:30:00',
            },
          ],
        },
      ],
    },
  ],
  meetingPersonalRecords: [
    {
      retrospectiveId: 1,
      retrospective: {
        changedThoughts: ['책을 읽기 전과 후 생각이 많이 바뀌었다.'],
        othersPerspectives: ['다른 분의 의견을 듣고 새로운 시각을 얻었다.'],
        freeTexts: ['자유롭게 적는 회고 내용'],
      },
    },
  ],
}

/**
 * 책 감상 기록 조회
 *
 * @param personalBookId - 개인 책 ID
 * @param params - 필터 및 정렬 파라미터
 * @returns 감상 기록 목록
 *
 * @example
 * ```typescript
 * const records = await getBookRecords(1, { sort: 'LATEST', recordType: 'MEMO' })
 * ```
 */
export async function getBookRecords(
  personalBookId: number,
  params: GetBookRecordsParams = {}
): Promise<GetBookRecordsResponse> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    return filterMockBookRecords(mockBookRecordsResponse, params)
  }

  return api.get<GetBookRecordsResponse>(`/api/book/${personalBookId}/records`, { params })
}

/**
 * 목데이터 필터링 헬퍼 함수
 */
function filterMockBookRecords(
  data: GetBookRecordsResponse,
  params: GetBookRecordsParams
): GetBookRecordsResponse {
  const { gatheringId, recordType } = params

  let personalRecords = [...data.personalRecords]
  let meetingGroupRecords = [...data.meetingGroupRecords]
  let meetingPersonalRecords = [...data.meetingPersonalRecords]

  // 모임 필터 - 모임 선택 시 개인 기록 제외, 모임 기록만 표시
  if (gatheringId !== undefined) {
    personalRecords = []
    // 실제 API에서는 gatheringId로 필터링되겠지만, 목데이터는 그대로 표시
  }

  // 기록 유형 필터 - 개인 기록만 필터링, 모임 기록 제외
  if (recordType) {
    personalRecords = personalRecords.filter((record) => record.recordType === recordType)
    meetingGroupRecords = []
    meetingPersonalRecords = []
  }

  return {
    personalRecords,
    meetingGroupRecords,
    meetingPersonalRecords,
  }
}
