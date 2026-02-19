import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode,useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'

const THUMBNAIL_HEIGHT = 260
const SCROLL_AMOUNT = 408

interface BookCarouselProps {
  children: ReactNode
  className?: string
}

export default function BookCarousel({ children, className }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()

    el.addEventListener('scroll', updateScrollState, { passive: true })
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      observer.disconnect()
    }
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className={cn('group/carousel relative', className)}>
      <div ref={scrollRef} className="flex gap-large overflow-x-auto scrollbar-hide">
        {children}
      </div>

      {/* 좌측 화살표 — 썸네일 영역 세로 중앙 기준 */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 hidden size-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-opacity group-hover/carousel:flex md:flex"
          style={{ top: THUMBNAIL_HEIGHT / 2, transform: 'translate(-50%, -50%)' }}
          aria-label="이전"
        >
          <ChevronLeft className="size-5 text-grey-700" />
        </button>
      )}

      {/* 우측 화살표 */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 hidden size-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-opacity group-hover/carousel:flex md:flex"
          style={{ top: THUMBNAIL_HEIGHT / 2, transform: 'translate(50%, -50%)' }}
          aria-label="다음"
        >
          <ChevronRight className="size-5 text-grey-700" />
        </button>
      )}
    </div>
  )
}
