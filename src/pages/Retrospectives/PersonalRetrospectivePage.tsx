import { useParams } from 'react-router-dom'

import { PersonalRetrospectiveContent, usePersonalRetrospective } from '@/features/retrospectives'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { Spinner } from '@/shared/ui'

export default function PersonalRetrospectivePage() {
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const gatheringId = Number(gatheringIdParam)
  const meetingId = Number(meetingIdParam)

  const { data, isLoading, isError } = usePersonalRetrospective({ gatheringId, meetingId })

  if (!gatheringIdParam || !meetingIdParam) return null

  return (
    <>
      <SubPageHeader
        label={data?.gatheringName ?? ''}
        to={ROUTES.GATHERING_DETAIL(gatheringIdParam)}
      />

      <div className="mx-auto max-w-layout-max px-layout-padding mt-base pb-large">
        <h3 className="mb-base text-black typo-heading3">개인 회고</h3>

        {isLoading && (
          <div className="flex justify-center py-xlarge">
            <Spinner />
          </div>
        )}

        {isError && (
          <p className="text-grey-400 typo-body3">개인 회고 정보를 불러오지 못했습니다.</p>
        )}

        {data && <PersonalRetrospectiveContent data={data} />}
      </div>
    </>
  )
}
