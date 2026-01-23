import { ThumbsUp } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export interface LikeButtonProps {
  count: number
  isLiked?: boolean
  onClick?: (liked: boolean) => void
  disabled?: boolean
  className?: string
}

/**
 * LikeButton (좋아요 버튼)
 * - `count`로 좋아요 수를 표시합니다.
 * - `isLiked`로 좋아요 상태를 표시합니다.
 * - `onClick` 콜백은 토글된 liked 값을 인자로 받습니다.
 * @example
 * ```tsx
 * <LikeButton count={42} isLiked={isLiked} onClick={(liked) => setIsLiked(liked)} />
 * <LikeButton count={5} disabled />
 * ```
 */
function LikeButton({
  count,
  isLiked = false,
  onClick,
  disabled = false,
  className,
}: LikeButtonProps) {
  const handleClick = () => {
    if (disabled) return
    onClick?.(!isLiked)
  }

  return (
    <button
      type="button"
      data-slot="like-button"
      data-liked={isLiked}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-tiny rounded-small px-[10px] py-tiny typo-caption1 transition-colors',
        isLiked
          ? 'border border-primary-300 bg-primary-100 text-primary-300'
          : 'border border-grey-400 bg-white text-grey-700',
        disabled && 'border-transparent',
        !disabled && 'cursor-pointer',
        className
      )}
    >
      <ThumbsUp
        className={cn(
          'size-4 fill-current stroke-none',
          isLiked ? 'text-primary-300' : 'text-grey-700'
        )}
      />
      <span>{count}</span>
    </button>
  )
}

export { LikeButton }
