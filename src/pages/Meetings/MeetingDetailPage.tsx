import { ChevronLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'

import {
  MeetingDetailButton,
  MeetingDetailHeader,
  MeetingDetailInfo,
  useMeetingDetail,
} from '@/features/meetings'
import { TextButton } from '@/shared/ui'

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

  return (
    <>
      {/* 공통컴포넌트로 분리 예정 */}
      <div className="sticky top-0 bg-white py-medium">
        <TextButton iconPosition="left" icon={ChevronLeft} size="medium">
          {meeting?.gathering.gatheringName ?? ''}
        </TextButton>
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
              <MeetingDetailHeader progressStatus={meeting.progressStatus}>
                {meeting.meetingName}
              </MeetingDetailHeader>

              <MeetingDetailInfo meeting={meeting} />

              <MeetingDetailButton
                buttonLabel={meeting.actionState.buttonLabel}
                isEnabled={meeting.actionState.enabled}
                type={meeting.actionState.type}
                meetingId={meeting.meetingId}
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
