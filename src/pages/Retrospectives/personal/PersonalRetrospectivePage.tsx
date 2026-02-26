import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import {
  PersonalRetrospectiveContent,
  usePersonalRetrospective,
  usePersonalRetrospectiveEditForm,
  usePersonalRetrospectiveForm,
} from '@/features/retrospectives'
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
  const [searchParams] = useSearchParams()
  const isEditMode = searchParams.get('mode') === 'edit'

  const gatheringId = Number(gatheringIdParam)
  const meetingId = Number(meetingIdParam)

  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()

  // 작성 모드: 작성 폼 API만 호출
  const { data, isLoading, isError } = usePersonalRetrospective(
    { gatheringId, meetingId },
    !isEditMode
  )

  // 수정 모드: 수정 폼 API만 호출
  const {
    data: editFormData,
    isLoading: isEditFormLoading,
    isError: isEditFormError,
  } = usePersonalRetrospectiveEditForm(meetingId, isEditMode)

  const activeData = isEditMode ? editFormData : data
  const isDataReady = !!activeData
  const isAnyLoading = isEditMode ? isEditFormLoading : isLoading
  const isAnyError = isEditMode ? isEditFormError : isError

  // 수정 모드에서는 edit form의 retrospective.changedThoughts에 저장된 preOpinion을 사용
  const preOpinions = isEditMode
    ? (editFormData?.retrospective.changedThoughts ?? [])
        .filter((ct) => ct.preOpinion !== null)
        .map((ct) => ({
          topicId: ct.topicId,
          topicName: editFormData?.topics.find((t) => t.topicId === ct.topicId)?.topicName ?? '',
          content: ct.preOpinion!,
        }))
    : (data?.preOpinions ?? [])

  const form = usePersonalRetrospectiveForm({
    meetingId,
    topics: activeData?.topics ?? [],
    preOpinions,
    mode: isEditMode ? 'edit' : 'create',
    editFormData: isEditMode ? editFormData : undefined,
    onSuccess: () => {
      showToast(isEditMode ? '개인 회고가 수정되었습니다.' : '개인 회고가 저장되었습니다.')
      navigate(ROUTES.PERSONAL_RETROSPECTIVE_VIEW(gatheringId, meetingId), { replace: true })
    },
    onError: (error) => {
      openError(isEditMode ? '수정 실패' : '저장 실패', error.userMessage)
    },
  })

  if (!gatheringIdParam || !meetingIdParam) return null

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--spacing-gnb-height))]">
      <SubPageHeader
        label={activeData?.meetingHeaderInfo.gatheringName ?? ''}
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
                {activeData?.meetingHeaderInfo.bookTitle} ·{' '}
                {activeData?.meetingHeaderInfo.bookAuthor}
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.currentTarget.blur()
                if (!isDataReady || isAnyLoading || isAnyError) return
                form.submit()
              }}
              disabled={form.isSubmitting || isAnyLoading || isAnyError || !isDataReady}
            >
              작성 완료
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-grey-100 pb-large">
        <div className="mx-auto max-w-layout-max px-layout-padding">
          {isAnyLoading && (
            <div className="flex justify-center py-xlarge">
              <Spinner />
            </div>
          )}

          {isAnyError && (
            <p className="text-grey-400 typo-body3">개인 회고 정보를 불러오지 못했습니다.</p>
          )}

          {isDataReady && (
            <PersonalRetrospectiveContent
              topics={activeData?.topics ?? []}
              meetingMembers={activeData?.meetingMembers ?? []}
              form={form}
            />
          )}
        </div>
      </div>
    </div>
  )
}
