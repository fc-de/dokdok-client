import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { type DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { Button, buttonVariants } from '@/components/ui/Button'
import { cn } from '@/shared/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{ before: new Date() }}
      className={cn(
        'bg-white group/calendar [--cell-size:--spacing(8)] pt-medium px-medium pb-base rounded-base in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      modifiers={{
        dayOfWeek: { dayOfWeek: [0, 6] },
      }}
      modifiersClassNames={{
        dayOfWeek: 'is-weekend',
      }}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('ko-KR', { month: 'long' }),
        formatYearDropdown: (date) => `${date.getFullYear()}년`,
        formatCaption: (date) =>
          `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`,
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-30 p-0 select-none hover:bg-grey-200',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-30 p-0 select-none hover:bg-grey-200',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn('absolute bg-popover inset-0 opacity-0', defaultClassNames.dropdown),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-body3'
            : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-grey-700 flex-1 rounded-small font-medium text-[0.8rem] select-none',
          defaultClassNames.weekday
        ),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
        week_number: cn('text-[0.8rem] select-none text-grey-600', defaultClassNames.week_number),
        day: cn(
          'relative w-full h-full p-0 text-center group/day select-none [&:last-child[data-selected=true]_button]:rounded-r-small aspect-square',
          props.showWeekNumber
            ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-small'
            : '[&:first-child[data-selected=true]_button]:rounded-l-small',
          defaultClassNames.day
        ),
        range_start: cn('rounded-l-small bg-grey-200', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-r-small bg-grey-200', defaultClassNames.range_end),
        today: cn(
          'bg-transparent text-black font-semibold rounded-small data-[selected=true]:rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'text-grey-500 aria-selected:text-grey-500 opacity-50',
          defaultClassNames.outside
        ),
        disabled: cn('text-grey-400', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className={cn('size-4 text-grey-600', className)} {...props} />
          }

          if (orientation === 'right') {
            return <ChevronRightIcon className={cn('size-4 text-grey-600', className)} {...props} />
          }

          return <ChevronDownIcon className={cn('size-4', className)} {...props} />
        },

        DayButton: CalendarDayButton,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'data-[selected-single=true]:bg-grey-300 data-[selected-single=true]:text-black data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-grey-300 data-[range-start=true]:text-black data-[range-end=true]:bg-grey-300 data-[range-end=true]:text-black flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 data-[range-end=true]:rounded-small data-[range-end=true]:rounded-r-small data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-small data-[range-start=true]:rounded-l-small [&>span]:text-xs [&>span]:opacity-70 group-[.is-weekend]/day:text-accent-300 group-[.is-weekend]/day:data-[selected-single=true]:text-accent-300 group-[.is-weekend]/day:hover:text-accent-300 group-[.is-weekend]/day:disabled:text-grey-400',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
