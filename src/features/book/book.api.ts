/**
 * @file book.api.ts
 * @description Book 도메인 API 함수
 */

import { api } from '@/api'
import { ApiError, ErrorCode } from '@/api/errors'

import { BOOK_ENDPOINTS } from './book.endpoints'
import {
  getMockBookDetail,
  getMockBookRecords,
  getMockBookReview,
  getMockBookReviewHistory,
  getMockBooks,
  getMockCreateBookRecord,
  getMockCreateBookReview,
  getMockDeleteResponse,
  getMockMyGatherings,
  getMockToggleBookReadingStatus,
  getMockUpdateBookRecord,
} from './book.mock'
import type {
  BookDetail,
  BookReview,
  CreateBookBody,
  CreateBookRecordBody,
  CreateBookReviewBody,
  GetBookRecordsParams,
  GetBookRecordsResponse,
  GetBookReviewHistoryParams,
  GetBookReviewHistoryResponse,
  GetBooksParams,
  GetBooksResponse,
  GetGatheringsParams,
  GetGatheringsResponse,
  PersonalRecord,
  SearchBooksParams,
  SearchBooksResponse,
  UpdateBookRecordBody,
} from './book.types'

/** 목데이터 사용 여부 플래그 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

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
  if (USE_MOCK) {
    return getMockBookDetail(bookId)
  }

  return api.get<BookDetail>(BOOK_ENDPOINTS.DETAIL(bookId))
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
    return getMockToggleBookReadingStatus(bookId)
  }

  return api.post<BookDetail>(BOOK_ENDPOINTS.TOGGLE_READING(bookId))
}

/**
 * 책 평가 조회
 *
 * @param bookId - 조회할 책 ID
 * @returns 책 평가 정보
 *
 * @example
 * ```typescript
 * const review = await getBookReview(1)
 * console.log(review?.rating)
 * ```
 */
export async function getBookReview(bookId: number): Promise<BookReview | null> {
  if (USE_MOCK) {
    const data = await getMockBookReview()
    return normalizeBookReview(data)
  }

  try {
    const data = await api.get<Partial<BookReview>>(BOOK_ENDPOINTS.REVIEW_ME(bookId))
    return normalizeBookReview(data)
  } catch (error) {
    if (error instanceof ApiError && error.is(ErrorCode.BOOK_REVIEW_NOT_FOUND)) {
      return null
    }
    throw error
  }
}

function normalizeBookReview(data: Partial<BookReview> | null | undefined): BookReview | null {
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
    return getMockMyGatherings()
  }

  try {
    return await api.get<GetGatheringsResponse>('/api/gatherings', { params })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { items: [], pageSize: params.pageSize ?? 10, hasNext: false, nextCursor: null }
    }
    throw error
  }
}

// ============================================================
// Book Records (감상 기록) API
// ============================================================

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
    return getMockBookRecords(params)
  }

  return api.get<GetBookRecordsResponse>(BOOK_ENDPOINTS.RECORDS(personalBookId), { params })
}

// ============================================================
// Book Review History (평가 히스토리) API
// ============================================================

/**
 * 책 평가 히스토리 조회
 *
 * 커서 기반 페이지네이션을 지원합니다.
 *
 * @param bookId - 조회할 책 ID
 * @param params - 페이지네이션 파라미터
 * @returns 평가 히스토리 목록
 *
 * @example
 * ```typescript
 * const history = await getBookReviewHistory(1)
 * console.log(history.items[0].rating) // 4
 * ```
 */
export async function getBookReviewHistory(
  bookId: number,
  params: GetBookReviewHistoryParams = {}
): Promise<GetBookReviewHistoryResponse> {
  if (USE_MOCK) {
    return getMockBookReviewHistory()
  }

  try {
    return await api.get<GetBookReviewHistoryResponse>(BOOK_ENDPOINTS.REVIEW_HISTORY(bookId), {
      params,
    })
  } catch (error) {
    if (error instanceof ApiError && error.is(ErrorCode.BOOK_REVIEW_NOT_FOUND)) {
      return {
        items: [],
        pageSize: params.pageSize ?? 10,
        hasNext: false,
        nextCursor: { historyId: null },
      }
    }
    throw error
  }
}

/**
 * 감상 기록 생성
 *
 * @param personalBookId - 개인 책 ID
 * @param body - 기록 생성 요청 바디
 * @returns 생성된 감상 기록
 *
 * @example
 * ```typescript
 * await createBookRecord(1, { recordType: 'MEMO', recordContent: '메모 내용' })
 * ```
 */
export async function createBookRecord(
  personalBookId: number,
  body: CreateBookRecordBody
): Promise<PersonalRecord> {
  if (USE_MOCK) {
    return getMockCreateBookRecord(personalBookId, body)
  }

  return api.post<PersonalRecord>(BOOK_ENDPOINTS.RECORD_CREATE(personalBookId), body)
}

/**
 * 감상 기록 수정
 *
 * @param personalBookId - 개인 책 ID
 * @param recordId - 기록 ID
 * @param body - 기록 수정 요청 바디
 * @returns 수정된 감상 기록
 *
 * @example
 * ```typescript
 * await updateBookRecord(1, 5, { recordType: 'MEMO', recordContent: '수정된 내용' })
 * ```
 */
export async function updateBookRecord(
  personalBookId: number,
  recordId: number,
  body: UpdateBookRecordBody
): Promise<PersonalRecord> {
  if (USE_MOCK) {
    return getMockUpdateBookRecord(personalBookId, recordId, body)
  }

  return api.put<PersonalRecord>(BOOK_ENDPOINTS.RECORD_UPDATE(personalBookId, recordId), body)
}

/**
 * 감상 기록 삭제
 *
 * @param personalBookId - 개인 책 ID
 * @param recordId - 기록 ID
 *
 * @example
 * ```typescript
 * await deleteBookRecord(1, 5)
 * ```
 */
export async function deleteBookRecord(personalBookId: number, recordId: number): Promise<void> {
  if (USE_MOCK) {
    return getMockDeleteResponse()
  }

  return api.delete(BOOK_ENDPOINTS.RECORD_DELETE(personalBookId, recordId))
}

/**
 * 책 삭제
 *
 * @param bookId - 삭제할 책 ID
 *
 * @example
 * ```typescript
 * await deleteBook(1)
 * ```
 */
export async function deleteBook(bookId: number): Promise<void> {
  if (USE_MOCK) {
    return getMockDeleteResponse()
  }

  return api.delete(BOOK_ENDPOINTS.DELETE(bookId))
}

/**
 * 책 평가 생성
 *
 * @param bookId - 평가할 책 ID
 * @param body - 평가 생성 요청 바디
 * @returns 생성된 책 평가 정보
 *
 * @example
 * ```typescript
 * await createBookReview(1, { rating: 4.5, keywordIds: [3, 7] })
 * ```
 */
export async function createBookReview(
  bookId: number,
  body: CreateBookReviewBody
): Promise<BookReview> {
  if (USE_MOCK) {
    return getMockCreateBookReview(bookId, body)
  }

  return api.post<BookReview>(BOOK_ENDPOINTS.REVIEW_CREATE(bookId), body)
}

// ============================================================
// Book List (책 목록) API
// ============================================================

/**
 * 책 목록 조회
 *
 * 커서 기반 페이지네이션을 지원하며, 상태별 필터링이 가능합니다.
 *
 * @param params - 조회 파라미터 (status, pageSize, cursorAddedAt, cursorBookId)
 * @returns 책 목록 및 페이지네이션 정보
 *
 * @example
 * ```typescript
 * // 전체 책 목록 조회
 * const result = await getBooks()
 *
 * // 읽는 중인 책만 조회
 * const readingBooks = await getBooks({ status: 'READING' })
 *
 * // 다음 페이지 조회
 * const nextPage = await getBooks({
 *   cursorAddedAt: result.nextCursor?.addedAt,
 *   cursorBookId: result.nextCursor?.bookId,
 * })
 * ```
 */
export async function getBooks(params: GetBooksParams = {}): Promise<GetBooksResponse> {
  if (USE_MOCK) {
    return getMockBooks(params)
  }

  return api.get<GetBooksResponse>(BOOK_ENDPOINTS.LIST, { params })
}

// ============================================================
// Book Search (도서 검색) API
// ============================================================

/**
 * 도서 검색
 *
 * 외부 API를 통해 도서를 검색합니다.
 * 페이지 기반 페이지네이션을 지원합니다.
 *
 * @param params - 검색 파라미터 (query, page)
 * @returns 검색된 도서 목록 및 페이지네이션 정보
 *
 * @example
 * ```typescript
 * const result = await searchBooks({ query: '데미안' })
 * console.log(result.items) // 검색된 도서 목록
 * ```
 */
export async function searchBooks(params: SearchBooksParams): Promise<SearchBooksResponse> {
  return api.get<SearchBooksResponse>(BOOK_ENDPOINTS.SEARCH, { params })
}

/**
 * 책 등록
 *
 * 검색한 도서를 내 책장에 등록합니다.
 *
 * @param body - 책 등록 요청 바디
 * @returns 등록된 책 상세 정보
 *
 * @example
 * ```typescript
 * const book = await createBook({
 *   title: '데미안',
 *   authors: '헤르만 헤세',
 *   publisher: '민음사',
 *   isbn: '9788937460449',
 *   thumbnail: 'https://...',
 * })
 * ```
 */
export async function createBook(body: CreateBookBody): Promise<BookDetail> {
  return api.post<BookDetail>(BOOK_ENDPOINTS.CREATE, body)
}
