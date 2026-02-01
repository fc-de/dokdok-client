/**
 * @file userQueryKeys.ts
 * @description 사용자 관련 Query Key Factory
 */

export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
  checkNickname: (nickname: string) => [...userQueryKeys.all, 'check-nickname', nickname] as const,
} as const
