import { useState } from 'react'

import { MeetingApprovalList } from '@/features/meetings/components/MeetingApprovalList'
import { useMeetingApprovalsCount } from '@/features/meetings/hooks/useMeetingApprovalsCount'
import type { MeetingStatus } from '@/features/meetings/meetings.types'
import { Container } from '@/shared/ui/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'

type MeetingTab = Extract<MeetingStatus, 'PENDING' | 'CONFIRMED'>

export default function MeetingSettingPage() {
  // TODO: 실제 gatheringId는 URL 파라미터나 상태 관리에서 가져와야 함
  const gatheringId = 1
  const [activeTab, setActiveTab] = useState<MeetingTab>('PENDING')

  // 각 탭의 totalCount만 가져오기
  const { pendingCount, confirmedCount, isPendingLoading, isConfirmedLoading } =
    useMeetingApprovalsCount(gatheringId)

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
                badge={isPendingLoading ? '-' : pendingCount}
                size="medium"
              >
                확정 대기
              </TabsTrigger>
              <TabsTrigger
                className="typo-subtitle2"
                value="CONFIRMED"
                badge={isConfirmedLoading ? '-' : confirmedCount}
                size="medium"
              >
                확정 완료
              </TabsTrigger>
            </TabsList>
            <TabsContent value="PENDING">
              <MeetingApprovalList gatheringId={gatheringId} status="PENDING" />
            </TabsContent>
            <TabsContent value="CONFIRMED">
              <MeetingApprovalList gatheringId={gatheringId} status="CONFIRMED" />
            </TabsContent>
          </Tabs>
        </Container.Content>
      </Container>
    </div>
  )
}
