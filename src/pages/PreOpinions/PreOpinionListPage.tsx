import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  PreOpinionDetail,
  PreOpinionMemberList,
  usePreOpinionAnswers,
} from '@/features/preOpinions'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { useScrollCollapse } from '@/shared/hooks'
import { Spinner } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function PreOpinionListPage() {
  const { gatheringId, meetingId } = useParams<{ gatheringId: string; meetingId: string }>()
  const navigate = useNavigate()
  const openError = useGlobalModalStore((state) => state.openError)
  const isSticky = useScrollCollapse()
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

  if (isLoading) return <Spinner height="full" />

  return (
    <>
      <SubPageHeader className={isSticky ? 'shadow-drop-bottom' : ''} />
      <h3 className="typo-heading3 text-black mt-large mb-[27px]">사전 의견</h3>
      <div className="flex gap-xlarge">
        {/* 왼쪽: 멤버 리스트 */}
        {data && (
          <PreOpinionMemberList
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
    </>
  )
}
