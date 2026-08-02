import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
  const [opacity, setOpacity] = useState(false)
  const onDismissRef = useRef(onDismiss)
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onDismissRef.current = onDismiss
  })

  useEffect(() => {
    if (!isVisible) return

    const fadeInTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpacity(true)
      })
    })

    const dismissTimer = setTimeout(() => {
      setOpacity(false)
      fadeOutTimerRef.current = setTimeout(() => onDismissRef.current(), 300)
    }, duration)

    return () => {
      cancelAnimationFrame(fadeInTimer)
      clearTimeout(dismissTimer)
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current)
      setOpacity(false)
    }
  }, [isVisible, duration])

  if (!isVisible) return null

  return createPortal(
    <div
      className={[
        'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
        'transition-opacity duration-300',
        opacity ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      <div className="flex w-lg flex-col items-center justify-center gap-small rounded-small bg-grey-100 p-medium shadow-drop max-lg:w-[calc(100%-40px)] max-lg:max-w-75 max-lg:rounded-small max-lg:bg-white max-lg:p-5">
        <div className="flex flex-col items-center justify-center gap-tiny">
          <Check className="size-6 text-primary-300" />
          <p className="text-blue-200 typo-subtitle2">{message}</p>
        </div>
      </div>
    </div>,
    document.body
  )
}
