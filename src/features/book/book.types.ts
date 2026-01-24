/**
 * @file book.types.ts
 * @description Book 도메인 관련 타입 정의
 */

/** 책 읽기 상태 */
export type BookReadingStatus = 'READING' | 'COMPLETED' | 'PENDING'

/** 책 상세 정보 */
export interface BookDetail {
  bookId: number
  title: string
  publisher: string
  authors: string
  bookReadingStatus: BookReadingStatus
  thumbnail: string
}
