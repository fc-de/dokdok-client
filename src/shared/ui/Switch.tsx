import * as SwitchPrimitive from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Switch (토글 스위치)
 * - `checked`, `onCheckedChange`로 controlled 모드로 사용합니다.
 * - `defaultChecked`로 초기값을 설정할 수 있습니다.
 * - `disabled`로 비활성화할 수 있습니다.
 * @example
 * ```tsx
 * <Switch checked={isOn} onCheckedChange={setIsOn} />
 * <Switch defaultChecked disabled />
 * ```
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        'peer inline-flex shrink-0 items-center w-10 h-6 p-[3px] rounded-base transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary-300 data-[state=unchecked]:bg-grey-400',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-white pointer-events-none block size-[18px] rounded-full transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
})
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
