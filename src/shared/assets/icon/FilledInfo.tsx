import { cn } from '@/shared/lib/utils'

type Props = {
  size?: number
  className?: string
}

export function FilledInfoIcon({ size = 24, className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={cn('lucide lucide-info-icon lucide-info', className)}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 16v-4" stroke="white" strokeWidth="2" />
      <path d="M12 8h.01" stroke="white" strokeWidth="2" />
    </svg>
  )
}
