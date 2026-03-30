import { useQueryClient } from '@tanstack/react-query'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { internalLogin } from '@/features/auth/auth.api'
import { authQueryKeys } from '@/features/auth/hooks/authQueryKeys'
import { ROUTES } from '@/shared/constants'
import { Button, Input } from '@/shared/ui'

export default function InternalLoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await internalLogin(loginId, password)
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
      navigate(ROUTES.HOME, { replace: true })
    } catch {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-135 w-100 flex-col items-center justify-center gap-12 rounded-medium bg-white px-12 pb-12 pt-22 shadow-drop">
      <div className="flex flex-col items-center gap-base">
        <h1 className="typo-heading2 text-grey-800">INTERNAL LOGIN</h1>
        <p className="typo-body2 text-grey-600">내부 전용 테스트 로그인</p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-base">
        <Input
          label="아이디"
          placeholder="아이디를 입력하세요"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="typo-body3 text-accent-300">{error}</p>}

        <Button type="submit" size="large" disabled={!loginId || !password || isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
        <Link
          to={ROUTES.KAKAO_LOGIN}
          className="typo-body3 text-center text-grey-500 hover:text-grey-700"
        >
          카카오 로그인
        </Link>
      </form>
    </div>
  )
}
