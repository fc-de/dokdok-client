/**
 * @file book.api.ts
 * @description Book 도메인 API 함수
 */

import { api } from '@/api'

import type { BookDetail } from './book.types'

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
