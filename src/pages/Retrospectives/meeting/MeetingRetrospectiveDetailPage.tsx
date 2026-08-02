import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { MeetingRetrospectiveTopic } from '@/features/retrospectives/meeting'
import {
  formatToFullDateWithDay,
  RetrospectiveComments,
  useMeetingRetrospectiveDetail,
} from '@/features/retrospectives/meeting'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast } from '@/shared/lib/toast'
import { Card, Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'

type TopicDetailsProps = {
  topic: MeetingRetrospectiveTopic
}

function TopicDetails({ topic }: TopicDetailsProps) {
  return (
    <dl className="flex flex-col gap-medium">
      <div className="flex flex-col gap-small text-black">
        <dt className="typo-subtitle2 max-lg:typo-subtitle5">핵심 요약</dt>
        <dd className="typo-body1">{topic.summary}</dd>
      </div>

      <div className="flex flex-col gap-small text-black">
        <dt className="typo-subtitle2 max-lg:typo-subtitle5">주요 포인트</dt>
        <dd>
          <ol className="flex flex-col gap-large max-lg:gap-medium">
            {topic.keyPoints.map((keyPoint, index) => (
              <li key={index} className="typo-body1 max-lg:flex max-lg:flex-col max-lg:gap-tiny">
                <p className="typo-subtitle2 max-lg:typo-subtitle5">
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
  )
}

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
    <MobileLayoutFrame
      variant="header"
      title="약속 회고"
      leftAction={{ type: 'close', to: ROUTES.MEETING_DETAIL(gatheringId, meetingId) }}
      className="min-h-dvh bg-grey-100 max-lg:bg-white lg:min-h-0"
      contentClassName="max-lg:bg-white"
    >
      <SubPageHeader
        label="뒤로가기"
        to={ROUTES.MEETING_DETAIL(gatheringId, meetingId)}
        className="max-lg:hidden"
      />
      {/* 헤더: 타이틀 */}

      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-0">
        <div className="flex flex-col gap-xtiny mb-base max-lg:hidden">
          <h3 className="text-black typo-heading3">약속 회고</h3>
          <p className="text-grey-600 typo-caption1">
            약속 회고는 모임의 내용을 함께 돌아보고 각자의 생각을 마무리하는 곳이에요
          </p>
        </div>
        <Card className="p-[36px] max-lg:rounded-none max-lg:border-0 max-lg:p-0">
          {isLoading || !data ? (
            <div className="flex items-center justify-center h-100">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-xtiny border-b border-grey-300 pb-base mb-xsmall max-lg:px-5 max-lg:pt-small max-lg:pb-small max-lg:shadow-drop">
                <p className="typo-heading2 max-lg:typo-subtitle5 text-black">{data.meetingName}</p>
                <p className="typo-body6 max-lg:typo-body6 text-grey-600">
                  {formatToFullDateWithDay(data.meetingDate)} {data.meetingTime}
                </p>
              </div>

              <div className="hidden flex-col gap-xlarge px-5 pt-large max-lg:flex max-lg:gap-medium max-lg:pt-medium">
                {data.topics.map((topic) => (
                  <section
                    key={topic.topicId}
                    className="flex flex-col gap-large max-lg:gap-medium"
                  >
                    <div className="flex flex-col gap-xtiny">
                      <h2 className="typo-subtitle2 text-black">{topic.topicTitle}</h2>
                      <p className="typo-caption2 text-grey-600">{topic.topicDescription}</p>
                    </div>
                    <TopicDetails topic={topic} />
                  </section>
                ))}
              </div>

              <Tabs
                defaultValue={`topic-${data.topics[0]?.topicId}`}
                className="gap-large max-lg:hidden"
              >
                <TabsList className="border-b border-grey-300" size="medium">
                  {data.topics.map((topic) => (
                    <TabsTrigger key={topic.topicId} value={`topic-${topic.topicId}`}>
                      {topic.topicTitle}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {data.topics.map((topic) => (
                  <TabsContent key={topic.topicId} value={`topic-${topic.topicId}`}>
                    <TopicDetails topic={topic} />
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
    </MobileLayoutFrame>
  )
}
