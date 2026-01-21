import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from '@/shared/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-6 shrink-0 rounded-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        'bg-grey-400 data-[state=checked]:bg-primary-300',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        forceMount
        className="grid place-content-center text-white"
      >
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

/*
 * 사용 예시:
 *
 * import { Checkbox } from '@/shared/ui/Checkbox'
 *
 * // 기본 사용 (uncontrolled)
 * <Checkbox />
 *
 * // controlled
 * const [checked, setChecked] = useState(false)
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 *
 * // 기본값 설정
 * <Checkbox defaultChecked />
 *
 * // 비활성화
 * <Checkbox disabled />
 *
 * // 라벨과 함께 사용
 * <label className="flex items-center gap-2">
 *   <Checkbox checked={agreed} onCheckedChange={setAgreed} />
 *   <span>약관에 동의합니다</span>
 * </label>
 */
