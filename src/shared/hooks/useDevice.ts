import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 1024

const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

const subscribe = (callback: () => void) => {
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

const getSnapshot = () => mediaQuery.matches

export function useDevice() {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot)

  return {
    isMobile,
    isWeb: !isMobile,
  }
}
