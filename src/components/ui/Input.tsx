import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

const inputVariants = cva(
  [
    'flex w-full rounded-small border bg-white px-medium py-base outline-none transition-colors',
    'text-body1 text-black',
    'placeholder:text-grey-600',
  ],
  {
    variants: {
      state: {
        default: 'border-grey-400 focus:border-primary-300',
        error: 'border-accent-300',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

type InputProps = React.ComponentProps<'input'> & {
  error?: boolean
  errorMessage?: string
  helperText?: string
  maxLength?: number
  label?: string
}

/**
 * Input (단일 줄 입력 필드)
 * - `label`을 전달하면 입력 필드 상단에 라벨이 표시됩니다.
 * - `error`, `errorMessage`, `helperText` 를 사용하여 상태 메시지를 표시합니다.
 * - `maxLength`를 설정하면 자동으로 글자 수 카운터가 표시됩니다.
 * @example
 * ```tsx
 * <Input label="이름" placeholder="이름을 입력하세요" />
 * <Input error errorMessage="올바른 이메일을 입력하세요" />
 * <Input maxLength={50} helperText="최대 50자까지 입력 가능합니다" />
 * ```
 */
function Input({
  className,
  type,
  label,
  error,
  errorMessage,
  helperText,
  maxLength,
  disabled,
  value,
  ...props
}: InputProps) {
  const currentLength = typeof value === 'string' ? value.length : 0
  const showCount = maxLength !== undefined
  const showFooter = error || helperText || showCount

  return (
    <div className="flex w-full flex-col">
      {label && <p className="text-left text-subtitle3 text-black mb-medium">{label}</p>}
      <input
        type={type}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        className={cn(
          inputVariants({ state: error ? 'error' : 'default' }),
          disabled && 'pointer-events-none border-0 bg-grey-300 text-grey-700',
          className
        )}
        {...props}
      />
      {showFooter && (
        <div className="flex w-full items-center justify-between mt-xsmall">
          <span className={cn('text-body6', error ? 'text-accent-300' : 'text-grey-600')}>
            {error ? errorMessage : helperText}
          </span>
          {showCount && (
            <span className="text-body6 text-grey-600">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { Input }
