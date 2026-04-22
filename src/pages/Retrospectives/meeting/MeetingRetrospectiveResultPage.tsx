import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import type { EditableKeyPoint, SummaryTopic } from '@/features/retrospectives'
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
  aiSuccess?: boolean
}

type EditableSummaryTopic = Omit<SummaryTopic, 'keyPoints'> & { keyPoints: EditableKeyPoint[] }

export default function MeetingRetrospectiveResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { gatheringId, meetingId } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const mId = Number(meetingId)

  // 요약 데이터 조회
  const { data: summaryData, isLoading, isError, refetch } = useSummary(mId)

  // 뮤테이션
  const updateMutation = useUpdateSummary()
  const publishMutation = usePublishSummary()

  // 수정 모드
  const [isEditing, setIsEditing] = useState(false)
  const [editedTopics, setEditedTopics] = useState<EditableSummaryTopic[]>([])

  // CreatePage에서 AI 요약 완료 후 도착했을 때 토스트 표시
  const [fromAiSummary] = useState(() => (location.state as LocationState)?.fromAiSummary ?? false)
  const [aiSuccess] = useState(() => (location.state as LocationState)?.aiSuccess ?? true)

  useEffect(() => {
    if (fromAiSummary) {
      navigate(location.pathname, { replace: true, state: null })
      if (aiSuccess) {
        showToast('독서 모임 내용 요약이 완료됐어요')
      } else {
        showErrorToast('AI 요약에 실패했습니다. 직접 수정하여 완성해주세요.')
      }
    }
  }, [fromAiSummary, aiSuccess, navigate, location.pathname])

  // ─── 유효성 검사 (모든 hook 호출 이후) ───
  if (!gatheringId || !meetingId || !Number.isInteger(mId) || mId <= 0) return null

  // ─── 수정 모드 핸들러 ───
  // guard 통과 후 TypeScript가 gatheringId, meetingId를 string으로 좁힘

  const handleStartEdit = () => {
    if (!summaryData) return
    setEditedTopics(
      summaryData.topics.map((topic) => ({
        ...topic,
        keyPoints: (topic.keyPoints ?? []).map((kp) => ({
          ...kp,
          id: crypto.randomUUID(),
          details: kp.details.map((d) => ({ id: crypto.randomUUID(), value: d })),
        })),
      }))
    )
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    updateMutation.mutate(
      {
        meetingId: mId,
        data: {
          topics: editedTopics.map((t) => ({
            topicId: t.topicId,
            summary: t.summary ?? '',
            keyPoints: t.keyPoints.map((kp) => ({
              title: kp.title,
              details: kp.details.map((d) => d.value),
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
          navigate(ROUTES.MEETING_RETROSPECTIVE_DETAIL(gatheringId, meetingId))
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

  const handleKeyPointsChange = (topicIndex: number, keyPoints: EditableKeyPoint[]) => {
    setEditedTopics((prev) => {
      const next = [...prev]
      next[topicIndex] = { ...next[topicIndex], keyPoints }
      return next
    })
  }

  // topic 표시는 항상 서버 원본(SummaryTopic[])을 사용, 편집 상태는 별도 prop으로 전달
  const displayTopics = summaryData?.topics ?? []

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
        {summaryData && !summaryData.isPublished && !isEditing && (
          <SummaryInfoBanner variant={aiSuccess ? 'success' : 'error'} />
        )}

        {/* 토픽 카드 */}
        {isLoading ? (
          <RetrospectiveSummarySkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center gap-base py-xlarge">
            <p className="typo-body4 text-grey-600">요약 정보를 불러오지 못했습니다.</p>
            <Button size="small" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        ) : displayTopics.length > 0 ? (
          displayTopics.map((topic, index) => (
            <TopicSummaryCard
              key={topic.topicId}
              topic={topic}
              isEditing={isEditing}
              editedSummary={isEditing ? (editedTopics[index]?.summary ?? undefined) : undefined}
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
