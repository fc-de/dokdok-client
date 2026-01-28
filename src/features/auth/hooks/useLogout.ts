import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'

import { logout } from '../auth.api'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      navigate(ROUTES.LOGIN)
    },
  })
}
