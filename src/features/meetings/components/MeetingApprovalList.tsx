/**
 * @file MeetingApprovalList.tsx
 * @description 약속 승인 리스트 컴포넌트
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MeetingApprovalItem, type MeetingStatus, useMeetingApprovals } from '@/features/meetings'
import { PAGE_SIZES } from '@/shared/constants'
import { Pagination } from '@/shared/ui/Pagination'
import { useGlobalModalStore } from '@/store'

export type MeetingApprovalListProps = {
  /** 모임 식별자 */
  gatheringId: number
  /** 약속 상태 (PENDING: 확정 대기, CONFIRMED: 확정 완료) */
  status: MeetingStatus
}
export default function MeetingApprovalList({ gatheringId, status }: MeetingApprovalListProps) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = PAGE_SIZES.MEETING_APPROVALS
  const { openError } = useGlobalModalStore()

  const { data, isLoading, isError, error } = useMeetingApprovals({
    gatheringId,
    status,
    page: currentPage,
    size: pageSize,
  })

  useEffect(() => {
    if (isError) {
      openError('에러', error.userMessage, () => {
        navigate('/', { replace: true })
      })
    }
  }, [isError, openError, error, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-large">
        <p className="typo-body3 text-grey-600">로딩 중...</p>
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
