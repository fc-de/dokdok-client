import { useQuery } from '@tanstack/react-query'

import { ApiError } from '@/api'

import { fetchCurrentUserProfile } from '../user.api'
import type { User } from '../user.types'
import { userQueryKeys } from './userQueryKeys'

interface UseUserProfileOptions {
  enabled?: boolean
}

/**
 * 현재 사용자 프로필 정보 조회 훅 (/api/users/me)
 *
 * @description
 * - 프로필 정보(닉네임, 이메일, 프로필 이미지, 가입일) 조회
 * - 마이페이지, 프로필 수정 등에서 사용
 * - staleTime: Infinity로 수동 갱신 전까지 캐시 유지
 */
export function useUserProfile(options: UseUserProfileOptions = {}) {
  const { enabled = true } = options

  return useQuery<User, ApiError>({
    queryKey: userQueryKeys.profile(),
    queryFn: fetchCurrentUserProfile,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled,
  })
}
