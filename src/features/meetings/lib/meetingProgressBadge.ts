/**
 * @file meetingProgressBadge.ts
 * @description 약속 진행 상태(progressStatus)에 대응하는 뱃지 라벨/색상 매핑
 */

import type { MeetingProgressStatus } from '@/features/meetings/meetings.types'

export type MeetingProgressBadge = {
  text: '약속 전' | '약속 중' | '약속 후'
  color: 'yellow' | 'blue' | 'red'
}

export const MEETING_PROGRESS_BADGE_MAP: Record<MeetingProgressStatus, MeetingProgressBadge> = {
  PRE: { text: '약속 전', color: 'yellow' },
  ONGOING: { text: '약속 중', color: 'red' },
  POST: { text: '약속 후', color: 'blue' },
}
