import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Checkbox (체크박스)
 * - `checked`, `onCheckedChange`로 controlled 모드로 사용합니다.
 * - `defaultChecked`로 초기값을 설정할 수 있습니다.
 * - `disabled`로 비활성화할 수 있습니다.
 * @example
 * ```tsx
 * <Checkbox checked={agreed} onCheckedChange={() => setAgreed} />
 * <Checkbox defaultChecked disabled />
 * ```
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-6 shrink-0 rounded-base outline-none transition-colors',
        'grid place-content-center cursor-pointer',
        'bg-grey-400 data-[state=checked]:bg-primary-300',
        'focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    >
      <CheckIcon
        className={cn(
          'size-4 transition-colors',
          'text-grey-200 peer-data-[state=checked]:text-white'
        )}
      />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
