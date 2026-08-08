import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import {
  MeetingBookInfo,
  MeetingDetailHeader,
  MeetingMobileSummaryCard,
  MeetingPCActionButton,
  MeetingPCInfoPanel,
  MeetingPCMoreInfoCard,
  MeetingTopicSection,
  useMeetingAction,
  useMeetingDetail,
} from '@/features/meetings'
import { RetrospectiveCardButtons } from '@/features/retrospectives/meeting'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { useDevice, useScrollCollapse } from '@/shared/hooks'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast } from '@/shared/lib/toast'
import { Spinner } from '@/shared/ui'

export default function MeetingDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const parsedGatheringId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const parsedMeetingId = meetingIdParam ? Number(meetingIdParam) : NaN

  const gatheringId = Number.isFinite(parsedGatheringId) ? parsedGatheringId : 0
  const meetingId = Number.isFinite(parsedMeetingId) ? parsedMeetingId : 0

  // MobileMeetingInfoPage에서 PC 폭으로 넓어져 돌아온 경우, 인라인 패널을 연 상태로 이어감
  const shouldOpenInfoPanel = Boolean(
    (location.state as { openInfoPanel?: boolean } | null)?.openInfoPanel
  )
  const [showMeetingInfo, setShowMeetingInfo] = useState(shouldOpenInfoPanel)
  const { isMobile } = useDevice()

  // 스크롤 상태 (헤더 접힘 여부)
  const isHeaderCollapsed = useScrollCollapse({ collapseThreshold: 100, expandThreshold: 20 })

  const {
    data: meeting,
    isLoading: meetingLoading,
    error: meetingError,
  } = useMeetingDetail(meetingId)

  const userId = useAuth().data?.userId
  const isHost = useMemo(
    () =>
      meeting?.participants.members.some(
        (member) => member.userId === userId && member.role === 'LEADER'
      ) ?? false,
    [meeting?.participants.members, userId]
  )

  // 수정(CAN_EDIT)/참가취소(CAN_CANCEL)/취소불가(CANCEL_TIME_EXPIRED)는 MeetingPCInfoPanel / MobileMeetingInfoPage에서 처리
  const actionType = meeting?.actionState.type
  const { handleAction, isPending: isActionPending } = useMeetingAction(
    actionType ?? 'DONE',
    gatheringId,
    meetingId
  )
  const showActionButton =
    !!meeting &&
    actionType !== 'CAN_EDIT' &&
    actionType !== 'CAN_CANCEL' &&
    actionType !== 'CANCEL_TIME_EXPIRED'
  // 모바일 하단 고정 CTA (MobileLayoutFrame의 bottomCTA, lg 이상에서는 자동으로 숨김)
  const mobileBottomCTA =
    showActionButton && meeting
      ? {
          label: meeting.actionState.buttonLabel,
          onClick: handleAction,
          disabled: !meeting.actionState.enabled,
          loading: isActionPending,
        }
      : undefined

  useEffect(() => {
    if (meetingError) {
      showErrorToast(meetingError.userMessage)

      if (gatheringId !== 0) {
        navigate(ROUTES.GATHERING_DETAIL(gatheringId), { replace: true })
      }
    }
  }, [meetingError, navigate, gatheringId])

  if (gatheringId === 0 || meetingId === 0) return null

  // PC 인라인 상세 패널이 열린 상태로 모바일 폭까지 줄어들면 전용 페이지(MobileMeetingInfoPage)로 이동
  if (isMobile && showMeetingInfo) {
    return <Navigate to={ROUTES.MEETING_INFO(gatheringId, meetingId)} replace />
  }

  return (
    <MobileLayoutFrame
      variant="header"
      // 모바일 상단바: 스크롤로 헤더가 접히면 약속명 노출 (공백은 상단바 유지용)
      title={isHeaderCollapsed ? (meeting?.meetingName ?? ' ') : ' '}
      leftAction={{ type: 'back', to: ROUTES.GATHERING_DETAIL(gatheringId) }}
      bottomCTA={mobileBottomCTA}
      className="min-h-dvh lg:min-h-0"
    >
      <SubPageHeader
        label={meeting?.gathering.gatheringName ?? '뒤로가기'}
        to={ROUTES.GATHERING_DETAIL(gatheringId)}
        className="max-lg:hidden"
      />

      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5">
        <div className="flex justify-between gap-[36px] max-lg:block">
          {/* 약속 */}
          <div className="w-[300px] flex-none flex flex-col gap-base max-lg:w-full">
            {meetingLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Spinner />
              </div>
            ) : meeting ? (
              <>
                {/* 모바일: 책 요약 카드, 클릭 시 약속 상세 정보 페이지(MEETING_INFO)로 이동 */}
                <div className="lg:hidden">
                  <MeetingMobileSummaryCard
                    meeting={meeting}
                    onClick={() => navigate(ROUTES.MEETING_INFO(gatheringId, meetingId))}
                  />
                </div>

                {/* PC: 헤더 + 책 정보 + 액션 버튼 + 더보기(인라인 상세 패널 토글) */}
                <div className="max-lg:hidden flex flex-col gap-base">
                  <MeetingDetailHeader
                    progressStatus={meeting.progressStatus}
                    onClick={() => setShowMeetingInfo(false)}
                  >
                    {meeting.meetingName}
                  </MeetingDetailHeader>

                  <MeetingBookInfo book={meeting.book} />

                  {showActionButton && (
                    <MeetingPCActionButton
                      buttonLabel={meeting.actionState.buttonLabel}
                      isEnabled={meeting.actionState.enabled}
                      type={meeting.actionState.type}
                      isPending={isActionPending}
                      onClick={handleAction}
                    />
                  )}

                  <MeetingPCMoreInfoCard
                    meeting={meeting}
                    onMoreClick={() => setShowMeetingInfo(true)}
                  />
                </div>
              </>
            ) : null}
          </div>

          {/* 주제 */}
          <div className="flex flex-col flex-1 gap-base pb-base min-w-0">
            {showMeetingInfo && meeting ? (
              /* PC: 약속 상세 정보 패널 */
              <MeetingPCInfoPanel
                meeting={meeting}
                handleAction={handleAction}
                isPending={isActionPending}
              />
            ) : (
              <>
                {meeting?.progressStatus === 'POST' && (
                  /* 회고 버튼 */
                  <RetrospectiveCardButtons
                    gatheringId={gatheringId}
                    meetingId={meetingId}
                    retrospectiveStatus={meeting.retrospectiveStatus}
                    personalRetrospectiveWritten={meeting.personalRetrospectiveWritten}
                    isHost={isHost}
                  />
                )}
                <MeetingTopicSection
                  gatheringId={gatheringId}
                  meetingId={meetingId}
                  meeting={meeting}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MobileLayoutFrame>
  )
}
