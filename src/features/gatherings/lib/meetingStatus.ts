import type { GatheringMeetingItem } from '../gatherings.types'

/** 약속 표시 상태 타입 */
export type MeetingDisplayStatus = 'UPCOMING' | 'IN_PROGRESS' | 'DONE'

/**
 * 약속 시간 기반 상태 계산
 */
export const getMeetingDisplayStatus = (
  startDateTime: string,
  endDateTime: string
): MeetingDisplayStatus => {
  const now = new Date()
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)

  if (now < start) return 'UPCOMING'
  if (now >= start && now <= end) return 'IN_PROGRESS'
  return 'DONE'
}

/**
 * 약속 정렬 함수
 * 1. 약속 중 → 최상단
 * 2. 예정 → 오늘 기준 가까운 순
 * 3. 종료 → 오늘 기준 가까운 순
 */
export const sortMeetings = (meetings: GatheringMeetingItem[]): GatheringMeetingItem[] => {
  return [...meetings].sort((a, b) => {
    const statusA = getMeetingDisplayStatus(a.startDateTime, a.endDateTime)
    const statusB = getMeetingDisplayStatus(b.startDateTime, b.endDateTime)

    // 약속 중이 최상단
    if (statusA === 'IN_PROGRESS' && statusB !== 'IN_PROGRESS') return -1
    if (statusA !== 'IN_PROGRESS' && statusB === 'IN_PROGRESS') return 1

    // 예정 > 종료 순서
    if (statusA === 'UPCOMING' && statusB === 'DONE') return -1
    if (statusA === 'DONE' && statusB === 'UPCOMING') return 1

    // 같은 상태 내에서 정렬
    const startA = new Date(a.startDateTime)
    const startB = new Date(b.startDateTime)

    if (statusA === 'UPCOMING') {
      // 예정: 가까운 미래 순 (오름차순)
      return startA.getTime() - startB.getTime()
    } else {
      // 종료: 최근 종료 순 (내림차순) - endDateTime 기준
      const endA = new Date(a.endDateTime)
      const endB = new Date(b.endDateTime)
      return endB.getTime() - endA.getTime()
    }
  })
}
