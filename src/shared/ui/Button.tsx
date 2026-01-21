import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-sm px-5 cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'bg-primary-200 text-black hover:bg-primary-300 disabled:bg-grey-400 disabled:text-white',
                secondary:
                    'bg-white text-grey-800 border-1 border-grey-400 hover:bg-grey-200 hover:border-grey-500 disabled:text-grey-400',
                ghost: 'bg-transparent',
                cta: 'bg-grey-800 text-primary-200 hover:bg-grey-900',
            },
            size: {
                small: 'h-9 text-body2',
                medium: 'h-11 text-subtitle2',
                large: 'h-[54px] text-subtitle2',
            },
        },
        compoundVariants: [
            {
                variant: 'ghost',
                class: 'px-0 text-caption1',
            },
        ],
        defaultVariants: {
            variant: 'primary',
            size: 'small',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
