import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  /** 다음 페이지가 있는지 여부 */
  hasNextPage: boolean | undefined
  /** 다음 페이지를 가져오는 중인지 */
  isFetchingNextPage: boolean
  /** 초기 로딩 중인지 */
  isLoading?: boolean
  /** 활성화 여부 (탭 전환 등에서 사용) */
  enabled?: boolean
  /** Intersection Observer threshold (기본: 0.1) */
  threshold?: number
  /** Intersection Observer rootMargin (기본: '200px') */
  rootMargin?: string
}

/**
 * 무한 스크롤을 위한 Intersection Observer 훅
 *
 * @param fetchNextPage - 다음 페이지를 가져오는 함수
 * @param options - 옵션
 * @returns observerRef - 감지할 요소에 연결할 ref
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(...)
 *
 * const observerRef = useInfiniteScroll(fetchNextPage, {
 *   hasNextPage,
 *   isFetchingNextPage,
 *   isLoading,
 *   enabled: activeTab === 'all',
 * })
 *
 * return (
 *   <>
 *     <div className="grid">{items.map(...)}</div>
 *     {hasNextPage && <div ref={observerRef} className="h-10" />}
 *   </>
 * )
 * ```
 */
export const useInfiniteScroll = (fetchNextPage: () => void, options: UseInfiniteScrollOptions) => {
  const {
    hasNextPage,
    isFetchingNextPage,
    isLoading = false,
    enabled = true,
    threshold = 0.1,
    rootMargin = '200px',
  } = options

  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 비브라우저 환경 또는 IntersectionObserver 미지원 환경 체크
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return

    // 비활성화 상태이거나 로딩 중이거나 다음 페이지가 없으면 옵저버 설정 안함
    if (!observerRef.current || !enabled || isLoading || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || !hasNextPage || isFetchingNextPage) return

        // 페이지에 스크롤이 있는지 확인
        const hasScroll = document.documentElement.scrollHeight > window.innerHeight
        // 스크롤이 없으면 바로 로드, 스크롤이 있으면 스크롤이 발생한 경우에만 로드
        const shouldFetch = !hasScroll || window.scrollY > 0

        if (shouldFetch) {
          fetchNextPage()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [enabled, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage, threshold, rootMargin])

  return observerRef
}
