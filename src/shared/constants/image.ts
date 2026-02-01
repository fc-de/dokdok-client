/**
 * 백엔드에서 지원하는 이미지 확장자 목록
 */
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'] as const

/**
 * 이미지 파일 input의 accept 속성에 사용할 MIME 타입 문자열
 * @example <input type="file" accept={ALLOWED_IMAGE_ACCEPT} />
 */
export const ALLOWED_IMAGE_ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png'

/**
 * 허용된 이미지 MIME 타입 목록
 */
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'] as const

/**
 * 이미지 파일 최대 크기 (5MB)
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
