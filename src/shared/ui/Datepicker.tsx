import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'
import { Calendar } from '@/shared/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'

type DatePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

function DatePicker({ value, onChange, placeholder = '날짜 선택', className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          data-empty={!date}
          className={cn(
            'flex data-[empty=true]:text-grey-600 w-[265px] justify-start text-left font-normal rounded-small border border-grey-300 data-[state=open]:border-primary-300 [&_svg]:text-grey-600 data-[state=open]:[&_svg]:text-primary-300 px-base py-medium gap-small text-body1 transition-colors text-black items-center',
            className
          )}
        >
          <CalendarDays />
          {date ? (
            format(date, 'yyyy.MM.dd')
          ) : (
            <span className="text-body1 text-black">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 border-none shadow-lg" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} defaultMonth={date} />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
