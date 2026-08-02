import AiGradientIcon from '@/shared/assets/icon/ai-gradient.svg'
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
  variant = 'default',
  preview = false,
  className,
}: MobileBottomCTAProps) {
  return (
    <div
      className={cn(
        preview ? 'absolute inset-x-0 bottom-0 z-10' : 'fixed inset-x-0 bottom-0 z-50 lg:hidden',
        !preview && 'mobile-frame',
        'bg-white px-5 pt-3 pb-[calc(var(--spacing-medium)+env(safe-area-inset-bottom))] shadow-bottom',
        className
      )}
    >
      <Button
        type="button"
        size="large"
        variant={variant === 'ai' ? 'ai' : 'primary'}
        className="w-full"
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={loading}
      >
        {loading ? (
          loadingLabel
        ) : (
          <span className="flex items-center gap-2">
            {variant === 'ai' && <img src={AiGradientIcon} alt="" aria-hidden className="size-7" />}
            {label}
          </span>
        )}
      </Button>
    </div>
  )
}
