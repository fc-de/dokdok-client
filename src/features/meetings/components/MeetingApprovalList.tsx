/**
 * @file MeetingApprovalList.tsx
 * @description 약속 승인 리스트 컴포넌트
 */

import { useState } from 'react'

import { MeetingApprovalItem } from '@/features/meetings/components/MeetingApprovalItem'
import { useMeetingApprovals } from '@/features/meetings/hooks/useMeetingApprovals'
import type { MeetingStatus } from '@/features/meetings/meetings.types'
import { PAGE_SIZES } from '@/shared/constants'
import { Pagination } from '@/shared/ui/Pagination'

export type MeetingApprovalListProps = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 상태 (PENDING: 확정 대기, CONFIRMED: 확정 완료) */
  status: MeetingStatus
}
export function MeetingApprovalList({ gatheringId, status }: MeetingApprovalListProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = PAGE_SIZES.MEETING_APPROVALS

  const { data, isLoading, error } = useMeetingApprovals({
    gatheringId,
    status,
    page: currentPage,
    size: pageSize,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-large">
        <p className="typo-body3 text-grey-600">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-large">
        <p className="typo-body3 text-error">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-large">
        <p className="typo-body3 text-grey-600">약속이 없습니다.</p>
      </div>
    )
  }

  const { items, totalPages, totalCount } = data
  const showPagination = totalCount > pageSize

  return (
    <div className="flex flex-col gap-medium">
      <ul>
        {items.map((item) => (
          <MeetingApprovalItem key={item.meetingId} item={item} />
        ))}
      </ul>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      )}
    </div>
  )
}
