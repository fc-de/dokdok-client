import { createContext, useContext, type ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

// Context
interface NumberedCheckboxContextValue {
    selected: string[]
    toggle: (id: string) => void
}

const NumberedCheckboxContext =
    createContext<NumberedCheckboxContextValue | null>(null)

function useNumberedCheckboxContext() {
    const context = useContext(NumberedCheckboxContext)
    if (!context) {
        throw new Error(
            'NumberedCheckbox must be used within NumberedCheckboxGroup'
        )
    }
    return context
}

// Group
export interface NumberedCheckboxGroupProps {
    value: string[]
    onChange: (value: string[]) => void
    children: ReactNode
    className?: string
}

function NumberedCheckboxGroup({
    value,
    onChange,
    children,
    className,
}: NumberedCheckboxGroupProps) {
    const toggle = (id: string) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id))
        } else {
            onChange([...value, id])
        }
    }

    return (
        <NumberedCheckboxContext.Provider value={{ selected: value, toggle }}>
            <div className={className}>{children}</div>
        </NumberedCheckboxContext.Provider>
    )
}

// Checkbox
export interface NumberedCheckboxProps {
    id: string
    className?: string
    children?: ReactNode
    disabled?: boolean
}

function NumberedCheckbox({ id, className, children, disabled = false }: NumberedCheckboxProps) {
    const { selected, toggle } = useNumberedCheckboxContext()

    const index = selected.indexOf(id)
    const isChecked = index !== -1
    const displayNumber = isChecked ? index + 1 : undefined

    return (
        <div className="inline-flex items-center gap-2 align-middle">
            <button
                type="button"
                data-slot="numbered-checkbox"
                data-state={isChecked ? 'checked' : 'unchecked'}
                onClick={() => !disabled && toggle(id)}
                disabled={disabled}
                className={cn(
                    'inline-flex items-center justify-center size-8 shrink-0 rounded-medium border transition-colors align-middle',
                    disabled
                        ? 'invisible pointer-events-none'
                        : 'cursor-pointer',
                    isChecked
                        ? 'bg-primary-200 border-primary-200'
                        : 'bg-transparent border-grey-300',
                    className
                )}
            >
                <span className={cn(
                    'text-body3 leading-none',
                    isChecked ? 'text-black' : 'invisible'
                )}>
                    {displayNumber ?? 0}
                </span>
            </button>
            {children && <span className="align-middle">{children}</span>}
        </div>
    )
}

export { NumberedCheckboxGroup, NumberedCheckbox }

/*
 * 사용 예시:
 *
 * import { useState } from 'react'
 * import { NumberedCheckboxGroup, NumberedCheckbox } from '@/shared/ui/NumberedCheckbox'
 *
 * function Example() {
 *   const [selected, setSelected] = useState<string[]>([])
 *
 *   return (
 *     <NumberedCheckboxGroup
 *       value={selected}
 *       onChange={setSelected}
 *       className="flex flex-col gap-3"
 *     >
 *       <NumberedCheckbox id="a">항목 A</NumberedCheckbox>
 *       <NumberedCheckbox id="b">항목 B</NumberedCheckbox>
 *       <NumberedCheckbox id="c">항목 C</NumberedCheckbox>
 *       <NumberedCheckbox id="d" disabled>비활성화 항목</NumberedCheckbox>
 *     </NumberedCheckboxGroup>
 *   )
 * }
 *
 * // 클릭 순서대로 번호가 매겨짐
 * // A → C → B 순서로 클릭하면: A(1), C(2), B(3)
 * // 선택 해제하면 뒤 번호가 당겨짐
 *
 * // 선택된 값 활용 (서버 전송 등)
 * // selected = ['a', 'c', 'b'] (배열 순서 = 선택 순서)
 *
 * // 객체로 변환
 * const orderMap = Object.fromEntries(selected.map((id, i) => [id, i + 1]))
 * // { a: 1, c: 2, b: 3 }
 *
 * // 배열로 변환
 * const orderList = selected.map((id, i) => ({ id, order: i + 1 }))
 * // [{ id: 'a', order: 1 }, { id: 'c', order: 2 }, { id: 'b', order: 3 }]
 */
