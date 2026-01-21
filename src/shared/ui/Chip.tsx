import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const chipVariants = cva(
    'inline-flex items-center justify-center rounded-medium border px-[13px] py-[7px] text-caption1 whitespace-nowrap transition-colors',
    {
        variants: {
            variant: {
                default: 'border-grey-300 text-grey-600 bg-transparent',
                selected: 'border-primary-300 text-black bg-primary-100',
                edit: 'border-grey-400 text-black bg-white',
                success: 'border-primary-300 border-0 text-purple-200 bg-purple-100',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface ChipProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof chipVariants> {
    onDelete?: () => void
}

function Chip({ className, variant, onDelete, children, ...props }: ChipProps) {
    return (
        <span
            data-slot="chip"
            className={cn(chipVariants({ variant }), className)}
            {...props}
        >
            {children}
            {variant === 'edit' && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="ml-tiny cursor-pointer"
                    aria-label="삭제"
                >
                    <X className="size-3 text-grey-600" />
                </button>
            )}
        </span>
    )
}

export { Chip, chipVariants }
