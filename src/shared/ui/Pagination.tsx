import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { DEFAULT_SHOW_PAGES } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'

export type PaginationProps = {
  /** 현재 페이지 번호 (0부터 시작) */
  currentPage: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 페이지 변경 콜백 (0부터 시작하는 페이지 번호) */
  onPageChange: (page: number) => void
  /** 한 번에 표시할 페이지 번호 수 (기본값: 5) */
  showPages?: number
  /** 추가 클래스명 */
  className?: string
}

/**
 * 페이지네이션 컴포넌트
 *
 * @description
 * 페이지 번호와 이전/다음 버튼을 포함한 완전한 페이지네이션 UI를 제공합니다.
 * 제어 컴포넌트로 동작하며, 부모가 currentPage 상태를 관리해야 합니다.
 *
 * @example
 * ```tsx
 * const [currentPage, setCurrentPage] = useState(0)
 *
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={setCurrentPage}
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPages = DEFAULT_SHOW_PAGES,
  className,
}: PaginationProps) {
  // 페이지 변경 시 부모 컴포넌트에 알림 및 스크롤 상단 이동
  const handleChange = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = (): number[] => {
    const pages: number[] = []

    if (totalPages <= showPages) {
      // 전체 페이지가 표시 범위 이하면 모두 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 현재 페이지가 속한 그룹 계산
      const currentGroup = Math.floor(currentPage / showPages)
      const start = currentGroup * showPages
      const end = Math.min(totalPages - 1, start + showPages - 1)

      // 페이지들 추가
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const shouldShowGroupButtons = totalPages > showPages

  // 현재 페이지 그룹의 첫 번째와 마지막 페이지
  const firstPageInGroup = pageNumbers[0] ?? 0
  const lastPageInGroup = pageNumbers[pageNumbers.length - 1] ?? 0

  // 이전/다음 그룹으로 이동할 페이지 계산
  // 이전 그룹: 이전 그룹의 마지막 페이지
  const previousGroupPage = Math.max(0, firstPageInGroup - showPages)
  // 다음 그룹: 다음 그룹의 첫 번째 페이지
  const nextGroupPage = Math.min(totalPages - 1, lastPageInGroup + 1)

  // 첫 번째/마지막 페이지 그룹 여부
  const isFirstGroup = firstPageInGroup === 0
  const isLastGroup = lastPageInGroup === totalPages - 1

  return (
    <nav
      role="navigation"
      aria-label="페이지네이션"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
    >
      <ul
        data-slot="pagination-content"
        className="flex flex-row items-center justify-between min-w-[220px]"
      >
        {/* 이전 그룹 버튼 */}
        {shouldShowGroupButtons && (
          <li data-slot="pagination-item">
            <button
              type="button"
              aria-label="이전 페이지 그룹"
              data-slot="pagination-previous"
              onClick={() => handleChange(previousGroupPage)}
              disabled={isFirstGroup}
              className={cn(
                'flex items-center justify-center rounded-small transition-colors cursor-pointer',
                'text-grey-600',
                'hover:text-grey-800',
                'disabled:text-grey-400 disabled:cursor-not-allowed'
              )}
            >
              <ChevronLeftIcon size={20} />
            </button>
          </li>
        )}

        {/* 페이지 번호들 */}
        {pageNumbers.map((page) => (
          <li key={page} data-slot="pagination-item">
            <button
              type="button"
              aria-current={currentPage === page ? 'page' : undefined}
              data-slot="pagination-link"
              data-active={currentPage === page}
              onClick={() => handleChange(page)}
              className={cn(
                'typo-subtitle3 flex items-center justify-center rounded-small transition-colors cursor-pointer',
                currentPage === page ? 'text-grey-800' : 'text-grey-600',
                'size-8',
                'hover:text-grey-800',
                'disabled:text-grey-400 disabled:cursor-not-allowed'
              )}
            >
              {page + 1}
            </button>
          </li>
        ))}

        {/* 다음 그룹 버튼 */}
        {shouldShowGroupButtons && (
          <li data-slot="pagination-item">
            <button
              type="button"
              aria-label="다음 페이지 그룹"
              data-slot="pagination-next"
              onClick={() => handleChange(nextGroupPage)}
              disabled={isLastGroup}
              className={cn(
                'flex items-center justify-center rounded-small transition-colors cursor-pointer',
                'text-grey-600',
                'hover:text-grey-800',
                'disabled:text-grey-400 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRightIcon size={20} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
