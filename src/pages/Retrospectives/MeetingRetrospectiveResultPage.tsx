import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import type { KeyPoint, SummaryTopic } from '@/features/retrospectives'
import {
  RetrospectiveSummarySkeleton,
  SummaryInfoBanner,
  TopicSummaryCard,
  usePublishSummary,
  useSummary,
  useUpdateSummary,
} from '@/features/retrospectives'
import FormPageHeader from '@/shared/components/FormPageHeader'
import { ROUTES } from '@/shared/constants'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import { Button } from '@/shared/ui'

type LocationState = {
  fromAiSummary?: boolean
}

export default function MeetingRetrospectiveResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { gatheringId, meetingId } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const mId = Number(meetingId)

  // 요약 데이터 조회
  const { data: summaryData, isLoading } = useSummary(mId)

  // 뮤테이션
  const updateMutation = useUpdateSummary()
  const publishMutation = usePublishSummary()

  // 수정 모드
  const [isEditing, setIsEditing] = useState(false)
  const [editedTopics, setEditedTopics] = useState<SummaryTopic[]>([])

  // CreatePage에서 AI 요약 완료 후 도착했을 때 토스트 표시
  const fromAiSummary = (location.state as LocationState)?.fromAiSummary ?? false

  useEffect(() => {
    if (fromAiSummary) {
      window.history.replaceState({}, '')
      showToast('독서 모임 내용 요약이 완료됐어요')
    }
  }, [fromAiSummary])

  // ─── 수정 모드 핸들러 ───

  const handleStartEdit = () => {
    if (!summaryData) return
    setEditedTopics(structuredClone(summaryData.topics))
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    updateMutation.mutate(
      {
        meetingId: mId,
        data: {
          topics: editedTopics.map((t) => ({
            topicId: t.topicId,
            summary: t.summary,
            keyPoints: t.keyPoints.map((kp) => ({
              title: kp.title,
              details: kp.details,
            })),
          })),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false)
          showToast('수정이 완료되었습니다.')
        },
        onError: (error) => showErrorToast(error.userMessage ?? '수정에 실패했습니다.'),
      }
    )
  }

  const handlePublish = () => {
    publishMutation.mutate(
      { meetingId: mId },
      {
        onSuccess: () => {
          showToast('약속 회고가 생성되었습니다.')
          navigate(ROUTES.MEETING_RETROSPECTIVE_DETAIL(gatheringId!, meetingId!))
        },
        onError: (error) => showErrorToast(error.userMessage ?? '발행에 실패했습니다.'),
      }
    )
  }

  // ─── 수정 모드 데이터 변경 핸들러 ───

  const handleSummaryChange = (topicIndex: number, value: string) => {
    setEditedTopics((prev) => {
      const next = [...prev]
      next[topicIndex] = { ...next[topicIndex], summary: value }
      return next
    })
  }

  const handleKeyPointsChange = (topicIndex: number, keyPoints: KeyPoint[]) => {
    setEditedTopics((prev) => {
      const next = [...prev]
      next[topicIndex] = { ...next[topicIndex], keyPoints }
      return next
    })
  }

  if (!gatheringId || !meetingId) return null

  const topics: SummaryTopic[] = isEditing ? editedTopics : (summaryData?.topics ?? [])

  return (
    <div className="min-h-screen bg-grey-100">
      <FormPageHeader
        title="약속 회고"
        to={ROUTES.MEETING_DETAIL(gatheringId, meetingId)}
        onBack={isEditing ? () => setIsEditing(false) : undefined}
      >
        {isEditing ? (
          <Button
            variant="secondary"
            outline
            size="small"
            onClick={handleSaveEdit}
            disabled={updateMutation.isPending}
          >
            수정 완료
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              outline
              size="small"
              onClick={handleStartEdit}
              disabled={!summaryData || summaryData.isPublished}
            >
              수정하기
            </Button>
            <Button
              size="small"
              onClick={handlePublish}
              disabled={!summaryData || summaryData.isPublished || publishMutation.isPending}
            >
              약속 회고 생성하기
            </Button>
          </>
        )}
      </FormPageHeader>

      {/* 회고 콘텐츠 영역 */}
      <div className="mx-auto max-w-layout-max px-layout-padding mt-base flex flex-col gap-medium pb-xlarge">
        {/* 안내 배너 (미발행 + 보기 모드일 때) */}
        {summaryData && !summaryData.isPublished && !isEditing && <SummaryInfoBanner />}

        {/* 토픽 카드 */}
        {isLoading ? (
          <RetrospectiveSummarySkeleton />
        ) : topics.length > 0 ? (
          topics.map((topic, index) => (
            <TopicSummaryCard
              key={topic.topicId}
              topic={topic}
              isEditing={isEditing}
              editedSummary={isEditing ? editedTopics[index]?.summary : undefined}
              editedKeyPoints={isEditing ? editedTopics[index]?.keyPoints : undefined}
              onSummaryChange={(v) => handleSummaryChange(index, v)}
              onKeyPointsChange={(kps) => handleKeyPointsChange(index, kps)}
            />
          ))
        ) : (
          /* 빈 상태: 아직 요약 없음 */
          <div className="flex flex-col items-center justify-center py-xlarge">
            <p className="text-grey-600 typo-body4">아직 약속 회고가 생성되지 않았습니다.</p>
            <Button
              variant="primary"
              size="medium"
              className="mt-base"
              onClick={() => navigate(ROUTES.MEETING_RETROSPECTIVE_CREATE(gatheringId, meetingId))}
            >
              약속 회고 생성하기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
