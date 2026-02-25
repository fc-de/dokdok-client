import { useNavigate, useParams } from 'react-router-dom'

import {
  PersonalRetrospectiveViewContent,
  usePersonalRetrospectiveView,
} from '@/features/retrospectives'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { useScrollShadow } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { Button, Spinner, TextButton } from '@/shared/ui'

export default function PersonalRetrospectiveViewPage() {
  const isScrolled = useScrollShadow()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const gatheringId = Number(gatheringIdParam)
  const meetingId = Number(meetingIdParam)

  const navigate = useNavigate()
  const { data, isLoading, isError } = usePersonalRetrospectiveView(meetingId)

  if (!gatheringIdParam || !meetingIdParam) return null

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--spacing-gnb-height))]">
      <SubPageHeader
        label={data?.meetingHeaderInfo.gatheringName ?? ''}
        to={ROUTES.GATHERING_DETAIL(gatheringIdParam)}
        disableShadow
      />

      <div
        className={cn(
          'sticky sticky-below-subheader z-30 bg-white transition-shadow',
          isScrolled && 'shadow-drop-bottom'
        )}
      >
        <div className="mx-auto max-w-layout-max px-layout-padding w-full">
          <div className="flex justify-between items-center h-16.25">
            <div className="flex flex-col gap-xtiny">
              <h3 className="text-black typo-heading3">개인 회고</h3>
              <p className="typo-caption1 text-grey-600">
                {data?.meetingHeaderInfo.bookTitle} · {data?.meetingHeaderInfo.bookAuthor}
              </p>
            </div>
            <div className="flex items-center gap-medium">
              <TextButton
                onClick={() => navigate(ROUTES.PERSONAL_RETROSPECTIVE(gatheringId, meetingId))}
              >
                삭제하기
              </TextButton>
              <Button
                variant="secondary"
                outline
                onClick={() => navigate(ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId))}
              >
                수정하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pb-large">
        <div className="mx-auto max-w-layout-max px-layout-padding">
          {isLoading && (
            <div className="flex justify-center py-xlarge">
              <Spinner />
            </div>
          )}

          {isError && (
            <p className="text-grey-400 typo-body3 pt-large">
              개인 회고 정보를 불러오지 못했습니다.
            </p>
          )}

          {data && <PersonalRetrospectiveViewContent data={data} />}
        </div>
      </div>
    </div>
  )
}
