import { KakaoLoginButton } from '@/features/auth'
import logoIcon from '@/shared/assets/images/logo-icon.png'
import logoText from '@/shared/assets/images/logo-text.png'

/**
 * 카카오 소셜 로그인 페이지
 *
 * @description
 * - Figma 디자인 기반 로그인 페이지
 * - 중앙 정렬된 카드 레이아웃 (400×540px)
 * - 카카오 OAuth 로그인 버튼 제공
 */
export default function LoginPage() {
  return (
    <div className="flex h-135 w-100 flex-col items-center justify-center gap-20 rounded-medium bg-white px-12 pb-12 pt-22 shadow-drop">
        {/* 로고 영역 */}
        <div className="flex flex-col gap-large">
          <div className="flex items-center gap-4">
            <img src={logoIcon} alt="독크독크 로고" className="h-10.5 w-13.75" />
            <img src={logoText} alt="독크독크" className="h-10.5 w-37.5" />
          </div>

          {/* 슬로건 */}
          <p className="typo-heading3 text-center text-grey-700">
            대화로 넓히고
            <br />
            기록으로 깊어지는 독서생활
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex w-full flex-col items-center gap-base">
          <KakaoLoginButton />
          <p className="typo-body3 w-76 text-center text-grey-600">
            로그인 시 개인정보 처리방침 및 이용약관에
            <br />
            동의한 것으로 간주합니다.
          </p>
        </div>
      </div>
  )
}
