import { useNavigate, useParams } from 'react-router-dom'

import {
  PersonalRetrospectiveViewContent,
  useDeletePersonalRetrospective,
  usePersonalRetrospectiveView,
} from '@/features/retrospectives'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import { useScrollShadow } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { Button, Spinner, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function PersonalRetrospectiveViewPage() {
  const isScrolled = useScrollShadow()
  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  const gatheringId = Number(gatheringIdParam)
  const meetingId = Number(meetingIdParam)

  const navigate = useNavigate()
  const { openConfirm, openError } = useGlobalModalStore()
  const { data, isLoading, isError } = usePersonalRetrospectiveView(meetingId)
  const { mutate: deleteRetrospective, isPending: isDeleting } = useDeletePersonalRetrospective()

  if (
    !Number.isFinite(gatheringId) ||
    gatheringId <= 0 ||
    !Number.isFinite(meetingId) ||
    meetingId <= 0
  )
    return null

  const handleDelete = async () => {
    const confirmed = await openConfirm('개인 회고 삭제', '작성한 개인 회고를 삭제하시겠습니까?', {
      confirmText: '삭제',
      variant: 'danger',
    })
    if (!confirmed) return

    deleteRetrospective(meetingId, {
      onSuccess: () => {
        navigate(ROUTES.GATHERING_DETAIL(gatheringId), { replace: true })
      },
      onError: (error) => {
        openError('삭제 실패', error.userMessage)
      },
    })
  }

  const handleEdit = () => {
    navigate(`${ROUTES.PERSONAL_RETROSPECTIVE(gatheringId, meetingId)}?mode=edit`)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--spacing-gnb-height))]">
      <SubPageHeader
        label={data?.meetingHeaderInfo.gatheringName ?? ''}
        to={ROUTES.GATHERING_DETAIL(gatheringId)}
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
              {data && (
                <p className="typo-caption1 text-grey-600">
                  {data?.meetingHeaderInfo.bookTitle} · {data?.meetingHeaderInfo.bookAuthor}
                </p>
              )}
            </div>
            <div className="flex items-center gap-medium">
              <TextButton onClick={handleDelete} disabled={isDeleting}>
                삭제하기
              </TextButton>
              <Button variant="secondary" outline onClick={handleEdit}>
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
