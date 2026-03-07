import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PAGE_ACCESS_ERROR_CODES } from '@/api/errors'
import {
  AiLoadingOverlay,
  type GetCollectedAnswersResponse,
  useCollectedAnswers,
  useCreateSttJob,
} from '@/features/retrospectives/meeting'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { showErrorToast } from '@/shared/lib/toast'
import {
  Accordion,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  Dropzone,
  type DropzoneHandle,
  Spinner,
} from '@/shared/ui'
import AlertIcon from '@/shared/ui/AlertIcon'

export default function MeetingRetrospectiveCreatePage() {
  const navigate = useNavigate()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const parsedGatheringId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const parsedMeetingId = meetingIdParam ? Number(meetingIdParam) : NaN

  const gatheringId = Number.isFinite(parsedGatheringId) ? parsedGatheringId : 0
  const meetingId = Number.isFinite(parsedMeetingId) ? parsedMeetingId : 0

  // 업로드된 파일 상태
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const dropzoneRef = useRef<DropzoneHandle>(null)

  // STT Job 생성 mutation
  const sttMutation = useCreateSttJob()

  // 수집된 사전 의견 조회
  const {
    data: collectedAnswersData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectedAnswers({
    meetingId,
  })

  const observerRef = useInfiniteScroll(fetchNextPage, {
    hasNextPage,
    isFetchingNextPage,
  })

  // 에러 처리 및 리다이렉트
  // 권한 에러(PAGE_ACCESS_ERROR_CODES)는 usePermissionRedirect 전역 핸들러에서 처리하므로 제외
  useEffect(() => {
    if (error && gatheringId && meetingId) {
      if (PAGE_ACCESS_ERROR_CODES.has(error.code)) return
      showErrorToast(error.userMessage)
      navigate(ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId), { replace: true })
    }
  }, [error, navigate, gatheringId, meetingId])

  // 수집된 사전 의견 총 개수
  const totalCount = collectedAnswersData?.pages[0]?.totalCount ?? 0
  const hasData = totalCount > 0

  // AI 요약 시작
  const handleStartAiSummary = () => {
    sttMutation.mutate(
      { gatheringId, meetingId, file: uploadedFile ?? undefined },
      {
        onSuccess: () => {
          navigate(ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId), {
            state: { fromAiSummary: true },
          })
        },
        onError: (err) => {
          if (err.message === 'canceled') return
          if (PAGE_ACCESS_ERROR_CODES.has(err.code)) return
          showErrorToast(err.userMessage ?? '요약 생성에 실패했습니다.')
        },
      }
    )
  }

  // 파일 업로드 핸들러
  const handleFileChange = (file: File | null) => {
    setUploadedFile(file)
  }

  const handleSizeExceeded = () => {
    showErrorToast('용량을 초과했어요.')
  }

  const handleTypeRejected = () => {
    showErrorToast('오디오 파일만 업로드할 수 있어요.')
  }

  const handleUploadButtonClick = () => {
    dropzoneRef.current?.triggerFileSelect()
  }

  if (gatheringId === 0 || meetingId === 0) return null

  return (
    <>
      <SubPageHeader label="뒤로가기" to={ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId)} />

      {/* 헤더: 타이틀 + 설명 + AI 요약 시작하기 버튼 */}
      <div className="sticky top-[calc(var(--spacing-gnb-height)+59px)] z-30 bg-white shadow-drop-bottom">
        <div className="mx-auto max-w-layout-max px-layout-padding flex items-center justify-between pb-small">
          <div className="flex flex-col gap-xtiny">
            <h3 className="text-black typo-heading3">약속 회고</h3>
            <p className="text-grey-600 typo-caption1">
              사전 의견과 녹음 파일을 분석하여 약속 회고를 자동 생성해요
            </p>
          </div>
          <Button
            variant="ai"
            size="small"
            onClick={handleStartAiSummary}
            className="px-medium"
            disabled={totalCount === 0 || sttMutation.isPending}
          >
            AI 요약 시작하기
          </Button>
        </div>
      </div>

      {/* 두 패널 영역 */}
      <div className="mx-auto max-w-layout-max px-layout-padding flex gap-medium mt-base">
        {/* 왼쪽: 수집된 사전 의견 */}
        <div className="flex flex-1 flex-col gap-medium rounded-base border border-grey-300 bg-white p-large shadow-drop">
          <div className="flex flex-col gap-xtiny">
            <h4 className="text-black typo-heading3">수집된 사전 의견</h4>
            <p className="text-grey-600 typo-body4">{totalCount}개</p>
          </div>
          <Card className="border-none bg-grey-100 p-large h-[440px] overflow-auto custom-scroll-grey">
            {isLoading || !collectedAnswersData ? (
              <div className="flex items-center justify-center h-full">
                <Spinner />
              </div>
            ) : !hasData ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-grey-500 typo-body2">수집된 사전의견이 없습니다.</p>
              </div>
            ) : (
              <>
                <Accordion type="multiple">
                  {collectedAnswersData.pages
                    .flatMap((page: GetCollectedAnswersResponse) => page.items)
                    .map((answer) => (
                      <Accordion.Item key={answer.userId} value={`item-${answer.userId}`}>
                        <Accordion.Trigger showIcon={false}>
                          <div className="flex gap-small items-center">
                            <Avatar>
                              <AvatarImage src={answer.profileImageUrl} alt={answer.nickname} />
                              <AvatarFallback>{answer.nickname.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span>{answer.nickname}</span>
                          </div>
                        </Accordion.Trigger>
                        <Accordion.Content>
                          <dl className="flex flex-col gap-small">
                            {answer.topics.map((topic) => (
                              <div key={topic.answerId} className="flex flex-col gap-xtiny">
                                <dt className="text-grey-800 typo-subtitle2">{topic.title}</dt>
                                <dd className="text-grey-700 typo-body3">{topic.content}</dd>
                              </div>
                            ))}
                          </dl>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                </Accordion>

                {/* 무한 스크롤 로딩 상태 */}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-small">
                    <Spinner />
                  </div>
                )}

                {/* 무한 스크롤 트리거 */}
                {hasNextPage && !isFetchingNextPage && <div ref={observerRef} className="h-4" />}
              </>
            )}
          </Card>
        </div>

        {/* 오른쪽: 녹음 파일 업로드 */}
        <div className="flex flex-1 flex-col gap-medium rounded-base border border-grey-300 bg-white p-large shadow-drop">
          <div className="flex flex-col gap-medium mb-small">
            <div className="flex flex-col gap-xtiny">
              <h4 className="text-black typo-heading3">녹음 파일 업로드</h4>
              <p className="text-grey-600 typo-body4">
                AI가 음성을 텍스트로 변환하여 분석해요
                <br />
                녹음 없이 사전 의견만으로도 회고를 만들 수 있어요
              </p>
            </div>
            <div className="flex justify-between">
              <p className="typo-body3 text-purple-200 flex gap-tiny">
                <AlertIcon />
                파일은 하나만 업로드 할 수 있어요
              </p>
              <Button variant="secondary" outline onClick={handleUploadButtonClick}>
                {uploadedFile ? '음성 파일 교체' : '음성 파일 업로드'}
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <Dropzone
              ref={dropzoneRef}
              maxSizeInMB={50}
              accept="audio/*"
              onFileChange={handleFileChange}
              onSizeExceeded={handleSizeExceeded}
              onTypeRejected={handleTypeRejected}
            />
          </div>
        </div>
      </div>

      <AiLoadingOverlay isOpen={sttMutation.isPending} onCancel={() => sttMutation.cancel()} />
    </>
  )
}
