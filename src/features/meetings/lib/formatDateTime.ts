import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return format(date, 'yy.MM.dd(eee) HH:mm', { locale: ko })
}
