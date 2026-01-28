import { useState } from 'react'

import kakaoSymbol from '@/shared/assets/images/kakao-symbol.png'

import { loginWithKakao } from '../auth.api'

/**
 * 카카오톡 소셜 로그인 버튼
 *
 * @description
 * - 카카오 브랜드 가이드라인을 따르는 로그인 버튼
 * - 클릭 시 카카오 OAuth 페이지로 리다이렉트
 */
export default function KakaoLoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (isLoading) return
    setIsLoading(true)
    loginWithKakao()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2.5 rounded-base bg-[#fae104] px-10 py-3.25 cursor-pointer transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <img src={kakaoSymbol} alt="카카오톡" className="size-7 rounded-full" />
      <span className="typo-subtitle2 text-black">
        {isLoading ? '로그인 중...' : '카카오톡으로 시작하기'}
      </span>
    </button>
  )
}
