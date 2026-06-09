import { cva } from 'class-variance-authority'
import type { ChangeEvent, ComponentProps, CSSProperties, FormEvent } from 'react'

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

type TextareaProps = ComponentProps<'textarea'> & {
  error?: boolean
  errorMessage?: string
  helperText?: string
  maxLength?: number
  height?: number
  counter?: boolean
  format?: 'default' | 'comment'
}

/**
 * Textarea (여러 줄 입력 필드)
 * - `error`, `errorMessage`, `helperText` 를 사용하여 상태 메시지를 표시합니다.
 * - `maxLength`를 설정하면 자동으로 글자 수 카운터가 표시됩니다.
 * - `counter={false}`로 설정하면 카운터를 숨길 수 있습니다.
 * - `height` prop으로 높이를 조절할 수 있습니다 (기본값: default 모드 180px, comment 모드 48px).
 * - `format="comment"`로 설정하면 댓글 입력창 스타일로 동작합니다 (자동 높이 조정, 최대 128px).
 * @example
 * ```tsx
 * <Textarea height={240} maxLength={500} />
 * <Textarea error errorMessage="최소 10자 이상 입력해주세요" />
 * <Textarea format="comment" maxLength={500} placeholder="댓글을 입력하세요" />
 * <Textarea maxLength={100} counter={false} />
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
  height,
  style,
  counter = true,
  format = 'default',
  onChange,
  onInput,
  ...props
}: TextareaProps) {
  const currentLength = typeof value === 'string' ? value.length : 0
  const showCount = maxLength !== undefined && counter
  const showFooter = error || helperText || showCount

  // format에 따라 기본 높이 설정
  const baseHeight = height ?? (format === 'comment' ? 48 : 180)
  const maxHeight = format === 'comment' ? 128 : baseHeight

  const handleInput = (e: FormEvent<HTMLTextAreaElement>) => {
    if (format === 'comment') {
      const target = e.currentTarget
      // 초기 높이로 리셋
      target.style.height = `${baseHeight}px`
      const scrollHeight = target.scrollHeight

      // 초기 높이보다 크면 조정
      if (scrollHeight > baseHeight) {
        target.style.height = 'auto'
        const newHeight = Math.min(target.scrollHeight, maxHeight)
        target.style.height = `${newHeight}px`
      }
    }
    onInput?.(e)
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e)
  }

  const computedStyle: CSSProperties =
    format === 'comment'
      ? { ...style, height: `${baseHeight}px`, maxHeight: `${maxHeight}px` }
      : { ...style, height: `${baseHeight}px` }

  return (
    <div className="flex flex-col w-full gap-xsmall">
      <textarea
        data-slot="textarea"
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        onInput={handleInput}
        style={computedStyle}
        className={cn(
          textareaVariants({ state: error ? 'error' : 'default' }),
          disabled ? 'custom-scroll-grey200' : 'custom-scroll',
          'overflow-y-auto',
          disabled && 'border-0 bg-grey-300 text-grey-700',
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
