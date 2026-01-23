import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

const textareaVariants = cva(
  [
    'flex w-full rounded-small border bg-white px-medium py-base outline-none transition-colors',
    'typo-body1 text-black',
    'placeholder:text-grey-600',
    'resize-none',
  ],
  {
    variants: {
      state: {
        default: 'border-grey-400 focus:border-primary-200',
        error: 'border-accent-300',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

type TextareaProps = React.ComponentProps<'textarea'> & {
  error?: boolean
  errorMessage?: string
  helperText?: string
  maxLength?: number
  height?: number
}

/**
 * Textarea (여러 줄 입력 필드)
 * - `error`, `errorMessage`, `helperText` 를 사용하여 상태 메시지를 표시합니다.
 * - `maxLength`를 설정하면 자동으로 글자 수 카운터가 표시됩니다.
 * - `height` prop으로 높이를 조절할 수 있습니다 (기본값: 180px).
 * @example
 * ```tsx
 * <Textarea height={240} maxLength={500} />
 * <Textarea error errorMessage="최소 10자 이상 입력해주세요" />
 * ```
 */
function Textarea({
  className,
  error,
  errorMessage,
  helperText,
  maxLength,
  disabled,
  value,
  height = 180,
  style,
  ...props
}: TextareaProps) {
  const currentLength = typeof value === 'string' ? value.length : 0
  const showCount = maxLength !== undefined
  const showFooter = error || helperText || showCount

  const heightValue = `${height}px`
  return (
    <div className="flex flex-col w-full gap-xsmall">
      <textarea
        data-slot="textarea"
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        style={{ height: heightValue, ...style }}
        className={cn(
          textareaVariants({ state: error ? 'error' : 'default' }),
          'textarea-scrollbar',
          disabled && 'pointer-events-none border-0 bg-grey-300 text-grey-700',
          className
        )}
        {...props}
      />
      {showFooter && (
        <div className="flex items-center justify-between w-full">
          <span className={cn('typo-body6', error ? 'text-accent-300' : 'text-grey-600')}>
            {error ? errorMessage : helperText}
          </span>
          {showCount && (
            <span className="typo-body6 text-grey-600">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { Textarea }
