/**
 * 모임 관련 Query Key를 일관되게 관리하기 위한 팩토리 함수
 */
export const gatheringQueryKeys = {
  all: ['gatherings'] as const,
  lists: () => [...gatheringQueryKeys.all, 'list'] as const,
  detail: (id: number | string) => [...gatheringQueryKeys.all, 'detail', id] as const,
  byInviteCode: (invitationCode: string) =>
    [...gatheringQueryKeys.all, 'invite', invitationCode] as const,
} as const
