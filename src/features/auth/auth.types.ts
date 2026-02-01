/**
 * 현재 로그인한 사용자 정보 - 인증 상태 확인 및 온보딩 필요 여부 체크에 사용
 */
export type CurrentUser = {
  userId: number
  nickname: string | null
  profileImageUrl: string | null
  needsOnboarding: boolean
}
