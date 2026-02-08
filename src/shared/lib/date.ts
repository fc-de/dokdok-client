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
export const formatToShortDate = (isoString: string): string => {
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
export const formatToDateTimeWithDay = (isoString: string): string => {
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
const parseLocalDate = (dateString: string): Date => {
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
export const formatToDateWithDayAndTime = (dateString: string, timeRange: string): string => {
  const date = parseLocalDate(dateString)

  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dayOfWeek = DAYS_KO[date.getDay()]

  return `${year}.${month}.${day} (${dayOfWeek}) · ${timeRange}`
}

/**
 * 시작/종료 일시를 범위 형식으로 변환합니다.
 *
 * @param startDateTime - ISO 8601 형식의 시작 일시
 * @param endDateTime - ISO 8601 형식의 종료 일시
 * @returns YY.MM.DD(요일) HH:mm ~ YY.MM.DD(요일) HH:mm 형식의 문자열
 *
 * @example
 * formatToDateTimeRange('2026-01-16T00:30:00', '2026-01-16T02:30:00')
 * // '26.01.16(금) 00:30 ~ 26.01.16(금) 02:30'
 */
export const formatToDateTimeRange = (startDateTime: string, endDateTime: string): string => {
  const formatSingle = (date: Date) => {
    const year = String(date.getFullYear()).slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayOfWeek = DAYS_KO[date.getDay()]
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}.${month}.${day}(${dayOfWeek}) ${hours}:${minutes}`
  }

  const start = new Date(startDateTime)
  const end = new Date(endDateTime)

  return `${formatSingle(start)} ~ ${formatSingle(end)}`
}

/**
 * 시작/종료 일시 기반 D-day 텍스트를 계산합니다.
 *
 * @param startDateTime - ISO 8601 형식의 시작 일시
 * @param endDateTime - ISO 8601 형식의 종료 일시
 * @returns "D-N" (예정), "D-Day" (당일), "D+N" (경과), 진행 중이면 null
 *
 * @example
 * getDdayText('2026-02-10T19:00:00', '2026-02-10T21:00:00') // 'D-5'
 * getDdayText('2026-02-05T00:00:00', '2026-02-05T23:59:00') // null (진행 중)
 */
export const getDdayText = (startDateTime: string, endDateTime: string): string | null => {
  const now = new Date()
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)

  // 진행 중이면 D-day 표시 안함
  if (now >= start && now <= end) {
    return null
  }

  // 날짜 비교를 위해 시간 제거
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDate =
    now < start
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate())
      : new Date(end.getFullYear(), end.getMonth(), end.getDate())

  const diffTime = targetDate.getTime() - nowDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'D-Day'
  if (diffDays > 0) return `D-${diffDays}`
  return `D+${Math.abs(diffDays)}`
}
