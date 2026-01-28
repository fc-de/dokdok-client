import { Camera } from 'lucide-react'
import { useState } from 'react'

import { useCheckNickname, useOnboarding } from '@/features/user'
import UserAvatarIcon from '@/shared/assets/icon/UserAvatar.svg'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Button, Input } from '@/shared/ui'

/**
 * 신규 사용자 온보딩 페이지
 *
 * @description
 * - 프로필 이미지 선택 (선택사항, 미등록 시 기본 이미지)
 * - 닉네임 입력 필수 (20자 제한)
 * - 온보딩 완료 후 홈 페이지로 리다이렉트
 */
export default function OnboardingPage() {
  const [nickname, setNickname] = useState('')
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)

  const { mutate: completeOnboarding, isPending } = useOnboarding()

  // 닉네임 중복 체크 (디바운싱 적용)
  const debouncedNickname = useDebounce(nickname, 500)
  const { data: nicknameCheck } = useCheckNickname(debouncedNickname, debouncedNickname.length >= 2)

  // 닉네임 사용 가능 여부
  const isNicknameAvailable = nicknameCheck?.available === true
  const isNicknameDuplicate = nicknameCheck?.available === false

  // 버튼 활성화 조건: 디바운스 완료 + 닉네임 중복 체크 통과 시 활성화
  const canSubmit =
    nickname.length >= 2 && debouncedNickname === nickname && isNicknameAvailable && !isPending

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (canSubmit) {
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
        <label htmlFor="profile-image" className="flex cursor-pointer items-end pr-6.25">
          <div className="relative -mr-6.25 flex size-27.5 items-center justify-center rounded-full border border-grey-300 bg-grey-200">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="프로필 이미지"
                className="size-full rounded-full object-cover"
              />
            ) : (
              <img src={UserAvatarIcon} alt="" className="size-14.25" />
            )}
          </div>
          <div className="relative -mr-6.25 flex size-9.5 items-center justify-center rounded-full border-2 border-white bg-grey-500 transition-colors hover:bg-grey-600">
            <Camera className="size-5 text-white" strokeWidth={2} />
          </div>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* 닉네임 입력 필드 (필수, 20자 제한) */}
        <Input
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          disabled={isPending}
          error={isNicknameDuplicate}
          errorMessage="중복된 닉네임이 존재합니다"
          helperText={isNicknameAvailable ? '사용 가능한 닉네임입니다' : undefined}
        />
      </div>

      {/* 시작하기 버튼 */}
      <Button type="submit" variant="primary" size="large" className="w-full" disabled={!canSubmit}>
        시작하기
      </Button>
    </form>
  )
}
