import { Search } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

type SearchFieldProps = Omit<React.ComponentProps<'input'>, 'type'>

/**
 * SearchField (검색 입력 필드)
 * - 왼쪽에 검색 아이콘이 포함된 입력 필드입니다.
 * - `placeholder`, `value`, `onChange` 등 표준 input 속성을 지원합니다.
 * @example
 * ```tsx
 * <SearchField placeholder="검색어를 입력하세요" />
 * <SearchField value={query} onChange={(e) => setQuery(e.target.value)} />
 * ```
 */
const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex h-[53px] w-full items-center gap-xsmall rounded-small border bg-white px-[14px]',
          'border-grey-400',
          'focus-within:border-primary-300',
          'transition-colors',
          className
        )}
      >
        <Search className="size-4.5 shrink-0 text-grey-600" strokeWidth={1.5} />
        <input
          ref={ref}
          type="text"
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent outline-none',
            'typo-body1 text-black',
            'placeholder:text-grey-600',
            disabled && 'pointer-events-none'
          )}
          {...props}
        />
      </div>
    )
  }
)
SearchField.displayName = 'SearchField'

export { SearchField }
