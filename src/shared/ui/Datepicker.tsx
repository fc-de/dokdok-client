import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'
import { Calendar } from '@/shared/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'

type DatePickerProps = {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
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

function DatePicker({ value, onChange, placeholder = '날짜 선택', className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | null>(value)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-empty={!date}
          className={cn(
            'flex w-full md:max-w-[265px] justify-start text-left font-normal rounded-small border border-grey-300 data-[state=open]:border-primary-300 [&_svg]:text-grey-600 data-[state=open]:[&_svg]:text-primary-300 px-medium py-xsmall gap-small typo-body1 transition-colors text-black items-center text-black',
            className
          )}
        >
          <CalendarDays size={20} />
          {date ? (
            format(date, 'yyyy.MM.dd')
          ) : (
            <span className="typo-subtitle5 text-grey-600">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-none w-fit" align="start">
        <Calendar mode="single" selected={date ?? undefined} onSelect={handleSelect} required />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
