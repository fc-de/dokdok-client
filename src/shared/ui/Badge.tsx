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

/*
 * 사용 예시:
 *
 * import { Badge } from '@/shared/ui/Badge'
 *
 * // 기본 사용 (small, grey, effect off)
 * <Badge>라벨</Badge>
 *
 * // size 변경
 * <Badge size="small">Small</Badge>
 * <Badge size="medium">Medium</Badge>
 *
 * // color 변경
 * <Badge color="red">Red</Badge>
 * <Badge color="blue">Blue</Badge>
 * <Badge color="grey">Grey</Badge>
 * <Badge color="purple">Purple</Badge>
 * <Badge color="green">Green</Badge>
 * <Badge color="yellow">Yellow</Badge>
 *
 * // effect (그림자)
 * <Badge effect="on">With Shadow</Badge>
 * <Badge effect="off">No Shadow</Badge>
 *
 * // 조합
 * <Badge size="medium" color="blue" effect="on">조합 예시</Badge>
 */
