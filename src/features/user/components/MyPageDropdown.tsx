import { useLogout } from '@/features/auth'
import { Button, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

import { useDeleteUser, useProfileForm, useUpdateNickname, useUserProfile } from '../hooks'
import { NicknameInput } from './NicknameInput'
import { ProfileImagePicker } from './ProfileImagePicker'

interface MyPageDropdownProps {
  onClose?: () => void
}

/**
 * 마이페이지 드롭다운 컴포넌트
 *
 * @description
 * Header의 프로필 아바타 클릭 시 나타나는 드롭다운
 * - 프로필 이미지 변경/제거
 * - 닉네임 수정
 * - 로그아웃/탈퇴하기
 */
export function MyPageDropdown({ onClose }: MyPageDropdownProps) {
  const { data: user } = useUserProfile()
  const { mutate: updateNickname, isPending: isUpdating } = useUpdateNickname()
  const { mutate: logout } = useLogout()
  const { mutate: deleteUser } = useDeleteUser()
  const { openConfirm } = useGlobalModalStore()

  const {
    nickname,
    setNickname,
    nicknameValidation,
    handleImageChange,
    handleImageRemove,
    canSubmit,
    isImagePending,
  } = useProfileForm({
    initialNickname: user?.nickname ?? '',
    initialImageUrl: user?.profileImageUrl ?? null,
    checkNicknameChange: true,
    immediateImageUpload: true,
  })

  // immediateImageUpload 모드에서는 서버에서 받은 최신 이미지 URL 사용
  const currentImageUrl = user?.profileImageUrl ?? null

  const isPending = isUpdating || isImagePending

  // 저장 가능 조건: 닉네임이 변경되었고, 유효하고, 로딩 중이 아닐 때
  const nicknameChanged = nickname !== user?.nickname
  const canSave = nicknameChanged && canSubmit && !isUpdating

  // 닉네임 저장
  const handleSave = () => {
    if (!canSave) return

    updateNickname(nickname, {
      onSuccess: () => onClose?.(),
    })
  }

  const handleLogout = () => {
    logout()
  }

  const handleDeleteClick = async () => {
    const confirmed = await openConfirm(
      '회원 탈퇴',
      '탈퇴 시 계정 정보 및 서비스 이용 기록이 모두 삭제되며, 복구가 불가능해요.\n\n정말로 탈퇴하시겠어요?',
      { confirmText: '탈퇴하기', variant: 'danger' }
    )
    if (confirmed) {
      deleteUser()
    }
  }

  return (
    <div className="flex w-94 flex-col gap-xlarge rounded-medium bg-white px-9 pb-large pt-9 shadow-drop">
      {/* 제목 */}
      <h2 className="text-black typo-heading3">마이페이지</h2>

      {/* 프로필 이미지 & 닉네임 */}
      <div className="flex flex-col items-center gap-9">
        <ProfileImagePicker
          imageUrl={currentImageUrl}
          onFileChange={handleImageChange}
          onRemove={handleImageRemove}
          showRemoveButton={!!currentImageUrl}
          disabled={isPending}
          variant="mypage"
        />

        <NicknameInput
          value={nickname}
          onChange={setNickname}
          validation={nicknameValidation}
          disabled={isPending}
        />
      </div>

      {/* 하단 액션 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-base">
          <TextButton onClick={handleLogout}>로그아웃</TextButton>
          <span className="h-3 w-px bg-grey-400" aria-hidden />
          <TextButton onClick={handleDeleteClick}>탈퇴하기</TextButton>
        </div>

        <Button variant="primary" size="small" onClick={handleSave} disabled={!canSave}>
          저장
        </Button>
      </div>
    </div>
  )
}
