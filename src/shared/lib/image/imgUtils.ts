import { ALLOWED_IMAGE_MIME_TYPES } from '@/shared/constants'

/**
 * 파일이 허용된 이미지 형식인지 검증
 * @param file - 검증할 파일
 * @returns 허용된 이미지 형식이면 true
 */
export function isAllowedImageFile(file: File): boolean {
  const allowedMimeTypes: readonly string[] = ALLOWED_IMAGE_MIME_TYPES
  return allowedMimeTypes.includes(file.type)
}
