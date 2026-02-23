import { useParams } from 'react-router-dom'

import {
  PersonalRetrospectiveContent,
  usePersonalRetrospective,
  usePersonalRetrospectiveForm,
} from '@/features/retrospectives'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { Button, Spinner } from '@/shared/ui'

export default function PersonalRetrospectivePage() {
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const gatheringId = Number(gatheringIdParam)
  const meetingId = Number(meetingIdParam)

  const { data, isLoading, isError } = usePersonalRetrospective({ gatheringId, meetingId })

  const form = usePersonalRetrospectiveForm({
    meetingId: data?.meetingId ?? 0,
    topics: data?.topics ?? [],
    preOpinions: data?.preOpinions ?? [],
  })

  if (!gatheringIdParam || !meetingIdParam) return null

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--spacing-gnb-height))]">
      <SubPageHeader
        label={data?.meetingHeaderInfo.gatheringName ?? ''}
        to={ROUTES.GATHERING_DETAIL(gatheringIdParam)}
      />

      <div className="mx-auto max-w-layout-max px-layout-padding w-full">
        <div className="flex justify-between">
          <div className="flex flex-col gap-xtiny h-[65px]">
            <h3 className="text-black typo-heading3">개인 회고</h3>
            <p className="typo-caption1 text-grey-600">
              {data?.meetingHeaderInfo.bookTitle} · {data?.meetingHeaderInfo.bookAuthor}
            </p>
          </div>
          <Button onClick={form.submit} disabled={form.isSubmitting}>
            작성 완료
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-grey-100 pb-large">
        <div className="mx-auto max-w-layout-max px-layout-padding">
          {isLoading && (
            <div className="flex justify-center py-xlarge">
              <Spinner />
            </div>
          )}

          {isError && (
            <p className="text-grey-400 typo-body3">개인 회고 정보를 불러오지 못했습니다.</p>
          )}

          {data && <PersonalRetrospectiveContent data={data} form={form} />}
        </div>
      </div>
    </div>
  )
}
