import { useParams } from 'react-router-dom'

import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'

export default function MeetingRetrospectiveDetailPage() {
  const { gatheringId, meetingId } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  if (!gatheringId || !meetingId) return null

  return (
    <>
      <SubPageHeader label="뒤로가기" to={ROUTES.MEETING_DETAIL(gatheringId, meetingId)} />

      {/* 헤더: 타이틀 */}
      <div className="sticky top-[calc(var(--gnb-height)+59px)] z-30 flex items-center justify-between bg-white pb-small">
        <div className="flex flex-col gap-xtiny">
          <h3 className="text-black typo-heading3">약속 회고</h3>
          <p className="text-grey-600 typo-caption1">
            약속 회고는 모임의 내용을 함께 돌아보고 각자의 생각을 마무리하는 곳이에요
          </p>
        </div>
      </div>
      <div className="">회고 조회</div>
    </>
  )
}
