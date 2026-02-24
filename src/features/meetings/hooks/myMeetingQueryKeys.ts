import type { MyMeetingFilter } from '@/features/meetings/meetings.types'

export const myMeetingQueryKeys = {
  all: ['myMeetings'] as const,
  lists: () => [...myMeetingQueryKeys.all, 'list'] as const,
  list: (filter: MyMeetingFilter) => [...myMeetingQueryKeys.lists(), filter] as const,
  tabCounts: () => [...myMeetingQueryKeys.all, 'tabCounts'] as const,
}
