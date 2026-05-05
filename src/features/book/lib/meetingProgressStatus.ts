import type { BookMeetingProgressStatus } from '@/features/book/book.types'
import type { BadgeProps } from '@/shared/ui'

export const MEETING_PROGRESS_STATUS_LABEL: Record<BookMeetingProgressStatus, string> = {
  BEFORE: '약속 전',
  AFTER: '약속 후',
}

export const MEETING_PROGRESS_STATUS_BADGE_COLOR: Record<
  BookMeetingProgressStatus,
  BadgeProps['color']
> = {
  BEFORE: 'yellow',
  AFTER: 'grey',
}
