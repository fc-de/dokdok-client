import { cn } from '@/shared/lib/utils'

type DivisionProps = {
  className?: string
}

export function Division({ className }: DivisionProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full h-[1px] bg-grey-300', className)}
    />
  )
}
