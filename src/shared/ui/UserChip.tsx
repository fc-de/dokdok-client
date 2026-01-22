import { X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

export interface UserChipProps {
    name: string
    imageUrl?: string
    selected?: boolean
    removable?: boolean
    disabled?: boolean
    onClick?: () => void
    onRemove?: () => void
    className?: string
}

/**
 * UserChip (사용자 정보 칩)
 * - `imageUrl`로 프로필 이미지를 표시합니다.
 * - `selected`로 선택 상태를 표시합니다.
 * - `removable`을 설정하면 삭제 버튼(X)이 표시됩니다.
 * @example
 * ```tsx
 * <UserChip name="홍길동" imageUrl="/profile.jpg" />
 * <UserChip name="홍길동" selected removable onRemove={() => handleRemove()} />
 * <UserChip name="홍길동" disabled />
 * ```
 */
export function UserChip({
    name,
    imageUrl,
    selected = false,
    removable = false,
    disabled = false,
    onClick,
    onRemove,
    className,
}: UserChipProps) {
    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            data-slot="user-chip"
            onClick={() => {
                if (disabled) return
                onClick?.()
            }}
            onKeyDown={(e) => {
                if (disabled) return
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick?.()
                }
            }}
            className={cn(
                'w-75 h-17 inline-flex items-center justify-between rounded-base p-4 border transition-colors',
                'bg-white border-grey-300 text-black',
                removable && 'h-14',
                selected && 'border-primary-300',
                disabled && 'text-grey-400 border-grey-300',
                !disabled &&
                'cursor-pointer hover:bg-grey-200 shadow-[0_2px_16px_0_rgba(17,17,17,0.06)]',
                className
            )}
        >

            <div className='flex gap-small items-center'>
                <Avatar>
                    {disabled && <div className="absolute inset-0 bg-white/70" />}
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                        {name.slice(0, 1)}
                    </AvatarFallback>
                </Avatar>

                <span className="text-body2">{name}</span>
            </div>

            {removable && !disabled && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove?.()
                    }}
                    className="flex items-center justify-center rounded-full text-grey-600 hover:text-grey-800 cursor-pointer"
                >
                    <X className="size-[18px]" />
                </button>
            )}
        </div>
    )
}