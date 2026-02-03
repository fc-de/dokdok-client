import { ChevronDownIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { Children, cloneElement, isValidElement, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'

type FilterDropdownColor = 'primary' | 'yellow' | 'purple'

type FilterDropdownProps = {
  placeholder: string
  children: React.ReactNode
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  color?: FilterDropdownColor
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type OptionProps = {
  value: string
  children: string
  selected?: boolean
  onSelect?: (value: string) => void
  color?: FilterDropdownColor
}

const optionColorStyles: Record<FilterDropdownColor, string> = {
  primary: 'bg-primary-100 typo-body2 text-primary-300 border border-primary-300',
  yellow: 'bg-yellow-100 typo-body2 text-yellow-200 border border-yellow-200',
  purple: 'bg-purple-100 typo-body2 text-purple-200 border border-purple-200',
}

function Option({ value, children, selected = false, onSelect, color = 'primary' }: OptionProps) {
  return (
    <Chip
      onClick={() => onSelect?.(value)}
      className={cn(
        'cursor-pointer rounded-tiny bg-grey-300 py-[5px] px-xsmall typo-body4 transition-colors',
        selected && optionColorStyles[color]
      )}
    >
      {children}
    </Chip>
  )
}

const triggerColorStyles: Record<FilterDropdownColor, string> = {
  primary: 'bg-primary-100 text-primary-300 border border-primary-300',
  yellow: 'bg-yellow-100 text-yellow-200 border border-yellow-300',
  purple: 'bg-purple-100 text-purple-200 border border-purple-300',
}

const iconColorStyles: Record<FilterDropdownColor, string> = {
  primary: 'text-primary-300',
  yellow: 'text-yellow-200',
  purple: 'text-purple-200',
}

function FilterDropdown({
  placeholder,
  children,
  value,
  onChange,
  disabled = false,
  color = 'primary',
  open: controlledOpen,
  onOpenChange,
}: FilterDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

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
        color,
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
            hasValue && !disabled && triggerColorStyles[color]
          )}
        >
          {displayText}
          <ChevronDownIcon
            className={cn(
              'size-4',
              disabled ? 'text-grey-500' : hasValue ? iconColorStyles[color] : 'text-grey-700'
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
