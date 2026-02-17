import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  AiLoadingOverlay,
  AiSummaryToast,
  RetrospectiveSummarySkeleton,
} from '@/features/retrospectives'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { Button } from '@/shared/ui'

export default function MeetingRetrospectivePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { gatheringId, meetingId } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const fromAiSummary = (location.state as { fromAiSummary?: boolean })?.fromAiSummary ?? false

  const [showOverlay, setShowOverlay] = useState(fromAiSummary)
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(fromAiSummary)

  // 새로고침 시 오버레이 재표시 방지
  useEffect(() => {
    if (fromAiSummary) {
      window.history.replaceState({}, '')
    }
  }, [fromAiSummary])

  // TODO: setTimeout mock → 실제 API 호출로 교체
  const handleSummaryComplete = useCallback(() => {
    setShowOverlay(false)
    setIsLoading(false)
    setShowToast(true)
  }, [])

  useEffect(() => {
    if (!isLoading) return

    const timer = setTimeout(handleSummaryComplete, 3000)
    return () => clearTimeout(timer)
  }, [isLoading, handleSummaryComplete])

  return (
    <>
      <SubPageHeader label="뒤로가기" to={ROUTES.MEETING_DETAIL(gatheringId!, meetingId!)} />

      {/* 헤더: 약속 회고 타이틀 + 버튼 */}
      <div className="sticky top-[calc(var(--gnb-height)+59px)] z-30 flex items-center justify-between bg-white pb-small">
        <h3 className="text-black typo-heading3">약속 회고</h3>
        <div className="flex items-center gap-xsmall">
          <Button variant="secondary" outline size="small">
            수정하기
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => navigate(ROUTES.MEETING_RETROSPECTIVE_CREATE(gatheringId!, meetingId!))}
          >
            약속 회고 생성하기
          </Button>
        </div>
      </div>

      {/* 회고 콘텐츠 영역 */}
      <div className="mt-base">
        {isLoading ? (
          <RetrospectiveSummarySkeleton />
        ) : (
          /* TODO: 실제 AI 요약 콘텐츠 렌더링 */
          <p className="text-grey-600 typo-body4">회고 콘텐츠가 여기에 표시됩니다.</p>
        )}
      </div>

      <AiLoadingOverlay isOpen={showOverlay} />
      <AiSummaryToast isVisible={showToast} onDismiss={() => setShowToast(false)} />
    </>
  )
}
