import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PAGE_ACCESS_ERROR_CODES } from '@/api/errors'
import {
  AiLoadingOverlay,
  type GetCollectedAnswersResponse,
  useCollectedAnswers,
  useCreateSttJob,
} from '@/features/retrospectives/meeting'
import FormPageHeader from '@/shared/components/FormPageHeader'
import { ROUTES } from '@/shared/constants'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { MobileLayoutFrame } from '@/shared/layout'
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
        onSuccess: (data) => {
          // AI 요약 실패해서 data.status가 DONE이 아니어도 결과 페이지로 우선 이동
          navigate(ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId), {
            state: { fromAiSummary: true, aiSuccess: data.status === 'DONE' },
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
    <MobileLayoutFrame
      variant="header"
      title="약속 회고 생성하기"
      leftAction={{ type: 'close', to: ROUTES.MEETING_DETAIL(gatheringId, meetingId) }}
      bottomCTA={{
        label: 'AI 요약 시작하기',
        loadingLabel: '요약 생성 중...',
        onClick: handleStartAiSummary,
        disabled: totalCount === 0 || sttMutation.isPending,
        loading: sttMutation.isPending,
        variant: 'ai',
      }}
      className="min-h-dvh lg:min-h-0"
    >
      <FormPageHeader
        title="약속 회고"
        subTitle="사전 의견과 녹음 파일을 분석하여 약속 회고를 자동 생성해요"
        to={ROUTES.MEETING_DETAIL(gatheringId, meetingId)}
        className="max-lg:hidden"
      >
        <Button
          variant="ai"
          size="small"
          onClick={handleStartAiSummary}
          className="px-medium"
          disabled={totalCount === 0 || sttMutation.isPending}
        >
          AI 요약 시작하기
        </Button>
      </FormPageHeader>

      {/* 두 패널 영역 */}
      <div className="mx-auto mt-base flex max-w-layout-max gap-medium px-layout-padding max-lg:mt-0 max-lg:flex-col-reverse max-lg:gap-8 max-lg:px-5">
        {/* 왼쪽: 수집된 사전 의견 */}
        <div className="flex flex-1 flex-col gap-medium rounded-base border border-grey-300 bg-white p-large shadow-drop max-lg:gap-3 max-lg:rounded-none max-lg:border-0 max-lg:p-0 max-lg:shadow-none">
          <div className="flex flex-col gap-xtiny max-lg:hidden">
            <h4 className="text-black typo-heading3">수집된 사전 의견</h4>
            <p className="text-grey-600 typo-body4">{totalCount}개</p>
          </div>
          <div className="hidden flex-col gap-2 max-lg:flex">
            <h4 className="text-black typo-subtitle2">{totalCount}개의 사전 의견</h4>
            <p className="whitespace-pre-line text-grey-600 typo-m-body4">
              {
                '약속 회고에 적용될 멤버의 사전 의견들을 확인해보세요\n부적절한 사전 의견은 반영되지 않을 수 있어요'
              }
            </p>
          </div>
          <Card className="h-[440px] overflow-auto border-none bg-grey-100 p-large custom-scroll-grey max-lg:h-auto max-lg:overflow-visible max-lg:rounded-none max-lg:bg-white max-lg:p-0">
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
                <Accordion type="multiple" className="max-lg:gap-small">
                  {collectedAnswersData.pages
                    .flatMap((page: GetCollectedAnswersResponse) => page.items)
                    .map((answer) => (
                      <Accordion.Item key={answer.userId} value={`item-${answer.userId}`}>
                        <Accordion.Trigger
                          showIcon={false}
                          className="group max-lg:group max-lg:min-h-13 max-lg:items-center max-lg:rounded-small max-lg:px-5 max-lg:py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-xsmall">
                            <Avatar>
                              <AvatarImage src={answer.profileImageUrl} alt={answer.nickname} />
                              <AvatarFallback>{answer.nickname.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span className="truncate typo-subtitle5">{answer.nickname}</span>
                          </div>
                          <span
                            aria-hidden
                            className="hidden size-8 shrink-0 items-center justify-center max-lg:flex"
                          >
                            <ChevronDown className="size-6 text-grey-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </span>
                        </Accordion.Trigger>
                        <Accordion.Content className="max-lg:mt-3 max-lg:rounded-small max-lg:bg-grey-100 max-lg:[&>div]:px-4 max-lg:[&>div]:py-5">
                          <dl className="flex flex-col gap-small max-lg:gap-small">
                            {answer.topics.map((topic) => (
                              <div key={topic.answerId} className="flex flex-col gap-xtiny">
                                <dt className="text-grey-800 typo-subtitle2 max-lg:text-black max-lg:typo-subtitle5">
                                  {topic.title}
                                </dt>
                                <dd className="text-grey-700 typo-body3 max-lg:typo-m-body4">
                                  {topic.content}
                                </dd>
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
        <div className="flex flex-1 flex-col gap-medium rounded-base border border-grey-300 bg-white p-large shadow-drop max-lg:gap-3 max-lg:rounded-none max-lg:border-0 max-lg:px-0 max-lg:pb-0 max-lg:pt-medium max-lg:shadow-none">
          <div className="mb-small flex flex-col gap-medium max-lg:mb-0 max-lg:gap-2">
            <div className="flex flex-col gap-xtiny">
              <h4 className="text-black typo-heading3 max-lg:typo-subtitle2">녹음 파일 업로드</h4>
              <p className="text-grey-600 typo-body4 max-lg:hidden">
                AI가 음성을 텍스트로 변환하여 분석해요
                <br />
                녹음 없이 사전 의견만으로도 회고를 만들 수 있어요
              </p>
              <p className="hidden text-grey-600 typo-m-body4 max-lg:block">
                사전 의견과 녹음 파일을 분석하여 약속 회고를 자동 생성해요
              </p>
            </div>
            <div className="flex justify-between max-lg:hidden">
              <p className="flex gap-tiny text-purple-200 typo-body3">
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
          <p className="hidden items-center gap-2 text-purple-200 typo-m-caption1 max-lg:flex">
            <AlertIcon size={15} />
            최대 50MB인 한 가지 파일만 업로드 할 수 있어요.
          </p>
        </div>
      </div>

      <AiLoadingOverlay isOpen={sttMutation.isPending} onCancel={() => sttMutation.cancel()} />
    </MobileLayoutFrame>
  )
}
