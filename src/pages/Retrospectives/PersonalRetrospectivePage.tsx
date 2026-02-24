import { useNavigate, useParams } from 'react-router-dom'

import {
  PersonalRetrospectiveContent,
  usePersonalRetrospective,
  usePersonalRetrospectiveForm,
} from '@/features/retrospectives'
import { useUserProfile } from '@/features/user'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { useScrollShadow } from '@/shared/hooks'
import { showToast } from '@/shared/lib/toast'
import { cn } from '@/shared/lib/utils'
import { Button, Spinner } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function PersonalRetrospectivePage() {
  const isScrolled = useScrollShadow()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const gatheringId = Number(gatheringIdParam)
  const meetingId = Number(meetingIdParam)

  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()

  const { data, isLoading, isError } = usePersonalRetrospective({ gatheringId, meetingId })
  const { data: userProfile } = useUserProfile()

  const form = usePersonalRetrospectiveForm({
    meetingId: data?.meetingId ?? 0,
    topics: data?.topics ?? [],
    preOpinions: data?.preOpinions ?? [],
    onSuccess: () => {
      showToast('개인 회고가 저장되었습니다.')
      navigate(ROUTES.MEETING_RETROSPECTIVE(gatheringId, meetingId), { replace: true })
    },
    onError: (error) => {
      openError('저장 실패', error.userMessage)
    },
  })

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
          'sticky top-[calc(var(--spacing-gnb-height)+59px)] z-30 bg-white transition-shadow',
          isScrolled && 'shadow-drop-bottom',
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
            <Button
              onClick={(e) => {
                e.currentTarget.blur()
                form.submit()
              }}
              disabled={form.isSubmitting}
            >
              작성 완료
            </Button>
          </div>
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

          {data && (
            <PersonalRetrospectiveContent
              data={{
                ...data,
                meetingMembers: data.meetingMembers.filter(
                  (m) => m.meetingMemberId !== userProfile?.userId,
                ),
              }}
              form={form}
            />
          )}
        </div>
      </div>
    </div>
  )
}
