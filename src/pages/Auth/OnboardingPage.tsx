import { NicknameInput, ProfileImagePicker, useOnboarding, useProfileForm } from '@/features/user'
import { Button } from '@/shared/ui'

/**
 * 신규 사용자 온보딩 페이지
 *
 * @description
 * - 프로필 이미지 선택 (선택사항, 미등록 시 기본 이미지)
 * - 닉네임 입력 필수 (20자 제한)
 * - 온보딩 완료 후 홈 페이지로 리다이렉트
 */
export default function OnboardingPage() {
  const { mutate: completeOnboarding, isPending } = useOnboarding()

  const {
    nickname,
    setNickname,
    profileImageFile,
    displayImageUrl,
    nicknameValidation,
    handleImageChange,
    canSubmit,
  } = useProfileForm()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (canSubmit && !isPending) {
      completeOnboarding({ nickname, profileImage: profileImageFile ?? undefined })
    }
  }

  return (
    <form
      className="flex h-135 w-100 flex-col items-end justify-between rounded-medium bg-white px-xlarge pb-xlarge pt-12 shadow-drop"
      onSubmit={handleSubmit}
    >
      <p className="w-full text-black typo-heading2">
        독크독크에서 사용할
        <br />
        프로필을 만들어주세요
      </p>

      {/* 프로필 이미지 & 닉네임 입력 */}
      <div className="flex w-full flex-col items-center gap-9">
        {/* 프로필 이미지 (선택사항) */}
        <ProfileImagePicker
          imageUrl={displayImageUrl}
          onFileChange={handleImageChange}
          disabled={isPending}
          variant="onboarding"
        />

        {/* 닉네임 입력 필드 (필수, 20자 제한) */}
        <NicknameInput
          value={nickname}
          onChange={setNickname}
          validation={nicknameValidation}
          disabled={isPending}
        />
      </div>

      {/* 시작하기 버튼 */}
      <Button
        type="submit"
        variant="primary"
        size="large"
        className="w-full"
        disabled={!canSubmit || isPending}
      >
        시작하기
      </Button>
    </form>
  )
}
