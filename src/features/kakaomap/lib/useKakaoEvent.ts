/**
 * @file useKakaoEvent.ts
 * @description 카카오 이벤트 자동 등록/해제 훅
 *
 * 마운트 시 addListener, 언마운트 시 자동 removeListener
 * 핸들러를 ref로 안정화하여 target이 바뀔 때만 재등록합니다.
 *
 * @example
 * useKakaoEvent(marker, 'click', () => onClick?.(marker))
 */

import { useLayoutEffect, useRef } from 'react'

export function useKakaoEvent<T extends object>(
  target: T | null,
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: ((...args: any[]) => void) | undefined
) {
  // 핸들러를 ref로 안정화 — target이 바뀔 때만 이벤트를 재등록하고, 핸들러 변경은 ref를 통해 반영
  const handlerRef = useRef(handler)
  useLayoutEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useLayoutEffect(() => {
    if (!target || !handlerRef.current) return

    const { kakao } = window
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stableHandler = (...args: any[]) => handlerRef.current?.(...args)

    kakao.maps.event.addListener(target, type, stableHandler)

    return () => {
      kakao.maps.event.removeListener(target, type, stableHandler)
    }
  }, [target, type])
}
