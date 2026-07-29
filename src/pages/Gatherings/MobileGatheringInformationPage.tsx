import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  useGatheringDetail,
  useGatheringSettingForm,
  useUpdateGathering,
} from '@/features/gatherings'
import { ROUTES } from '@/shared/constants'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import { Input, Spinner, Textarea } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function MobileGatheringInformationPage() {
  const { id } = useParams<{ id: string }>()
  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const { data: gathering, isLoading, error } = useGatheringDetail(gatheringId)
  const { name, setName, description, setDescription, isValid, getFormData } =
    useGatheringSettingForm(gathering)
  const updateMutation = useUpdateGathering()

  useEffect(() => {
    if (!error) return

    openError('오류', '모임 정보를 불러오는 데 실패했습니다.', () => {
      navigate(ROUTES.GATHERING_SETTING(gatheringId), { replace: true })
    })
  }, [error, gatheringId, navigate, openError])

  if (isLoading) return <Spinner height="full" />

  if (!gathering || gathering.currentUserRole !== 'LEADER') return null

  const handleSave = () => {
    if (!isValid || updateMutation.isPending) return

    updateMutation.mutate(
      { gatheringId, data: getFormData() },
      {
        onSuccess: () => {
          showToast('모임 정보가 수정되었습니다.')
        },
        onError: () => {
          showErrorToast('모임 정보 수정에 실패했습니다.')
        },
      }
    )
  }

  return (
    <MobileLayoutFrame
      variant="header"
      title="독서모임 정보"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_SETTING(gatheringId) }}
      bottomCTA={{
        label: '저장하기',
        loadingLabel: '저장 중...',
        onClick: handleSave,
        disabled: !isValid,
        loading: updateMutation.isPending,
      }}
      className="min-h-dvh lg:hidden"
      contentClassName="lg:hidden"
    >
      <main className="flex flex-col gap-5 px-5 pt-3">
        <div className="flex flex-col gap-5">
          <label htmlFor="gathering-name" className="typo-m-body1 text-black">
            독서모임 이름 <span className="text-primary-300">*</span>
          </label>
          <Input
            id="gathering-name"
            placeholder="독서모임 이름을 입력해주세요."
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={MAX_NAME_LENGTH}
          />
        </div>

        <div className="flex flex-col gap-5">
          <label htmlFor="gathering-description" className="typo-m-body1 text-black">
            독서모임 설명
          </label>
          <Textarea
            id="gathering-description"
            placeholder="모임에 대한 설명을 적어주세요"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={MAX_DESCRIPTION_LENGTH}
            height={176}
          />
        </div>
      </main>
    </MobileLayoutFrame>
  )
}
