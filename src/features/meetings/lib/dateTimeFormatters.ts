/**
 * @file dateTimeFormatters.ts
 * @description 날짜/시간 포맷팅 유틸리티 함수
 */

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * ISO 8601 형식 문자열을 한글 날짜/시간 형식으로 변환
 *
 * @param dateTimeString - ISO 8601 형식의 날짜/시간 문자열
 * @returns 'yy.MM.dd(요일) HH:mm' 형식의 문자열
 *
 * @example
 * formatDateTime('2025-02-01T14:30:00')
 * // → '25.02.01(토) 14:30'
 */
export function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return format(date, 'yy.MM.dd(eee) HH:mm', { locale: ko })
}

/**
 * 선택된 일정을 한글 범위 형식으로 포맷팅
 *
 * @description
 * 시작/종료 날짜와 시간을 'YYYY.MM.DD(요일) HH:mm ~ YYYY.MM.DD(요일) HH:mm' 형식으로 변환합니다.
 *
 * @param startDate - 시작 날짜
 * @param startTime - 시작 시간 (HH:mm 형식)
 * @param endDate - 종료 날짜
 * @param endTime - 종료 시간 (HH:mm 형식)
 * @returns 포맷팅된 일정 범위 문자열 또는 null
 *
 * @example
 * formatScheduleRange(new Date('2025-02-01'), '14:00', new Date('2025-02-01'), '16:00')
 * // → '2025.02.01(토) 14:00 ~ 2025.02.01(토) 16:00'
 */
export function formatScheduleRange(
  startDate: Date | null,
  startTime: string | null,
  endDate: Date | null,
  endTime: string | null
): string | null {
  if (!startDate || !startTime || !endDate || !endTime) {
    return null
  }

  const startDateStr = format(startDate, 'yyyy.MM.dd(E)', { locale: ko })
  const endDateStr = format(endDate, 'yyyy.MM.dd(E)', { locale: ko })

  return `${startDateStr} ${startTime} ~ ${endDateStr} ${endTime}`
}
