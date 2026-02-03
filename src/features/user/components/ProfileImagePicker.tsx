import { Camera } from 'lucide-react'
import { useId, useRef } from 'react'

import UserAvatarIcon from '@/shared/assets/icon/UserAvatar.svg'
import { ALLOWED_IMAGE_ACCEPT, MAX_IMAGE_SIZE } from '@/shared/constants'
import { Avatar, AvatarFallback, AvatarImage, Button, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

interface ProfileImagePickerProps {
  /** 현재 표시할 이미지 URL */
  imageUrl?: string | null
  /** 파일 변경 핸들러 */
  onFileChange: (file: File) => void
  /** 이미지 제거 핸들러 */
  onRemove?: () => void
  /** 제거 버튼 표시 여부 */
  showRemoveButton?: boolean
  /** 비활성화 상태 */
  disabled?: boolean
  /** variant: 'onboarding' | 'mypage' */
  variant?: 'onboarding' | 'mypage'
}

function ProfileAvatar({ imageUrl, className }: { imageUrl?: string | null; className?: string }) {
  return (
    <Avatar className={className ?? 'size-27.5 border border-grey-300 bg-grey-200'}>
      <AvatarImage src={imageUrl ?? undefined} alt="프로필 이미지" />
      <AvatarFallback className="bg-grey-200">
        <img src={UserAvatarIcon} alt="" className="size-14.25" />
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * 프로필 이미지 선택 컴포넌트
 *
 * @description
 * - `onboarding`: 카메라 아이콘 오버레이, 이미지 클릭으로 파일 선택
 * - `mypage`: "프로필 사진 변경" 버튼 + "제거하기" 텍스트 버튼
 */
export function ProfileImagePicker({
  imageUrl,
  onFileChange,
  onRemove,
  showRemoveButton = false,
  disabled = false,
  variant = 'onboarding',
}: ProfileImagePickerProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { openAlert } = useGlobalModalStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        openAlert('파일 크기 초과', '이미지 파일은 5MB 이하만 업로드할 수 있습니다.')
        e.target.value = ''
        return
      }
      onFileChange(file)
    }
    // 같은 파일 재선택 허용을 위해 value 초기화
    e.target.value = ''
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const fileInput = (
    <input
      id={variant === 'onboarding' ? inputId : undefined}
      ref={fileInputRef}
      type="file"
      accept={ALLOWED_IMAGE_ACCEPT}
      onChange={handleFileChange}
      disabled={disabled}
      className="hidden"
    />
  )

  if (variant === 'onboarding') {
    return (
      <label htmlFor={inputId} className="flex cursor-pointer items-end pr-6.25">
        <ProfileAvatar
          imageUrl={imageUrl}
          className="relative -mr-6.25 size-27.5 border border-grey-300 bg-grey-200"
        />
        <div className="relative -mr-6.25 flex size-9.5 items-center justify-center rounded-full border-2 border-white bg-grey-500 transition-colors hover:bg-grey-600">
          <Camera className="size-5 text-white" strokeWidth={2} />
        </div>
        {fileInput}
      </label>
    )
  }

  // mypage variant
  return (
    <div className="flex flex-col items-center gap-base">
      <ProfileAvatar imageUrl={imageUrl} />
      <div className="flex w-32.5 flex-col items-center gap-small">
        <Button
          type="button"
          variant="secondary"
          size="small"
          className="w-full"
          onClick={handleButtonClick}
          disabled={disabled}
        >
          프로필 사진 변경
        </Button>
        {showRemoveButton && (
          <TextButton onClick={onRemove} disabled={disabled}>
            제거하기
          </TextButton>
        )}
      </div>
      {fileInput}
    </div>
  )
}
