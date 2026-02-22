import { useEffect, useState } from 'react'

interface UseScrollCollapseOptions {
  /** 접히는 기준 스크롤 위치 (기본: 100px) */
  collapseThreshold?: number
  /** 펼쳐지는 기준 스크롤 위치 (기본: 20px) */
  expandThreshold?: number
}

/**
 * 스크롤 위치에 따른 접힘/펼침 상태 관리 훅
 *
 * - hysteresis 적용으로 떨림 방지
 * - 접힌 상태에서는 거의 맨 위로 스크롤해야 펼쳐짐
 * - 펼쳐진 상태에서는 일정 위치 넘어야 접힘
 *
 * @param options - 설정 옵션
 * @returns isCollapsed - 접힌 상태 여부
 *
 * @example
 * ```tsx
 * const isCollapsed = useScrollCollapse({ collapseThreshold: 100, expandThreshold: 20 })
 *
 * return (
 *   <header className={cn(isCollapsed && 'shadow-drop-bottom')}>
 *     ...
 *   </header>
 * )
 * ```
 */
export const useScrollCollapse = (options: UseScrollCollapseOptions = {}) => {
  const { collapseThreshold = 100, expandThreshold = 20 } = options

  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      setIsCollapsed((prev) => {
        // 접힌 상태에서는 거의 맨 위로 스크롤해야 펼쳐짐
        if (prev) {
          return scrollY > expandThreshold
        }
        // 펼쳐진 상태에서는 collapseThreshold 넘어야 접힘
        return scrollY > collapseThreshold
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [collapseThreshold, expandThreshold])

  return isCollapsed
}
