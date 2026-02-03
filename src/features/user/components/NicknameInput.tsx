import { Input } from '@/shared/ui'

import type { NicknameValidation } from '../hooks/useProfileForm'

interface NicknameInputProps {
  value: string
  onChange: (value: string) => void
  validation: NicknameValidation
  maxLength?: number
  disabled?: boolean
  placeholder?: string
}

/**
 * 닉네임 입력 컴포넌트
 *
 * @description
 * - useProfileForm에서 제공하는 validation 정보를 받아 UI 렌더링
 */
export function NicknameInput({
  value,
  onChange,
  validation,
  maxLength = 20,
  disabled = false,
  placeholder = '닉네임을 입력해주세요',
}: NicknameInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      error={validation.isError}
      errorMessage={validation.errorMessage}
      helperText={validation.helperText}
    />
  )
}
