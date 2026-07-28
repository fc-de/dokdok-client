export type StarRatingRange = {
  min: number
  max: number
}

/**
 * 별점 클릭 시 다음 선택 범위를 계산하는 순수 함수
 * - 범위 밖 클릭은 min/max를 확장, 경계 클릭은 축소, 단일 선택 재클릭은 해제
 */
export function getNextStarRange(
  range: StarRatingRange | null,
  rating: number
): StarRatingRange | null {
  if (!range) return { min: rating, max: rating }
  if (rating < range.min) return { min: rating, max: range.max }
  if (rating > range.max) return { min: range.min, max: rating }
  if (rating === range.min && rating === range.max) return null
  if (rating === range.min) return { min: range.max, max: range.max }
  if (rating === range.max) return { min: range.min, max: range.min }
  return { min: rating, max: rating }
}

/** 해당 별점이 현재 범위에 포함되는지 여부 */
export function isStarInRange(range: StarRatingRange | null, rating: number): boolean {
  if (!range) return false
  return rating >= range.min && rating <= range.max
}
