import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { ApiError, type ApiResponse } from '@/api'
import { ROUTES } from '@/shared/constants'

import { logout } from '../auth.api'

/**
 * 로그아웃 훅 - 성공 시 전체 캐시 초기화 후 로그인 페이지로 이동
 */
export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<null>, ApiError, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      navigate(ROUTES.LOGIN, { replace: true })
    },
  })
}
