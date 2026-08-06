import { cn } from '@/shared/lib/utils'

type DivisionProps = {
  id?: string
  className?: string
}

export function Division({ id, className }: DivisionProps) {
  return (
    <div
      id={id}
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full h-[1px] bg-grey-300', className)}
    />
  )
}
