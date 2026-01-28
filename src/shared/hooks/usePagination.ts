import { useState } from 'react'

export type UsePaginationOptions = {
  /** 초기 페이지 번호 (0부터 시작) */
  initialPage?: number
  /** 페이지당 아이템 수 */
  pageSize: number
  /** 한 번에 표시할 페이지 번호 수 (기본값: 5) */
  showPages?: number
}

export type UsePaginationReturn = {
  /** 현재 페이지 번호 (0부터 시작) */
  currentPage: number
  /** 페이지당 아이템 수 */
  pageSize: number
  /** 페이지 번호 변경 핸들러 */
  handlePageChange: (page: number) => void
  /** 페이지 번호 배열 계산 */
  getPageNumbers: (totalPages: number) => number[]
}

/**
 * 페이지네이션 상태 및 로직을 관리하는 훅
 *
 * @example
 * ```tsx
 * const { currentPage, pageSize, handlePageChange, getPageNumbers } = usePagination({
 *   pageSize: 10,
 *   showPages: 5,
 * })
 *
 * const { data } = useQuery({
 *   queryKey: ['items', currentPage],
 *   queryFn: () => fetchItems({ page: currentPage, size: pageSize }),
 * })
 *
 * const pageNumbers = getPageNumbers(data.totalPages)
 * ```
 */
export function usePagination({
  initialPage = 0,
  pageSize,
  showPages = 5,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)

  /**
   * 페이지 번호 변경 핸들러
   * 페이지 변경 시 스크롤을 상단으로 이동합니다.
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * 페이지 번호 배열 계산 (현재 페이지 기준 전후로 표시)
   *
   * @param totalPages - 전체 페이지 수
   * @returns 페이지 번호 배열
   *
   * @example
   * ```
   * totalPages: 10, currentPage: 5, showPages: 5
   * => [3, 4, 5, 6, 7]
   * ```
   */
  const getPageNumbers = (totalPages: number): number[] => {
    const pages: number[] = []

    if (totalPages <= showPages) {
      // 전체 페이지가 표시 범위 이하면 모두 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 현재 페이지 기준으로 범위 계산
      let start = Math.max(0, currentPage - Math.floor(showPages / 2))
      const end = Math.min(totalPages - 1, start + showPages - 1)

      // end가 마지막에 가까우면 start 조정
      if (end === totalPages - 1) {
        start = Math.max(0, end - showPages + 1)
      }

      // 페이지들 추가
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return {
    currentPage,
    pageSize,
    handlePageChange,
    getPageNumbers,
  }
}
