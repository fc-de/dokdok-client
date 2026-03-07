import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  formatToFullDateWithDay,
  RetrospectiveComments,
  useMeetingRetrospectiveDetail,
} from '@/features/retrospectives/meeting'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { showErrorToast } from '@/shared/lib/toast'
import { Card, Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'

export default function MeetingRetrospectiveDetailPage() {
  const navigate = useNavigate()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const parsedGatheringId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const parsedMeetingId = meetingIdParam ? Number(meetingIdParam) : NaN

  const gatheringId = Number.isFinite(parsedGatheringId) ? parsedGatheringId : 0
  const meetingId = Number.isFinite(parsedMeetingId) ? parsedMeetingId : 0

  // 약속회고 상세 조회
  const { data, isLoading, error } = useMeetingRetrospectiveDetail(meetingId)

  // 에러 처리 및 리다이렉트
  useEffect(() => {
    if (error && gatheringId && meetingId) {
      showErrorToast(error.userMessage)
      navigate(ROUTES.MEETING_DETAIL(gatheringId, meetingId), { replace: true })
    }
  }, [error, navigate, gatheringId, meetingId])

  if (gatheringId === 0 || meetingId === 0) return null

  return (
    <>
      <SubPageHeader label="뒤로가기" to={ROUTES.MEETING_DETAIL(gatheringId, meetingId)} />
      {/* 헤더: 타이틀 */}

      <div className="mx-auto max-w-layout-max px-layout-padding">
        <div className="flex flex-col gap-xtiny mb-base">
          <h3 className="text-black typo-heading3">약속 회고</h3>
          <p className="text-grey-600 typo-caption1">
            약속 회고는 모임의 내용을 함께 돌아보고 각자의 생각을 마무리하는 곳이에요
          </p>
        </div>
        <Card className="p-[36px]">
          {isLoading || !data ? (
            <div className="flex items-center justify-center h-100">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-xtiny border-b border-grey-300 pb-base mb-xsmall">
                <p className="typo-heading2 text-black">{data.meetingName}</p>
                <p className="typo-body6 text-grey-600">
                  {formatToFullDateWithDay(data.meetingDate)} {data.meetingTime}
                </p>
              </div>

              <Tabs defaultValue={`topic-${data.topics[0]?.topicId}`} className="gap-large">
                <TabsList className="border-b border-grey-300" size="medium">
                  {data.topics.map((topic) => (
                    <TabsTrigger key={topic.topicId} value={`topic-${topic.topicId}`}>
                      {topic.topicTitle}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {data.topics.map((topic) => (
                  <TabsContent key={topic.topicId} value={`topic-${topic.topicId}`}>
                    <dl className="flex flex-col gap-medium">
                      <div className="flex flex-col gap-small text-black">
                        <dt className="typo-subtitle2">핵심 요약</dt>
                        <dd className="typo-body1">{topic.summary}</dd>
                      </div>

                      <div className="flex flex-col gap-small text-black">
                        <dt className="typo-subtitle2">주요 포인트</dt>
                        <dd>
                          <ol className="flex flex-col gap-large">
                            {topic.keyPoints.map((keyPoint, index) => (
                              <li key={index} className="typo-body1">
                                <p className="typo-subtitle2">
                                  {index + 1}&#41; {keyPoint.title}
                                </p>
                                {keyPoint.details.map((detail, detailIndex) => (
                                  <p key={detailIndex}>{detail}</p>
                                ))}
                              </li>
                            ))}
                          </ol>
                        </dd>
                      </div>
                    </dl>
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </Card>

        {/* 댓글 영역 */}
        {data && (
          <RetrospectiveComments meetingId={meetingId} meetingLeaderId={data.meetingLeaderId} />
        )}
      </div>
    </>
  )
}
