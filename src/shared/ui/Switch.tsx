import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/shared/lib/utils'

function Switch({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
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
}

export { Switch }

/*
 * 사용 예시:
 *
 * import { Switch } from '@/shared/ui/Switch'
 *
 * // 기본 사용 (uncontrolled)
 * <Switch />
 *
 * // controlled
 * const [isOn, setIsOn] = useState(false)
 * <Switch checked={isOn} onCheckedChange={setIsOn} />
 *
 * // 기본값 설정
 * <Switch defaultChecked />
 *
 * // 비활성화
 * <Switch disabled />
 *
 * // 라벨과 함께 사용
 * <label className="flex items-center gap-2">
 *   <Switch checked={isOn} onCheckedChange={setIsOn} />
 *   <span>알림 받기</span>
 * </label>
 */
