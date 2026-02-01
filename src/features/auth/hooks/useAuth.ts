import { useQuery } from '@tanstack/react-query'

import { ApiError } from '@/api'

import { fetchCurrentUser } from '../auth.api'
import type { CurrentUser } from '../auth.types'
import { authQueryKeys } from './authQueryKeys'

/**
 * 현재 로그인 사용자 정보를 조회하는 훅
 *
 * @description
 * - 401 에러 시 재시도하지 않음 (로그인 페이지로 리다이렉트)
 * - staleTime: Infinity - 수동 갱신(setQueryData) 전까지 캐시 데이터를 신선하게 유지
 * - refetchOnWindowFocus: 'always' - 창 포커스 시 항상 세션 유효성 확인
 */
export function useAuth() {
  return useQuery<CurrentUser, ApiError>({
    queryKey: authQueryKeys.me(),
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: 'always',
  })
}
