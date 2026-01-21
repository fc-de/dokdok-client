import { ThumbsUp } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export interface LikeButtonProps {
    count: number
    isLiked?: boolean
    onClick?: (liked: boolean) => void
    disabled?: boolean
    className?: string
}

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
                'inline-flex items-center gap-tiny rounded-small px-[10px] py-tiny text-caption1 transition-colors',
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

/*
 * 사용 예시:
 *
 * import { useState } from 'react'
 * import { LikeButton } from '@/shared/ui/LikeButton'
 *
 * function Example() {
 *   const [isLiked, setIsLiked] = useState(false)
 *   const [count, setCount] = useState(42)
 *
 *   const handleClick = async (liked: boolean) => {
 *     // API 호출
 *     if (liked) {
 *       await api.post('/like', { postId: 123 })
 *     } else {
 *       await api.delete('/like', { postId: 123 })
 *     }
 *     // 상태 업데이트
 *     setIsLiked(liked)
 *     setCount((prev) => (liked ? prev + 1 : prev - 1))
 *   }
 *
 *   return (
 *     <LikeButton
 *       count={count}
 *       isLiked={isLiked}
 *       onClick={handleClick}
 *     />
 *   )
 * }
 *
 * // 기본 상태 (좋아요 안 함)
 * <LikeButton count={10} isLiked={false} onClick={handleClick} />
 *
 * // 좋아요 상태
 * <LikeButton count={11} isLiked onClick={handleClick} />
 *
 * // 비활성화
 * <LikeButton count={5} disabled onClick={handleClick} />
 */
