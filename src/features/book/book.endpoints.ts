import { API_PATHS } from '@/api'

export const BOOK_ENDPOINTS = {
  // 책 목록 조회 (GET /api/book)
  LIST: API_PATHS.BOOK,

  // 책 등록 (POST /api/book)
  CREATE: API_PATHS.BOOK,

  // 책 상세 조회 (GET /api/book/{bookId})
  DETAIL: (bookId: number) => `${API_PATHS.BOOK}/${bookId}`,

  // 책 삭제 (DELETE /api/book/{bookId})
  DELETE: (bookId: number) => `${API_PATHS.BOOK}/${bookId}`,

  // 책 읽기 상태 토글 (POST /api/book/{bookId}/isReading)
  TOGGLE_READING: (bookId: number) => `${API_PATHS.BOOK}/${bookId}/isReading`,

  // 책 평가 조회 (GET /api/book/{bookId}/reviews/me)
  REVIEW_ME: (bookId: number) => `${API_PATHS.BOOK}/${bookId}/reviews/me`,

  // 책 평가 생성 (POST /api/book/{bookId}/reviews)
  REVIEW_CREATE: (bookId: number) => `${API_PATHS.BOOK}/${bookId}/reviews`,

  // 책 평가 히스토리 조회 (GET /api/book/{bookId}/reviews/history)
  REVIEW_HISTORY: (bookId: number) => `${API_PATHS.BOOK}/${bookId}/reviews/history`,

  // 감상 기록 조회 (GET /api/book/{personalBookId}/records)
  RECORDS: (personalBookId: number) => `${API_PATHS.BOOK}/${personalBookId}/records`,

  // 감상 기록 생성 (POST /api/book/{personalBookId}/records)
  RECORD_CREATE: (personalBookId: number) => `${API_PATHS.BOOK}/${personalBookId}/records`,

  // 감상 기록 수정 (PUT /api/book/{personalBookId}/records/{recordId})
  RECORD_UPDATE: (personalBookId: number, recordId: number) =>
    `${API_PATHS.BOOK}/${personalBookId}/records/${recordId}`,

  // 감상 기록 삭제 (DELETE /api/book/{personalBookId}/records/{recordId})
  RECORD_DELETE: (personalBookId: number, recordId: number) =>
    `${API_PATHS.BOOK}/${personalBookId}/records/${recordId}`,

  // 도서 검색 (GET /api/book/search)
  SEARCH: `${API_PATHS.BOOK}/search`,
} as const
