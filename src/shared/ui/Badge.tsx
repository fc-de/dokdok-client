import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap transition-all rounded-tiny',
    {
        variants: {
            size: {
                small: 'px-xsmall py-xtiny text-body5',
                medium: 'px-2 py-[5px] text-body3',
            },
            color: {
                red: 'bg-accent-200 text-accent-300',
                blue: 'bg-blue-100 text-blue-200',
                grey: 'bg-grey-200 text-grey-700',
                purple: 'bg-purple-100 text-purple-200',
                green: 'bg-primary-150 text-primary-400',
                yellow: 'bg-yellow-100 text-yellow-300',
            },
            effect: {
                on: 'shadow-[0_2px_16px_0_rgba(0,0,0,0.06)]',
                off: 'shadow-none',
            },
        },
        defaultVariants: {
            size: 'small',
            color: 'grey',
            effect: 'off',
        },
    }
)

export interface BadgeProps
    extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>,
        VariantProps<typeof badgeVariants> {}

/**
 * Badge (상태/라벨 배지)
 * - `size`로 배지 크기를 지정합니다: small, medium
 * - `color`로 배지 색상을 지정합니다: red, blue, grey, purple, green, yellow
 * - `effect`로 그림자 효과를 지정합니다: on, off
 * @example
 * ```tsx
 * <Badge color="red" size="medium">긴급</Badge>
 * <Badge color="green" effect="on">완료</Badge>
 * <Badge color="grey">기본</Badge>
 * ```
 */
function Badge({ className, size, color, effect, ...props }: BadgeProps) {
    return (
        <span
            data-slot="badge"
            className={cn(badgeVariants({ size, color, effect }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
