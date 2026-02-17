import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type AiSummaryToastProps = {
  isVisible: boolean
  message?: string
  onDismiss: () => void
  duration?: number
}

export default function AiSummaryToast({
  isVisible,
  message = '독서 모임 내용 요약이 완료됐어요',
  onDismiss,
  duration = 3000,
}: AiSummaryToastProps) {
  const [mounted, setMounted] = useState(false)
  const [opacity, setOpacity] = useState(false)

  // isVisible이 true가 되면 마운트 후 페이드인
  useEffect(() => {
    if (!isVisible) {
      setMounted(false)
      setOpacity(false)
      return
    }

    setMounted(true)

    const fadeInTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpacity(true)
      })
    })

    const dismissTimer = setTimeout(() => {
      setOpacity(false)
      setTimeout(onDismiss, 300)
    }, duration)

    return () => {
      cancelAnimationFrame(fadeInTimer)
      clearTimeout(dismissTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, duration])

  if (!mounted) return null

  return createPortal(
    <div
      className={[
        'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
        'transition-opacity duration-300',
        opacity ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      <div className="flex w-lg flex-col items-center justify-center gap-small rounded-small bg-grey-100 p-medium shadow-drop">
        <div className="flex flex-col items-center justify-center gap-tiny">
          <Check className="size-6 text-primary-300" />
          <p className="text-blue-200 typo-subtitle2">{message}</p>
        </div>
      </div>
    </div>,
    document.body
  )
}
