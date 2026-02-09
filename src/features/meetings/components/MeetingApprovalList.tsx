/**
 * @file MeetingApprovalList.tsx
 * @description 약속 승인 리스트 컴포넌트
 */

import type { PaginatedResponse } from '@/api/types'
import { MeetingApprovalItem, type MeetingApprovalItemType } from '@/features/meetings'
import { PAGE_SIZES } from '@/shared/constants'
import { Pagination } from '@/shared/ui/Pagination'

export type MeetingApprovalListProps = {
  /** 약속 승인 리스트 데이터 */
  data: PaginatedResponse<MeetingApprovalItemType>
  /** 현재 페이지 */
  currentPage: number
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void
}

export default function MeetingApprovalList({
  data,
  currentPage,
  onPageChange,
}: MeetingApprovalListProps) {
  if (!data || data.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-large border-none mt-base">
        <p className="typo-body3 text-grey-600">약속이 없습니다.</p>
      </div>
    )
  }

  const { items, totalPages, totalCount } = data
  const pageSize = PAGE_SIZES.MEETING_APPROVALS
  const showPagination = totalCount > pageSize

  return (
    <div className="flex flex-col gap-medium">
      <ul>
        {items.map((item) => (
          <MeetingApprovalItem key={item.meetingId} item={item} />
        ))}
      </ul>

      {showPagination && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
}
