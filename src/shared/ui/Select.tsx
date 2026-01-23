import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

type SelectProps = {
  placeholder?: string
  className?: string
  children: React.ReactNode
  label?: string
} & React.ComponentProps<typeof SelectPrimitive.Root>

function Select({ placeholder, className, children, label, ...props }: SelectProps) {
  return (
    <SelectPrimitive.Root data-slot="select" {...props}>
      <SelectTrigger className={className} label={label}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </SelectPrimitive.Root>
  )
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  children,
  label,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & { label?: string }) {
  return (
    <div className="flex flex-col justify-end">
      {label && <p className="text-left typo-body4 text-grey-600 mb-tiny">{label}</p>}
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={cn(
          "border-primary-300 text-black flex w-[265px] h-[53px] items-center justify-between gap-xsmall rounded-base border bg-transparent px-small py-xsmall typo-subtitle5 whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-xsmall [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 text-primary-300" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    </div>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  align = 'start',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[250px] min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-hidden rounded-base border shadow-drop',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'p-xtiny w-full custom-scroll select-scroll-visible',
            position === 'popper' && 'min-w-(--radix-select-trigger-width)'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "text-black relative flex w-full cursor-default items-center gap-small px-large py-base typo-body1 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[state=checked]:bg-grey-200 hover:bg-grey-100 data-[state=checked]:rounded-tiny  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-(--radix-select-trigger-height)",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/**
 * SelectNamespace (Select wrapper)
 * - `Select.SelectItem`을 children으로 넣어 사용합니다.
 * - `label`을 전달하면 입력 필드 상단에 라벨이 표시됩니다.
 * - `Select`의 `className`에 `width`, `height`를 지정하여 크기를 제어합니다.(기본값: w-265px, h-53px)
 * @example
 * ```tsx
 * <Select placeholder="과일을 선택하세요" label="과일">
 *   <Select.SelectItem value="apple">Apple</Select.SelectItem>
 *   <Select.SelectItem value="banana">Banana</Select.SelectItem>
 *   <Select.SelectItem value="blueberry">Blueberry</Select.SelectItem>
 * </Select>
 * ```
 */

// Namespace pattern
const SelectNamespace = Object.assign(Select, {
  SelectItem,
})

export { SelectNamespace as Select, SelectItem }
