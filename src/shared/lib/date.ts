const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']

/**
 * ISO 날짜 문자열을 짧은 형식(YY.MM.DD)으로 변환합니다.
 *
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @returns YY.MM.DD 형식의 문자열
 *
 * @example
 * formatToShortDate('2024-01-15T09:30:00Z') // '24.01.15'
 */
export function formatToShortDate(isoString: string): string {
  const date = new Date(isoString)

  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

/**
 * ISO 날짜 문자열을 요일과 시간 포함 형식으로 변환합니다.
 *
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @returns YY.MM.DD (요일) · HH:mm 형식의 문자열
 *
 * @example
 * formatToDateTimeWithDay('2026-01-05T21:38:00') // '26.01.05 (일) · 21:38'
 */
export function formatToDateTimeWithDay(isoString: string): string {
  const date = new Date(isoString)

  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dayOfWeek = DAYS_KO[date.getDay()]
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}.${month}.${day} (${dayOfWeek}) · ${hours}:${minutes}`
}

/**
 * YYYY-MM-DD 형식의 날짜 문자열을 로컬 타임존 Date로 파싱합니다.
 * (UTC 자정이 아닌 로컬 자정으로 파싱)
 */
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * 날짜 문자열과 시간 범위를 요일 포함 형식으로 변환합니다.
 *
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @param timeRange - HH:mm-HH:mm 형식의 시간 범위 문자열
 * @returns YY.MM.DD (요일) · HH:mm-HH:mm 형식의 문자열
 *
 * @example
 * formatToDateWithDayAndTime('2026-01-15', '19:00-20:00') // '26.01.15 (목) · 19:00-20:00'
 */
export function formatToDateWithDayAndTime(dateString: string, timeRange: string): string {
  const date = parseLocalDate(dateString)

  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dayOfWeek = DAYS_KO[date.getDay()]

  return `${year}.${month}.${day} (${dayOfWeek}) · ${timeRange}`
}
