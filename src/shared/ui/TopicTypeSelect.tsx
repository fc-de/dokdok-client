import { createContext, type ReactNode, useContext } from 'react'

import { cn } from '@/shared/lib/utils'

// Context
interface TopicTypeSelectContextValue {
  selected: string | string[]
  type: 'single' | 'multiple'
  toggle: (value: string) => void
  disabled: boolean
}

const TopicTypeSelectContext = createContext<TopicTypeSelectContextValue | null>(null)

function useTopicTypeSelectContext() {
  const context = useContext(TopicTypeSelectContext)
  if (!context) {
    throw new Error('TopicTypeSelectItem must be used within TopicTypeSelectGroup')
  }
  return context
}

// Group - Single
interface TopicTypeSelectGroupSingleProps {
  type?: 'single'
  value: string
  onChange: (value: string) => void
  children: ReactNode
  className?: string
  disabled?: boolean
}

// Group - Multiple
interface TopicTypeSelectGroupMultipleProps {
  type: 'multiple'
  value: string[]
  onChange: (value: string[]) => void
  children: ReactNode
  className?: string
  disabled?: boolean
  maxSelection?: number
}

export type TopicTypeSelectGroupProps =
  | TopicTypeSelectGroupSingleProps
  | TopicTypeSelectGroupMultipleProps

/**
 * TopicTypeSelect (주제/유형 선택 버튼 그룹)
 * - `type`으로 단일/다중 선택을 지정합니다: single(기본), multiple
 * - `maxSelection`으로 다중 선택 시 최대 선택 개수를 제한합니다.
 * - `disabled`로 그룹 전체 또는 개별 아이템을 비활성화할 수 있습니다.
 * @example
 * ```tsx
 * <TopicTypeSelectGroup type="multiple" value={values} onChange={setValues} maxSelection={2}>
 *   <TopicTypeSelectItem value="novel">소설</TopicTypeSelectItem>
 *   <TopicTypeSelectItem value="essay">에세이</TopicTypeSelectItem>
 *   <TopicTypeSelectItem value="self-help">자기계발</TopicTypeSelectItem>
 * </TopicTypeSelectGroup>
 * ```
 */
function TopicTypeSelectGroup({
  type = 'single',
  value,
  onChange,
  children,
  className,
  disabled = false,
  ...rest
}: TopicTypeSelectGroupProps) {
  const maxSelection =
    type === 'multiple' ? (rest as { maxSelection?: number }).maxSelection : undefined

  const toggle = (itemValue: string) => {
    if (disabled) return

    if (type === 'single') {
      ;(onChange as (value: string) => void)(itemValue)
    } else {
      const currentValues = value as string[]
      if (currentValues.includes(itemValue)) {
        ;(onChange as (value: string[]) => void)(currentValues.filter((v) => v !== itemValue))
      } else {
        if (maxSelection && currentValues.length >= maxSelection) {
          return
        }
        ;(onChange as (value: string[]) => void)([...currentValues, itemValue])
      }
    }
  }

  return (
    <TopicTypeSelectContext.Provider value={{ selected: value, type, toggle, disabled }}>
      <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
    </TopicTypeSelectContext.Provider>
  )
}

// Item
export interface TopicTypeSelectItemProps {
  value: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

function TopicTypeSelectItem({
  value,
  children,
  className,
  disabled: itemDisabled = false,
}: TopicTypeSelectItemProps) {
  const { selected, type, toggle, disabled: groupDisabled } = useTopicTypeSelectContext()

  const isDisabled = groupDisabled || itemDisabled
  const isSelected = type === 'single' ? selected === value : (selected as string[]).includes(value)

  return (
    <button
      type="button"
      data-slot="topic-type-select-item"
      data-state={isSelected ? 'on' : 'off'}
      onClick={() => !isDisabled && toggle(value)}
      disabled={isDisabled}
      className={cn(
        'h-10 w-54 px-[14px] py-[10px] rounded-small border transition-colors cursor-pointer',
        'bg-white border-grey-400 text-grey-700',
        isSelected && 'border-primary-300 bg-primary-100 text-primary-300',
        isDisabled && 'invisible pointer-events-none',
        className
      )}
    >
      {children}
    </button>
  )
}

export { TopicTypeSelectGroup, TopicTypeSelectItem }
