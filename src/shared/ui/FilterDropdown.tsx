import { ChevronDownIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { Children, cloneElement, isValidElement, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'

type FilterDropdownProps = {
  placeholder: string
  children: React.ReactNode
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

type OptionProps = {
  value: string
  children: string
  selected?: boolean
  onSelect?: (value: string) => void
}

function Option({ value, children, selected = false, onSelect }: OptionProps) {
  return (
    <Chip
      onClick={() => onSelect?.(value)}
      className={cn(
        'cursor-pointer rounded-tiny bg-grey-300 py-[5px] px-xsmall typo-body4 transition-colors',
        selected && 'bg-primary-100 typo-body2 text-primary-300 border border-primary-300'
      )}
    >
      {children}
    </Chip>
  )
}

function FilterDropdown({
  placeholder,
  children,
  value,
  onChange,
  disabled = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false)

  const selectedChild = Children.toArray(children).find(
    (child) => isValidElement(child) && child.props.value === value
  )
  const displayText =
    selectedChild && isValidElement(selectedChild)
      ? (selectedChild.props.children as string)
      : placeholder

  const handleSelect = (selectedValue: string) => {
    onChange?.(value === selectedValue ? '' : selectedValue)
    setOpen(false)
  }

  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as ReactElement<OptionProps>, {
        selected: child.props.value === value,
        onSelect: handleSelect,
      })
    }
    return child
  })

  const hasValue = !!value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          disabled={disabled}
          className={cn(
            'flex gap-1 rounded-tiny typo-body3 px-tiny py-[5px] [&_svg]:transition-transform data-[state=open]:[&_svg]:rotate-180 text-grey-700',
            disabled && 'bg-grey-200 text-grey-500',
            hasValue &&
              !disabled &&
              'bg-primary-100 text-primary-300 border border-primary-300 hover:bg-primary-100'
          )}
        >
          {displayText}
          <ChevronDownIcon
            className={cn(
              'size-4',
              disabled ? 'text-grey-500' : hasValue ? 'text-primary-300' : 'text-grey-700'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex flex-col bg-white border p-small border-grey-300 rounded-tiny gap-xsmall w-[264px]"
        sideOffset={8}
      >
        <p className="typo-body3 text-grey-600">{placeholder}</p>
        <div className="flex flex-wrap gap-xsmall">{enhancedChildren}</div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * 단일 선택 필터 컴포넌트 (토글 지원)
 * - `FilterDropdown.Option`을 children으로 넣어 사용합니다.
 *
 * @example
 * <FilterDropdown placeholder="독서모임" value={selected} onChange={setSelected}>
 *   <FilterDropdown.Option value="0">옵션 1</FilterDropdown.Option>
 *   <FilterDropdown.Option value="1">옵션 2</FilterDropdown.Option>
 * </FilterDropdown>
 */

const FilterDropdownNamespace = Object.assign(FilterDropdown, {
  Option,
})

export { FilterDropdownNamespace as FilterDropdown }
