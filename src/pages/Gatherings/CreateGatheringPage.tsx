import { ChevronLeft, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { CreateGatheringResponse } from '@/features/gatherings'
import { useCreateGathering } from '@/features/gatherings'
import PaperPlane from '@/shared/assets/icon/paper-plane.svg'
import { ROUTES } from '@/shared/constants'
import { Button, Input, Textarea, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

const MAX_NAME_LENGTH = 12
const MAX_DESCRIPTION_LENGTH = 150

type Step = 'form' | 'complete'

export default function CreateGatheringPage() {
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createdData, setCreatedData] = useState<CreateGatheringResponse | null>(null)

  const { mutate: createGathering, isPending } = useCreateGathering()

  const isValid = name.trim().length > 0 && name.length <= MAX_NAME_LENGTH

  const handleBack = () => {
    navigate(-1)
  }

  const handleSubmit = () => {
    if (!isValid || isPending) return

    createGathering(
      { gatheringName: name.trim(), gatheringDescription: description.trim() || undefined },
      {
        onSuccess: (response) => {
          setCreatedData(response.data)
          setStep('complete')
        },
        onError: () => {
          openError('오류', '모임 생성 중 오류가 발생했습니다.')
        },
      }
    )
  }

  // 전체 초대 URL 생성
  const getFullInviteUrl = () => {
    if (!createdData?.invitationLink) return ''
    return `${window.location.origin}${ROUTES.INVITE(createdData.invitationLink)}`
  }

  const handleCopyLink = async () => {
    const fullUrl = getFullInviteUrl()
    if (!fullUrl) return

    try {
      await navigator.clipboard.writeText(fullUrl)
      // TODO: toast 알림 표시
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  }

  const handleComplete = () => {
    if (createdData?.gatheringId) {
      navigate(ROUTES.GATHERING_DETAIL(createdData.gatheringId))
    } else {
      navigate(ROUTES.GATHERINGS)
    }
  }

  return (
    <div className="flex flex-col items-center gap-11 w-full">
      {/* 뒤로가기 */}
      <div className="w-full pt-7.25 pb-2.5 leading-0">
        <TextButton icon={ChevronLeft} size="medium" onClick={handleBack}>
          뒤로가기
        </TextButton>
      </div>

      {step === 'form' ? (
        /* Step 1: 폼 입력 화면 */
        <div className="flex flex-col justify-between w-full max-w-100 h-125">
          {/* 제목 */}
          <h1 className="typo-heading2 text-black text-center">독서모임 만들기</h1>

          {/* 입력 폼 */}
          <div className="flex flex-col gap-base w-full">
            {/* 모임 이름 */}
            <div className="flex flex-col gap-base w-full">
              <div className="flex items-start gap-xtiny pl-0.5">
                <span className="typo-subtitle3 text-black">모임 이름</span>
                <span className="text-primary-300 typo-caption1">*</span>
              </div>
              <Input
                placeholder="모임 이름을 입력해주세요"
                maxLength={MAX_NAME_LENGTH}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 모임 설명 */}
            <div className="flex flex-col gap-base w-full">
              <div className="flex items-start pl-0.5">
                <span className="typo-subtitle3 text-black">모임 설명</span>
              </div>
              <Textarea
                placeholder="모임에 대한 소개글을 입력해주세요"
                maxLength={MAX_DESCRIPTION_LENGTH}
                height={86}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* 만들기 버튼 */}
          <Button
            variant="primary"
            size="large"
            className="w-full"
            disabled={!isValid || isPending}
            onClick={handleSubmit}
          >
            만들기
          </Button>
        </div>
      ) : (
        /* Step 2: 생성 완료 화면 */
        <div className="flex flex-col justify-between w-full max-w-100 h-125">
          {/* 성공 메시지 & 일러스트 */}
          <div className="flex flex-col gap-base items-center w-full">
            <div className="flex flex-col gap-xtiny items-center text-center w-full">
              <p className="typo-subtitle1 text-primary-300">
                '{createdData?.gatheringName ?? name}'
              </p>
              <h1 className="typo-heading2 text-black">모임이 만들어졌어요!</h1>
            </div>
            <div className="pl-xsmall">
              <img src={PaperPlane} alt="종이비행기" className="w-52.25 h-45.5" />
            </div>
          </div>

          {/* 초대 링크 & 완료 버튼 */}
          <div className="flex flex-col gap-9 w-full">
            <div className="flex flex-col gap-base items-center w-full">
              <p className="typo-body3 text-grey-600 text-center">
                초대 링크를 복사해서
                <br />
                함께하고 싶은 멤버들에게 전달해 보세요
              </p>
              {/* 링크 복사 박스 */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-base w-full px-7 py-small bg-white border border-grey-400 rounded-[50px] cursor-pointer hover:border-grey-500 transition-colors"
              >
                <span className="flex-1 typo-body1 text-grey-800 text-left truncate">
                  {getFullInviteUrl()}
                </span>
                <LinkIcon className="size-5 text-grey-600 shrink-0" />
              </button>
            </div>

            {/* 완료 버튼 */}
            <Button variant="primary" size="large" className="w-full" onClick={handleComplete}>
              완료
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
