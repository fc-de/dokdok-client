import type { MeetingFilter, MemberStatusFilter } from '../gatherings.types'

/**
 * 모임 관련 Query Key를 일관되게 관리하기 위한 팩토리 함수
 */
export const gatheringQueryKeys = {
  all: ['gatherings'] as const,
  lists: () => [...gatheringQueryKeys.all, 'list'] as const,
  favorites: () => [...gatheringQueryKeys.all, 'favorites'] as const,
  detail: (id: number | string) => [...gatheringQueryKeys.all, 'detail', id] as const,
  byInviteCode: (invitationCode: string) =>
    [...gatheringQueryKeys.all, 'invite', invitationCode] as const,
  // 모임 약속 관련 키
  meetings: (gatheringId: number) =>
    [...gatheringQueryKeys.detail(gatheringId), 'meetings'] as const,
  meetingsByFilter: (gatheringId: number, filter: MeetingFilter) =>
    [...gatheringQueryKeys.meetings(gatheringId), filter] as const,
  meetingTabCounts: (gatheringId: number) =>
    [...gatheringQueryKeys.meetings(gatheringId), 'tabCounts'] as const,
  // 모임 멤버 관련 키
  members: (gatheringId: number) => [...gatheringQueryKeys.detail(gatheringId), 'members'] as const,
  membersByStatus: (gatheringId: number, status: MemberStatusFilter) =>
    [...gatheringQueryKeys.members(gatheringId), status] as const,
  // 모임 책장 관련 키
  books: (gatheringId: number) => [...gatheringQueryKeys.detail(gatheringId), 'books'] as const,
} as const
