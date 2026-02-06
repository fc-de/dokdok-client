import { useWindowVirtualizer } from '@tanstack/react-virtual'

type UseVirtualListOptions = {
  /** 전체 아이템 개수 */
  count: number
  /** 각 아이템의 예상 높이 (픽셀) */
  estimateSize?: number
  /** 화면 밖에 미리 렌더링할 아이템 수 */
  overscan?: number
}

/**
 * TanStack Virtual을 사용한 리스트 가상화 훅 (window 스크롤)
 * 대량의 리스트를 효율적으로 렌더링하기 위해 화면에 보이는 아이템만 DOM에 렌더링합니다.
 */
export function useVirtualList({
  count,
  estimateSize = 150,
  overscan = 5,
}: UseVirtualListOptions) {
  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => estimateSize,
    overscan,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return {
    virtualizer,
    virtualItems,
  }
}
