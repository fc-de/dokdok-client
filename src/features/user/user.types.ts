/**
 * 사용자 상세 정보
 */
export type User = {
  userId: number
  nickname: string | null
  email: string
  profileImageUrl: string | null
  createdAt: string
}

/**
 * 닉네임 중복 체크 결과
 */
export type NicknameCheckResult = {
  available: boolean
}

/**
 * 온보딩 입력
 */
export type OnboardingInput = {
  nickname: string
  profileImage?: File
}
