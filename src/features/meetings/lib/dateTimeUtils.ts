/**
 * @file dateTimeUtils.ts
 * @description 날짜/시간 조작 및 생성 유틸리티 함수
 */

import { format } from 'date-fns'

/**
 * 시간 선택 옵션 타입
 */
export type TimeOption = {
  /** 표시할 시간 문자열 (HH:mm 형식) */
  label: string
  /** 실제 값 (HH:mm 형식) */
  value: string
}

/**
 * 30분 단위 시간 목록 생성
 *
 * @description
 * 00:00부터 23:30까지 30분 단위로 시간 목록을 생성합니다.
 *
 * @returns 시간 선택 옵션 배열
 *
 * @example
 * const times = generateTimeOptions()
 * // [
 * //   { label: '00:00', value: '00:00' },
 * //   { label: '00:30', value: '00:30' },
 * //   ...
 * //   { label: '23:30', value: '23:30' }
 * // ]
 */
export function generateTimeOptions(): TimeOption[] {
  const options: TimeOption[] = []

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourStr = String(hour).padStart(2, '0')
      const minuteStr = String(minute).padStart(2, '0')
      const time = `${hourStr}:${minuteStr}`

      options.push({
        label: time,
        value: time,
      })
    }
  }

  return options
}

/**
 * 날짜와 시간을 ISO 8601 형식으로 결합
 *
 * @description
 * 날짜(Date)와 시간(HH:mm)을 결합하여 ISO 8601 형식 문자열로 변환합니다.
 *
 * @param date - 날짜 객체
 * @param time - 시간 문자열 (HH:mm 형식)
 * @returns ISO 8601 형식 문자열 (YYYY-MM-DDTHH:mm:00)
 *
 * @example
 * const dateTime = combineDateAndTime(new Date('2025-02-01'), '14:00')
 * // → '2025-02-01T14:00:00'
 */
export function combineDateAndTime(date: Date, time: string): string {
  return `${format(date, 'yyyy-MM-dd')}T${time}:00`
}

/**
 * ISO 8601 형식 문자열에서 시간 추출
 *
 * @description
 * ISO 8601 형식 문자열에서 시간(HH:mm)만 추출합니다.
 *
 * @param dateTime - ISO 8601 형식 문자열
 * @returns 시간 문자열 (HH:mm 형식) 또는 빈 문자열
 *
 * @example
 * const time = extractTime('2025-02-01T14:00:00')
 * // → '14:00'
 */
export function extractTime(dateTime: string): string {
  if (!dateTime) return ''

  const timePart = dateTime.split('T')[1]
  if (!timePart) return ''

  // HH:mm:ss에서 HH:mm만 추출
  return timePart.substring(0, 5)
}
