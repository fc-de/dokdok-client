/**
 * @file dateFormatters.ts
 * @description 약속회고 날짜 포맷팅 유틸리티 함수
 */

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * YYYY-MM-DD 형식의 날짜 문자열을 로컬 타임존 Date로 파싱합니다.
 * (UTC 자정이 아닌 로컬 자정으로 파싱)
 */
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * YYYY-MM-DD 형식의 날짜 문자열을 YYYY.MM.DD(요일) 형식으로 변환합니다.
 *
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns YYYY.MM.DD(요일) 형식의 문자열
 *
 * @example
 * formatToFullDateWithDay('2026-01-15') // '2026.01.15(목)'
 */
export const formatToFullDateWithDay = (dateString: string): string => {
  const date = parseLocalDate(dateString)
  return format(date, 'yyyy.MM.dd(eee)', { locale: ko })
}

/**
 * ISO 8601 형식의 날짜 문자열을 YYYY.MM.DD(요일) 형식으로 변환합니다.
 *
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @returns YYYY.MM.DD(요일) 형식의 문자열
 *
 * @example
 * formatToDateWithDay('2026-01-15T09:30:00Z') // '2026.01.15(월)'
 */
export const formatToDateWithDay = (isoString: string): string => {
  const date = new Date(isoString)
  return format(date, 'yyyy.MM.dd(eee)', { locale: ko })
}
