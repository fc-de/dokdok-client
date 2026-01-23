import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-small px-medium',
    'whitespace-nowrap transition-colors cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none data-[disabled=true]:pointer-events-none',
    'disabled:cursor-not-allowed data-[disabled=true]:cursor-not-allowed',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-primary-200 text-black hover:bg-primary-300 disabled:bg-grey-200 disabled:text-grey-500',
        secondary: '',
        danger: '',
        ai: 'group relative overflow-hidden bg-ai-gradient p-px disabled:opacity-50',
        cta: 'bg-grey-800 text-primary-200 hover:bg-grey-900',
      },
      size: {
        small: 'h-9 typo-body2',
        medium: 'h-11 typo-subtitle2',
        large: 'h-[54px] typo-subtitle2',
      },
      outline: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // secondary
      {
        variant: 'secondary',
        outline: true,
        class:
          'bg-white text-black border border-grey-400 hover:bg-grey-200 hover:border-grey-500 disabled:border-grey-500 disabled:text-grey-500',
      },
      {
        variant: 'secondary',
        outline: false,
        class:
          'bg-grey-200 text-black hover:bg-grey-300 disabled:bg-grey-200 disabled:text-grey-500',
      },
      // danger
      {
        variant: 'danger',
        outline: true,
        class:
          'bg-white text-accent-300 border border-accent-200 hover:border-accent-300 disabled:border-grey-500 disabled:text-grey-500',
      },
      {
        variant: 'danger',
        outline: false,
        class:
          'bg-accent-100 text-accent-300 hover:bg-accent-200 disabled:bg-grey-200 disabled:text-grey-500',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'small',
      outline: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Radix Slot을 사용하여 자식 요소에 버튼 속성을 전달 */
  asChild?: boolean
}

/**
 * 다양한 스타일 variant와 크기를 지원하는 버튼 컴포넌트
 *
 * @description
 * - `primary`: 주요 액션 버튼 (기본값)
 * - `secondary`: 보조 액션 버튼, `outline` prop으로 스타일 변경 가능
 * - `danger`: 위험/삭제 액션 버튼, `outline` prop으로 스타일 변경 가능
 * - `ai`: AI 기능 강조용 그라데이션 보더 버튼
 * - `cta`: Call-to-Action 버튼
 *
 * @example
 * ```tsx
 * <Button>기본 버튼</Button>
 * <Button variant="secondary" outline>아웃라인 버튼</Button>
 * <Button variant="danger" size="large">삭제</Button>
 * <Button variant="ai">AI로 생성하기</Button>
 * <Button asChild><a href="/link">링크 버튼</a></Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      outline,
      asChild = false,
      type,
      children,
      onClick,
      onKeyDown,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isAi = variant === 'ai'
    const isDisabledAsChild = Boolean(asChild && disabled)

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (isDisabledAsChild) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      onClick?.(e)
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
      if (isDisabledAsChild && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      onKeyDown?.(e)
    }

    return (
      <Comp
        ref={ref}
        type={!asChild ? (type ?? 'button') : undefined}
        className={cn(buttonVariants({ variant, size, outline, className }))}
        aria-disabled={isDisabledAsChild ? true : undefined}
        data-disabled={isDisabledAsChild ? 'true' : undefined}
        tabIndex={isDisabledAsChild ? -1 : props.tabIndex}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={!asChild ? disabled : undefined}
        {...props}
      >
        {isAi ? (
          <>
            <span
              aria-hidden
              className="absolute bg-white inset-px rounded-small group-hover:bg-grey-100"
            />
            <span
              data-slot="ai-inner"
              className="relative z-10 flex items-center justify-center w-full h-full"
            >
              <span className="inline-block text-ai-gradient">{children}</span>
            </span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
