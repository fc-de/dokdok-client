import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '../lib/utils'

const textButtonVariants = cva(
  [
    'inline-flex items-center font-normal select-none text-grey-600',
    'cursor-pointer transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-xtiny',
  ].join(' '),
  {
    variants: {
      size: {
        small: 'typo-caption1',
        medium: 'typo-body3',
      },
    },
    defaultVariants: {
      size: 'small',
    },
  }
)

export interface TextButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    VariantProps<typeof textButtonVariants> {
  /** 버튼에 표시할 아이콘 (Lucide 아이콘) */
  icon?: LucideIcon
  /** 아이콘 위치 */
  iconPosition?: 'left' | 'right'
}

/**
 * 텍스트 스타일의 가벼운 버튼 컴포넌트
 *
 * @description
 * 배경 없이 텍스트와 아이콘만으로 구성된 버튼입니다.
 * 보조 액션이나 링크 스타일의 인터랙션에 적합합니다.
 * 디자인 시스템의 색상을 활용하여 `className`으로 다양하게 커스텀할 수 있습니다.
 *
 * - `size="small"`: 작은 크기 (caption1, 기본값)
 * - `size="medium"`: 중간 크기 (body3)
 * - `icon`: 버튼에 아이콘 추가
 * - `iconPosition`: 아이콘 위치 설정 (left | right)
 *
 * @example
 * ```tsx
 * <TextButton>더보기</TextButton>
 * <TextButton size="medium">모두 보기</TextButton>
 * <TextButton icon={ChevronRight} iconPosition="right">다음</TextButton>
 * <TextButton className="text-primary-300 hover:text-primary-400">커스텀 스타일</TextButton>
 * ```
 */
export function TextButton({
  className,
  size,
  icon,
  iconPosition = 'left',
  children,
  ...props
}: TextButtonProps) {
  const iconClassName = size === 'medium' ? 'size-5' : 'size-4.5'
  const gapClassName = icon ? 'gap-xtiny' : undefined

  const renderIcon = () =>
    icon ? React.createElement(icon, { className: iconClassName, 'aria-hidden': true }) : null

  return (
    <button
      type="button"
      className={cn(textButtonVariants({ size }), gapClassName, className)}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <span>{children}</span>
      {iconPosition === 'right' && renderIcon()}
    </button>
  )
}
