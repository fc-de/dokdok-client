import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'

import type { MobileBottomCTAConfig } from './types'

export type MobileBottomCTAProps = MobileBottomCTAConfig & {
  preview?: boolean
  className?: string
}

export default function MobileBottomCTA({
  label,
  loadingLabel = '처리 중...',
  onClick,
  disabled = false,
  loading = false,
  preview = false,
  className,
}: MobileBottomCTAProps) {
  return (
    <div
      className={cn(
        preview ? 'absolute inset-x-0 bottom-0 z-10' : 'fixed inset-x-0 bottom-0 z-50 lg:hidden',
        'bg-white px-[20px] pt-[12px] pb-[calc(20px+env(safe-area-inset-bottom))] shadow-[0px_-2px_16px_0px_#1111110F]',
        className
      )}
    >
      <Button
        type="button"
        size="large"
        className="w-full"
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={loading}
      >
        {loading ? loadingLabel : label}
      </Button>
    </div>
  )
}
