import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import * as React from 'react'
import type { Matcher } from 'react-day-picker'

import { useDevice } from '@/shared/hooks/useDevice'
import { cn } from '@/shared/lib/utils'
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from '@/shared/ui/BottomSheet'
import { Button } from '@/shared/ui/Button'
import { Calendar } from '@/shared/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'

type DatePickerProps = {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  disabled?: Matcher | Matcher[]
  isDisabled?: boolean
}

/**
 * DatePicker
 *
 * -날짜를 선택할 수 있는 컴포넌트입니다. 버튼 클릭 시 달력 팝오버가 나타납니다.
 *
 * -`className`에 `width` 값을 지정하여 크기를 제어합니다.(기본값: w-[265px])
 *
 * @example
 * ```tsx
 * <DatePicker value={date} onChange={setDate} placeholder="시작일을 선택하세요" className="w-[full]" />
 *
 * ```
 */

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  { value, onChange, placeholder = '날짜 선택', className, disabled, isDisabled = false },
  ref
) {
  const [date, setDate] = React.useState<Date | null>(value)
  const { isMobile } = useDevice()

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
  }

  const triggerButton = (
    <button
      ref={ref}
      type="button"
      data-empty={!date}
      disabled={isDisabled}
      className={cn(
        'flex w-full md:max-w-[265px] justify-start max-lg:justify-between text-left rounded-small border border-grey-300 data-[state=open]:border-primary-300 [&_svg]:text-grey-600 data-[state=open]:[&_svg]:text-primary-300 px-medium py-xsmall max-lg:p-base gap-small typo-subtitle5 transition-colors text-black items-center  disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <CalendarDays size={20} className="max-lg:order-last" />
      {date ? (
        format(date, 'yyyy.MM.dd')
      ) : (
        <span className="typo-subtitle5 text-grey-600">{placeholder}</span>
      )}
    </button>
  )

  if (isMobile) {
    return (
      <BottomSheet>
        <BottomSheetTrigger asChild>{triggerButton}</BottomSheetTrigger>
        <BottomSheetContent className="items-center">
          <BottomSheetHeader hideCloseButton className="w-full max-w-[375px]">
            <BottomSheetTitle className="typo-m-body1 text-black">날짜 선택</BottomSheetTitle>
          </BottomSheetHeader>
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={handleSelect}
            required
            disabled={disabled}
          />
          <div className="px-medium py-small w-full max-w-[375px]">
            <BottomSheetClose asChild>
              <Button size="large" className="w-full">
                완료
              </Button>
            </BottomSheetClose>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="p-0 border-none w-fit" align="start">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={handleSelect}
          required
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
})

export { DatePicker }
