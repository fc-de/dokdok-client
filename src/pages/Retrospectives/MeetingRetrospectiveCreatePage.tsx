import { useNavigate, useParams } from 'react-router-dom'

import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { Button } from '@/shared/ui'

export default function MeetingRetrospectiveCreatePage() {
  const navigate = useNavigate()
  const { gatheringId, meetingId } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  if (!gatheringId || !meetingId) return null

  return (
    <>
      <SubPageHeader label="뒤로가기" to={ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId)} />

      {/* 헤더: 타이틀 + 설명 + AI 요약 시작하기 버튼 */}
      <div className="sticky top-[calc(var(--gnb-height)+59px)] z-30 flex items-center justify-between bg-white pb-small">
        <div className="flex flex-col gap-xtiny">
          <h3 className="text-black typo-heading3">약속 회고</h3>
          <p className="text-grey-600 typo-caption1">
            사전 의견과 녹음 파일을 분석하여 약속 회고를 자동 생성해요
          </p>
        </div>
        <Button
          variant="ai"
          size="small"
          onClick={() =>
            navigate(ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId), {
              state: { fromAiSummary: true },
            })
          }
        >
          AI 요약 시작하기
        </Button>
      </div>

      {/* 두 패널 영역 */}
      <div className="flex gap-medium mt-base">
        {/* 왼쪽: 수집된 사전 의견 */}
        <div className="flex flex-1 flex-col gap-medium rounded-base border border-grey-300 bg-white p-large shadow-drop">
          <div className="flex flex-col gap-xtiny">
            <h4 className="text-black typo-heading3">수집된 사전 의견</h4>
            <p className="text-grey-600 typo-body4">{/* TODO: 사전 의견 카운트 */}0개</p>
          </div>
          {/* TODO: 사전 의견 멤버 리스트 + 의견 내용 */}
        </div>

        {/* 오른쪽: 녹음 파일 업로드 */}
        <div className="flex flex-1 flex-col gap-medium rounded-base border border-grey-300 bg-white p-large shadow-drop">
          <div className="flex flex-col gap-xtiny">
            <h4 className="text-black typo-heading3">녹음 파일 업로드</h4>
            <p className="text-grey-600 typo-body4">AI가 음성을 텍스트로 변환하여 분석해요</p>
          </div>
          {/* TODO: 파일 업로드 드롭존 + 파일 리스트 테이블 */}
        </div>
      </div>

      {/* TODO: AI 요약 중 모달 */}
    </>
  )
}
