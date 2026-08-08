import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 약속 일시를 'yyyy.MM.dd(요일) HH:mm' 형식으로 변환합니다.
 * (기존 formatDateTime은 연도 2자리를 사용하므로, 4자리 연도가 필요한 약속상세 화면 전용으로 분리)
 *
 * @param isoString - ISO 8601 형식의 일시 문자열
 *
 * @example
 * formatMeetingDateTime('2026-02-10T19:00:00') // '2026.02.10(화) 19:00'
 */
export const formatMeetingDateTime = (isoString: string): string =>
  format(new Date(isoString), 'yyyy.MM.dd(eee) HH:mm', { locale: ko })
