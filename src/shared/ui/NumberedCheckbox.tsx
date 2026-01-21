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
