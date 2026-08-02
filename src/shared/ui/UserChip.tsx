import { X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

export interface UserChipProps {
  name: string
  imageUrl?: string
  variant?: 'leader' | 'host' | 'member'
  /** 칩 크기: "default" 카드형(세로 나열용), "compact" 알약형(가로 스크롤용) */
  size?: 'default' | 'compact'
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
 * - `size="compact"`로 가로 스크롤 리스트에 적합한 알약형 칩을 표시합니다.
 * @example
 * ```tsx
 * <UserChip name="홍길동" imageUrl="/profile.jpg" />
 * <UserChip name="홍길동" selected removable onRemove={() => handleRemove()} />
 * <UserChip name="홍길동" disabled />
 * <UserChip name="홍길동" size="compact" selected />
 * ```
 */
export function UserChip({
  name,
  imageUrl,
  variant,
  size = 'default',
  selected = false,
  removable = false,
  disabled = false,
  onClick,
  onRemove,
  className,
}: UserChipProps) {
  const isCompact = size === 'compact'

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
        'inline-flex items-center justify-between border transition-colors',
        isCompact ? 'h-11 shrink-0 rounded-full px-3 py-2' : 'w-75 h-17 rounded-base p-4',
        'bg-white border-grey-300 text-black',
        removable && 'h-14',
        selected && 'border-primary-300',
        disabled && 'text-grey-400 border-grey-300',
        !disabled && 'cursor-pointer hover:bg-grey-200 shadow-[0_2px_16px_0_rgba(17,17,17,0.06)]',
        className
      )}
    >
      <div className={cn('flex items-center', isCompact ? 'gap-xsmall' : 'gap-small')}>
        <Avatar
          variant={variant}
          size={isCompact ? 'sm' : 'default'}
          className={isCompact ? 'size-7' : undefined}
        >
          {disabled && <div className="absolute inset-0 bg-white/70" />}
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
        </Avatar>

        <span className={cn(isCompact ? 'whitespace-nowrap typo-subtitle5' : 'typo-body2')}>
          {name}
        </span>
      </div>

      {removable && !disabled && (
        <button
          type="button"
          aria-label="삭제"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="flex items-center justify-center rounded-full cursor-pointer text-grey-600 hover:text-grey-800"
        >
          <X className="size-[18px]" />
        </button>
      )}
    </div>
  )
}
