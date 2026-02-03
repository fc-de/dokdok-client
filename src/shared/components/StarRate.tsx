import { Star } from 'lucide-react'
import type { HTMLAttributes, MouseEvent } from 'react'

import { cn } from '@/shared/lib/utils'

export interface StarRateProps extends HTMLAttributes<HTMLDivElement> {
  /** 별점 (0 ~ 5, 0.5 단위) */
  rating: number
  /** 별 크기 (px) */
  size?: number
  /** 클릭 가능 여부 */
  interactive?: boolean
  /** 별점 변경 콜백 (interactive=true일 때만 사용) */
  onRatingChange?: (rating: number) => void
}

interface SingleStarProps {
  /** 채워진 비율 (0, 0.5, 1) */
  fillRatio: number
  /** 별 크기 (px) */
  size: number
}

function SingleStar({ fillRatio, size }: SingleStarProps) {
  if (fillRatio === 0) {
    return <Star size={size} className="text-grey-300" fill="currentColor" strokeWidth={0} />
  }

  if (fillRatio === 1) {
    return <Star size={size} className="text-yellow-200" fill="currentColor" strokeWidth={0} />
  }

  // 반쪽 별: 두 개의 별을 겹쳐서 표현
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* 배경 별 (grey) */}
      <Star size={size} className="text-grey-300" fill="currentColor" strokeWidth={0} />
      {/* 채워진 별 (yellow) - 절반만 보이도록 clip */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
        <Star size={size} className="text-yellow-200" fill="currentColor" strokeWidth={0} />
      </div>
    </div>
  )
}

/**
 * 별점 표시 컴포넌트
 * - 0 ~ 5 사이의 별점을 0.5 단위로 표시합니다
 * - 채워지지 않은 별은 grey-300, 채워진 별은 yellow-200으로 표시됩니다
 * @example
 * ```tsx
 * <StarRate rating={3.5} />
 * <StarRate rating={4} size={24} />
 * <StarRate rating={2.5} size={16} />
 * <StarRate rating={rating} interactive onRatingChange={setRating} />
 * ```
 */
function StarRate({
  rating,
  size = 20,
  interactive = false,
  onRatingChange,
  className,
  ...props
}: StarRateProps) {
  // rating을 0.5 단위로 반올림하고 0~5 범위로 제한
  const normalizedRating = Math.min(5, Math.max(0, Math.round(rating * 2) / 2))

  const stars = [1, 2, 3, 4, 5].map((starIndex) => {
    if (normalizedRating >= starIndex) {
      return 1
    } else if (normalizedRating >= starIndex - 0.5) {
      return 0.5
    } else {
      return 0
    }
  })

  const handleStarClick = (starIndex: number, event: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onRatingChange) return

    // 별의 왼쪽 절반을 클릭하면 0.5, 오른쪽 절반을 클릭하면 1.0
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const isLeftHalf = clickX < rect.width / 2

    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex
    onRatingChange(newRating)
  }

  return (
    <div
      data-slot="star-rate"
      className={cn('flex items-center', interactive && 'cursor-pointer', className)}
      {...props}
    >
      {stars.map((fillRatio, index) => (
        <div key={index} onClick={(e) => handleStarClick(index + 1, e)}>
          <SingleStar fillRatio={fillRatio} size={size} />
        </div>
      ))}
    </div>
  )
}

export { StarRate }
