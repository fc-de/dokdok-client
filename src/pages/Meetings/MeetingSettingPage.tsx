import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  MeetingApprovalList,
  type MeetingStatus,
  useMeetingApprovalsCount,
} from '@/features/meetings'
import { Container } from '@/shared/ui/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { useGlobalModalStore } from '@/store'

type MeetingTab = Extract<MeetingStatus, 'PENDING' | 'CONFIRMED'>

export default function MeetingSettingPage() {
  const { id } = useParams<{ id: string }>()
  const gatheringId = Number(id)
  const [activeTab, setActiveTab] = useState<MeetingTab>('PENDING')
  const { openError } = useGlobalModalStore()

  // 각 탭의 totalCount만 가져오기
  const {
    pendingCount,
    confirmedCount,
    isPendingLoading,
    isConfirmedLoading,
    pendingError,
    confirmedError,
  } = useMeetingApprovalsCount(gatheringId)

  // 에러 발생 시 모달 표시
  useEffect(() => {
    if (pendingError) {
      openError('오류', '확정 대기 약속 수를 불러오는 데 실패했습니다.')
    }
    if (confirmedError) {
      openError('오류', '확정 완료 약속 수를 불러오는 데 실패했습니다.')
    }
  }, [pendingError, confirmedError, openError])

  return (
    <div>
      {/* 공통컴포넌트로 대체 예정 */}
      {/* <p className="flex items-center typo-body3 text-grey-600 gap-xtiny">뒤로가기</p>
      <h2 className="text-black typo-heading3">약속 설정</h2> */}

      <Container>
        <Container.Title>약속 관리</Container.Title>
        <Container.Content>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as MeetingTab)}
            className="gap-0"
          >
            <TabsList className="border-b border-grey-300" size="medium">
              <TabsTrigger
                className="typo-subtitle2"
                value="PENDING"
                badge={isPendingLoading || pendingError ? '-' : pendingCount}
                size="medium"
              >
                확정 대기
              </TabsTrigger>
              <TabsTrigger
                className="typo-subtitle2"
                value="CONFIRMED"
                badge={isConfirmedLoading || confirmedError ? '-' : confirmedCount}
                size="medium"
              >
                확정 완료
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <MeetingApprovalList
                key={`${gatheringId}-${activeTab}`}
                gatheringId={gatheringId}
                status={activeTab}
              />
            </TabsContent>
          </Tabs>
        </Container.Content>
      </Container>
    </div>
  )
}
