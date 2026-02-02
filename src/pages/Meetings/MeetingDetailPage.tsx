import { ChevronLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { MeetingDetailHeader, MeetingDetailInfo, useMeetingDetail } from '@/features/meetings'
import { MeetingDetailButton } from '@/features/meetings/components/MeetingDetailButton'

//상수로 분리해 관리 예정, 약속전 중 후로 변경해야 함
function getStatusBadgeText(status: 'CONFIRMED' | 'PENDING') {
  return status === 'CONFIRMED' ? '확정됨' : '확정 대기'
}

export default function MeetingDetailPage() {
  const { meetingId } = useParams<{ gatheringId: string; meetingId: string }>()

  const { data: meeting, isLoading, error } = useMeetingDetail(Number(meetingId))

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-error typo-body2">{error.userMessage}</p>
      </div>
    )
  }

  const statusBadgeText = meeting ? getStatusBadgeText(meeting.meetingStatus) : ''

  return (
    <>
      {/* 공통컴포넌트로 분리 예정 */}
      <div className="sticky top-0 bg-white">
        <p className="flex typo-body3 text-grey-600 gap-xtiny py-medium">
          <ChevronLeft size={16} /> {meeting?.gathering.gatheringName ?? ''}
        </p>
      </div>
      {/* 공통컴포넌트로 분리 예정 */}

      <div className="flex justify-between gap-[36px]">
        {/* 약속 로딩 적용 */}
        <div className="w-[300px] flex-none flex flex-col gap-base">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-grey-500 typo-body2">로딩 중...</p>
            </div>
          ) : meeting ? (
            <>
              <MeetingDetailHeader statusBadgeText={statusBadgeText}>
                {meeting.meetingName}
              </MeetingDetailHeader>

              <MeetingDetailInfo meeting={meeting} />

              <MeetingDetailButton
                buttonLabel={meeting.actionState.buttonLabel}
                isEnabled={meeting.actionState.enabled}
                type={meeting.actionState.type}
              />
            </>
          ) : null}
        </div>
        {/* 약속 로딩 적용 */}

        <div className="flex-1">
          {/* 주제 로딩 적용 */}
          <p className="text-black typo-heading3">주제</p>
          {/* 주제 로딩 적용 */}
        </div>
      </div>
    </>
  )
}
