import { useEffect, useRef, useState } from 'react'

/**
 * 로딩 상태의 깜빡임을 방지하는 훅
 *
 * - delay: 로딩이 시작된 후 스켈레톤을 보여주기까지 대기하는 시간 (ms)
 * - minDuration: 스켈레톤이 한 번 보이면 최소한 유지되는 시간 (ms)
 *
 * 빠른 로딩(delay 이내 완료)에는 스켈레톤이 아예 보이지 않고,
 * 느린 로딩에는 스켈레톤이 최소 minDuration 동안 안정적으로 보입니다.
 */
export function useDeferredLoading(
  isLoading: boolean,
  { delay = 200, minDuration = 500 } = {},
): boolean {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const showTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout>
    let minDurationTimer: ReturnType<typeof setTimeout>
    let hideTimer: ReturnType<typeof setTimeout>

    if (isLoading) {
      delayTimer = setTimeout(() => {
        showTimeRef.current = Date.now()
        setShowSkeleton(true)
      }, delay)
    } else {
      if (showTimeRef.current !== null) {
        const elapsed = Date.now() - showTimeRef.current
        const remaining = Math.max(minDuration - elapsed, 0)

        minDurationTimer = setTimeout(() => {
          setShowSkeleton(false)
          showTimeRef.current = null
        }, remaining)
      } else {
        hideTimer = setTimeout(() => {
          setShowSkeleton(false)
        }, 0)
      }
    }

    return () => {
      clearTimeout(delayTimer)
      clearTimeout(minDurationTimer)
      clearTimeout(hideTimer)
    }
  }, [isLoading, delay, minDuration])

  return showSkeleton
}
