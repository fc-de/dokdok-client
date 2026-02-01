import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDebounce } from '@/shared/hooks'

import { useCheckNickname } from './useCheckNickname'
import { useDeleteProfileImage } from './useDeleteProfileImage'
import { useUpdateProfileImage } from './useUpdateProfileImage'

/**
 * 닉네임 검증 상태
 * - unchanged: 변경 없음 (메시지 없음)
 * - typing: 입력 중, 디바운스 대기 (메시지 없음)
 * - tooShort: 2자 미만 (에러 메시지)
 * - invalidFormat: 허용되지 않은 문자 포함 (에러 메시지)
 * - checking: 중복 체크 중 (로딩)
 * - duplicate: 중복됨 (에러 메시지)
 * - available: 사용 가능 (성공 메시지)
 */
type NicknameStatus =
  | 'unchanged'
  | 'typing'
  | 'tooShort'
  | 'invalidFormat'
  | 'checking'
  | 'duplicate'
  | 'available'

/** 닉네임 상태별 에러 메시지 */
const NICKNAME_ERROR_MESSAGES: Partial<Record<NicknameStatus, string>> = {
  tooShort: '닉네임은 2자 이상 입력해주세요',
  invalidFormat: '닉네임은 한글, 영문, 숫자만 사용 가능합니다',
  duplicate: '중복된 닉네임이 존재합니다',
}

/** 닉네임 상태별 헬퍼 메시지 */
const NICKNAME_HELPER_MESSAGES: Partial<Record<NicknameStatus, string>> = {
  available: '사용 가능한 닉네임입니다',
}

/** 에러 상태 목록 */
const NICKNAME_ERROR_STATUSES: NicknameStatus[] = ['tooShort', 'invalidFormat', 'duplicate']

export interface NicknameValidation {
  status: NicknameStatus
  isError: boolean
  errorMessage?: string
  helperText?: string
}

interface UseProfileFormOptions {
  initialNickname?: string
  initialImageUrl?: string | null
  /** 닉네임 변경 여부 체크 (마이페이지에서 기존 닉네임과 같으면 중복 체크 스킵) */
  checkNicknameChange?: boolean
  /** 이미지 변경/제거 시 즉시 API 호출 */
  immediateImageUpload?: boolean
}

export function useProfileForm(options: UseProfileFormOptions = {}) {
  const {
    initialNickname = '',
    initialImageUrl = null,
    checkNicknameChange = false,
    immediateImageUpload = false,
  } = options

  // 즉시 업로드 모드용 mutation
  const { mutate: uploadImage, isPending: isUploadingImage } = useUpdateProfileImage()
  const { mutate: removeImage, isPending: isRemovingImage } = useDeleteProfileImage()

  // 상태
  const [nickname, setNickname] = useState(initialNickname)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)

  // initialNickname 변경 시 nickname 상태 동기화 (비동기 user 데이터 로드 대응)
  useEffect(() => {
    setNickname(initialNickname)
  }, [initialNickname])

  // 닉네임 유효성 검사 (한글/영문/숫자만 허용, 완성된 한글만)
  // - 한글 자모음만 있는 경우(ㄱ, ㅏ 등)는 조합 중인 상태로 판단하여 제외
  const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]+$/
  const isNicknameValidFormat = NICKNAME_REGEX.test(nickname)

  // 닉네임 중복 체크 (디바운싱 적용)
  const debouncedNickname = useDebounce(nickname, 500)
  const isNicknameChanged = !checkNicknameChange || nickname !== initialNickname
  // 유효한 형식일 때만 중복 체크 API 호출
  // debouncedNickname이 초기값과 같으면 중복 체크 스킵
  const shouldCheckNickname =
    debouncedNickname.length >= 2 &&
    isNicknameChanged &&
    debouncedNickname !== initialNickname &&
    NICKNAME_REGEX.test(debouncedNickname)

  const { data: nicknameCheck, isFetching: isCheckingNickname } = useCheckNickname(
    debouncedNickname,
    shouldCheckNickname
  )

  // 닉네임 상태 계산
  const nicknameStatus: NicknameStatus = useMemo(() => {
    // 변경되지 않음 (마이페이지에서 초기값과 동일할 때)
    if (!isNicknameChanged) return 'unchanged'
    // 아직 입력 전 (온보딩에서 빈 상태)
    if (nickname.length === 0) return 'unchanged'
    // 입력 중 (디바운스 대기)
    if (nickname !== debouncedNickname) return 'typing'
    // 2자 미만
    if (nickname.length < 2) return 'tooShort'
    // 허용되지 않은 문자 포함
    if (!isNicknameValidFormat) return 'invalidFormat'
    // 중복 체크 중
    if (isCheckingNickname || nicknameCheck === undefined) return 'checking'
    // 중복됨 / 사용 가능
    return nicknameCheck.available ? 'available' : 'duplicate'
  }, [
    nickname,
    debouncedNickname,
    isNicknameChanged,
    isNicknameValidFormat,
    isCheckingNickname,
    nicknameCheck,
  ])

  // 닉네임 사용 가능 여부
  const isNicknameAvailable = nicknameStatus === 'unchanged' || nicknameStatus === 'available'

  // 닉네임 검증 결과 (UI에 전달할 데이터)
  const nicknameValidation: NicknameValidation = useMemo(
    () => ({
      status: nicknameStatus,
      isError: NICKNAME_ERROR_STATUSES.includes(nicknameStatus),
      errorMessage: NICKNAME_ERROR_MESSAGES[nicknameStatus],
      helperText: NICKNAME_HELPER_MESSAGES[nicknameStatus],
    }),
    [nicknameStatus]
  )

  // 이미지 핸들러
  const handleImageChange = useCallback(
    (file: File | null) => {
      if (!file) return

      if (immediateImageUpload) {
        // 즉시 업로드 모드: API 호출 후 성공 시에만 반영
        uploadImage(file)
      } else {
        // 지연 업로드 모드: 로컬 상태만 변경
        setProfileImageFile(file)
        setIsRemoving(false)
        const reader = new FileReader()
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [immediateImageUpload, uploadImage]
  )

  const handleImageRemove = useCallback(() => {
    if (immediateImageUpload) {
      // 즉시 업로드 모드: API 호출
      removeImage()
    } else {
      // 지연 업로드 모드: 로컬 상태만 변경
      setProfileImageFile(null)
      setProfileImagePreview(null)
      setIsRemoving(true)
    }
  }, [immediateImageUpload, removeImage])

  // 현재 표시할 이미지 URL
  const displayImageUrl = isRemoving ? null : (profileImagePreview ?? initialImageUrl)

  // 변경 사항 여부
  const hasChanges = nickname !== initialNickname || profileImageFile !== null || isRemoving

  // 이미지 업로드/삭제 로딩 상태
  const isImagePending = isUploadingImage || isRemovingImage

  // 버튼 활성화 조건
  const canSubmit =
    nickname.length >= 2 &&
    isNicknameValidFormat &&
    debouncedNickname === nickname &&
    isNicknameAvailable &&
    !isImagePending

  return {
    // 상태
    nickname,
    setNickname,
    profileImagePreview,
    profileImageFile,
    isRemoving,
    displayImageUrl,

    // 닉네임 검증
    nicknameValidation,

    // 핸들러
    handleImageChange,
    handleImageRemove,

    // 유틸
    hasChanges,
    canSubmit,
    isImagePending,
  }
}
