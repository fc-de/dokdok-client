import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'
import { showErrorToast } from '@/shared/lib/toast'

/**
 * 페이지 접근 권한 에러 전역 핸들러
 *
 * @description
 * interceptors.ts에서 dispatch한 'permission-denied' 커스텀 이벤트를 listen하여
 * 에러 토스트를 표시하고 홈으로 리다이렉트합니다.
 * RootLayout에서 한 번만 등록하여 모든 페이지에 적용됩니다.
 */
export function usePermissionRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: Event) => {
      if (!(e instanceof CustomEvent) || !e.detail) return
      const message =
        typeof e.detail.message === 'string' ? e.detail.message : '접근 권한이 없습니다.'
      showErrorToast(message)
      navigate(ROUTES.HOME, { replace: true })
    }

    window.addEventListener('permission-denied', handler)
    return () => window.removeEventListener('permission-denied', handler)
  }, [navigate])
}
