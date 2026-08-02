import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  PreOpinionDetail,
  PreOpinionMemberList,
  usePreOpinionAnswers,
} from '@/features/pre-opinion'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants/routes'
import { MobileLayoutFrame } from '@/shared/layout'
import { Spinner } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function PreOpinionListPage() {
  const { gatheringId, meetingId } = useParams<{ gatheringId: string; meetingId: string }>()
  const navigate = useNavigate()
  const openError = useGlobalModalStore((state) => state.openError)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)

  const { data, isLoading, error } = usePreOpinionAnswers({
    gatheringId: Number(gatheringId),
    meetingId: Number(meetingId),
  })

  useEffect(() => {
    if (error) {
      openError('조회 불가', error.userMessage, () => navigate(-1))
    }
  }, [error, openError, navigate])

  // 선택된 멤버 ID: 유저가 선택한 값이 있으면 사용, 없으면 첫 번째 제출한 멤버를 기본값으로
  const activeMemberId = useMemo(() => {
    if (selectedMemberId !== null) return selectedMemberId
    const firstSubmitted = data?.members.find((m) => m.isSubmitted)
    return firstSubmitted?.memberInfo.userId ?? null
  }, [selectedMemberId, data])

  const selectedMember = data?.members.find((m) => m.memberInfo.userId === activeMemberId)
  const backTo =
    gatheringId && meetingId ? ROUTES.MEETING_DETAIL(gatheringId, meetingId) : undefined

  if (isLoading) {
    return (
      <MobileLayoutFrame
        variant="header"
        title="사전 의견"
        leftAction={{ type: 'back', to: backTo }}
        className="min-h-dvh lg:min-h-0"
      >
        <Spinner height="full" />
      </MobileLayoutFrame>
    )
  }

  return (
    <MobileLayoutFrame
      variant="header"
      title="사전 의견"
      leftAction={{ type: 'back', to: backTo }}
      className="min-h-dvh lg:min-h-0"
    >
      <SubPageHeader className="max-lg:hidden" />

      {/* 모바일: 스크롤 시 헤더 아래로 고정되는 멤버 아바타 리스트 (배경 투명) */}
      {data && (
        <div className="sticky top-mobile-header-height z-40 bg-transparent lg:hidden">
          <PreOpinionMemberList
            variant="mobile"
            members={data.members}
            selectedMemberId={activeMemberId}
            onSelectMember={setSelectedMemberId}
          />
        </div>
      )}

      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5 max-lg:pt-0 max-lg:pb-10 max-lg:overflow-x-hidden">
        <h3 className="typo-heading3 text-black mt-large mb-6.75 max-lg:hidden">사전 의견</h3>
        <div className="flex gap-xlarge max-lg:flex-col max-lg:gap-base">
          {/* 왼쪽: 멤버 리스트 (데스크탑) */}
          {data && (
            <PreOpinionMemberList
              variant="desktop"
              className="max-lg:hidden"
              members={data.members}
              selectedMemberId={activeMemberId}
              onSelectMember={setSelectedMemberId}
            />
          )}

          {/* 오른쪽: 선택된 멤버의 의견 상세 */}
          {selectedMember && data ? (
            <PreOpinionDetail
              member={selectedMember}
              topics={data.topics}
              gatheringId={Number(gatheringId)}
              meetingId={Number(meetingId)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="typo-body2 text-grey-500">멤버를 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayoutFrame>
  )
}
