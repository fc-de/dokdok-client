import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'
import { useDevice } from '@/shared/hooks'
import { MobileLayoutFrame } from '@/shared/layout'

export default function MeetingDetailInfoPage() {
  const navigate = useNavigate()
  const { isWeb } = useDevice()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const parsedGatheringId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const parsedMeetingId = meetingIdParam ? Number(meetingIdParam) : NaN
  const gatheringId = Number.isFinite(parsedGatheringId) ? parsedGatheringId : 0
  const meetingId = Number.isFinite(parsedMeetingId) ? parsedMeetingId : 0

  useEffect(() => {
    if (isWeb && gatheringId !== 0 && meetingId !== 0) {
      navigate(ROUTES.MEETING_DETAIL(gatheringId, meetingId), { replace: true })
    }
  }, [gatheringId, isWeb, meetingId, navigate])

  if (gatheringId === 0 || meetingId === 0) return null
  if (isWeb) return null

  return (
    <MobileLayoutFrame
      variant="content"
      title=" "
      backTo={ROUTES.MEETING_DETAIL(gatheringId, meetingId)}
      headerAction={{
        label: '수정하기',
        onClick: () => navigate(ROUTES.MEETING_UPDATE(gatheringId, meetingId)),
      }}
      className="min-h-dvh"
      contentClassName="bg-white"
    >
      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5 max-lg:pt-5">
        {/* 추후 작업 시 내용 수정 필요 */}
        <div className="bg-white" aria-hidden />
      </div>
    </MobileLayoutFrame>
  )
}
