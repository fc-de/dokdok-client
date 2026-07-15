import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

import { useDevice } from '@/shared/hooks/useDevice'
import { cn } from '@/shared/lib/utils'
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from '@/shared/ui/BottomSheet'
import { Button } from '@/shared/ui/Button'
import { Select } from '@/shared/ui/Select'

type TimeOption = {
  value: string
  label: string
}

type TimePickerProps = {
  options: TimeOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

/**
 * TimePicker
 *
 * - PC: Select 드롭다운
 * - 모바일: BottomSheet 리스트
 */
function TimePicker({
  options,
  value,
  onValueChange,
  placeholder = '시간 선택',
  className,
  disabled,
}: TimePickerProps) {
  const { isMobile } = useDevice()
  const [open, setOpen] = React.useState(false)
  const [pendingValue, setPendingValue] = React.useState(value)

  const selectedLabel = options.find((o) => o.value === value)?.label

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) setPendingValue(value)
    setOpen(isOpen)
  }

  const handleConfirm = () => {
    onValueChange(pendingValue)
    setOpen(false)
  }

  if (isMobile) {
    return (
      <BottomSheet open={open} onOpenChange={handleOpenChange}>
        <BottomSheetTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'border-grey-300 flex w-full h-[53px] items-center justify-between gap-xsmall rounded-small border bg-transparent px-small py-xsmall typo-subtitle5 outline-none disabled:cursor-not-allowed disabled:opacity-50 max-lg:p-base',
              !value ? 'text-grey-600' : 'text-black',
              className
            )}
          >
            <span>{selectedLabel ?? placeholder}</span>
            <ChevronDownIcon className="size-4 shrink-0 text-grey-600" />
          </button>
        </BottomSheetTrigger>
        <BottomSheetContent>
          <BottomSheetHeader hideCloseButton>
            <BottomSheetTitle className="typo-m-body1 text-black">시간 선택</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody className="p-small max-h-[243px]">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPendingValue(option.value)}
                className={cn(
                  'w-full text-center py-small typo-body1 transition-colors rounded-tiny',
                  pendingValue === option.value
                    ? 'text-black typo-m-subtitle2 bg-grey-200'
                    : 'text-grey-400'
                )}
              >
                {option.label}
              </button>
            ))}
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button
              className="w-full"
              size="large"
              disabled={!pendingValue}
              onClick={handleConfirm}
            >
              완료
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    )
  }

  return (
    <Select
      placeholder={placeholder}
      className={className}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      {options.map((option) => (
        <Select.SelectItem key={option.value} value={option.value}>
          {option.label}
        </Select.SelectItem>
      ))}
    </Select>
  )
}

export { TimePicker }
export type { TimeOption }
