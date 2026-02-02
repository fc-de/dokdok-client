//timeUtils와 병합예정

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return format(date, 'yy.MM.dd(eee) HH:mm', { locale: ko })
}

/**
 * 현재 시간과 약속 일정을 비교하여 약속 상태를 반환합니다.
 * @param startDateTime - 약속 시작 일시 (ISO 8601 형식)
 * @param endDateTime - 약속 종료 일시 (ISO 8601 형식)
 * @returns 약속 상태 텍스트와 색상
 */
export function getMeetingStatusByTime(startDateTime: string, endDateTime: string) {
  const now = new Date()
  const startDate = new Date(startDateTime)
  const endDate = new Date(endDateTime)

  if (now < startDate) {
    return { text: '약속 전', color: 'yellow' as const }
  } else if (now >= startDate && now <= endDate) {
    return { text: '약속 중', color: 'red' as const }
  } else {
    return { text: '약속 후', color: 'blue' as const }
  }
}
