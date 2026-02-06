import { useEffect, useRef } from 'react'

type UseInfiniteScrollOptions = {
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

/**
 * 무한 스크롤을 위한 IntersectionObserver 훅
 */
export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore?.()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, onLoadMore])

  return observerRef
}
