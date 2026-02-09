import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  MeetingApprovalList,
  MeetingApprovalListSkeleton,
  type MeetingStatus,
  useMeetingApprovals,
} from '@/features/meetings'
import { PAGE_SIZES } from '@/shared/constants'
import { Container } from '@/shared/ui/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { useGlobalModalStore } from '@/store'

type MeetingTab = Extract<MeetingStatus, 'PENDING' | 'CONFIRMED'>

export default function MeetingSettingPage() {
  const { gatheringId: gatheringIdParam } = useParams<{ gatheringId: string }>()
  const gatheringId = Number(gatheringIdParam)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<MeetingTab>('PENDING')
  const [pendingPage, setPendingPage] = useState(0)
  const [confirmedPage, setConfirmedPage] = useState(0)
  const { openError } = useGlobalModalStore()

  // PENDING 리스트 조회
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    error: pendingError,
  } = useMeetingApprovals({
    gatheringId,
    status: 'PENDING',
    page: pendingPage,
    size: PAGE_SIZES.MEETING_APPROVALS,
  })

  // CONFIRMED 리스트 조회
  const {
    data: confirmedData,
    isLoading: isConfirmedLoading,
    isError: isConfirmedError,
    error: confirmedError,
  } = useMeetingApprovals({
    gatheringId,
    status: 'CONFIRMED',
    page: confirmedPage,
    size: PAGE_SIZES.MEETING_APPROVALS,
  })

  // 에러 발생 시 모달 표시
  useEffect(() => {
    if (isPendingError) {
      openError('에러', pendingError.userMessage, () => {
        navigate('/', { replace: true })
      })
    }
    if (isConfirmedError) {
      openError('에러', confirmedError.userMessage, () => {
        navigate('/', { replace: true })
      })
    }
  }, [isPendingError, isConfirmedError, openError, pendingError, confirmedError, navigate])

  const pendingCount = pendingData?.totalCount
  const confirmedCount = confirmedData?.totalCount

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
                badge={isPendingLoading || isPendingError ? '-' : pendingCount}
                size="medium"
              >
                확정 대기
              </TabsTrigger>
              <TabsTrigger
                className="typo-subtitle2"
                value="CONFIRMED"
                badge={isConfirmedLoading || isConfirmedError ? '-' : confirmedCount}
                size="medium"
              >
                확정 완료
              </TabsTrigger>
            </TabsList>
            <TabsContent value="PENDING">
              {isPendingLoading ? (
                <MeetingApprovalListSkeleton />
              ) : (
                pendingData && (
                  <MeetingApprovalList
                    data={pendingData}
                    currentPage={pendingPage}
                    onPageChange={setPendingPage}
                  />
                )
              )}
            </TabsContent>
            <TabsContent value="CONFIRMED">
              {isConfirmedLoading ? (
                <MeetingApprovalListSkeleton />
              ) : (
                confirmedData && (
                  <MeetingApprovalList
                    data={confirmedData}
                    currentPage={confirmedPage}
                    onPageChange={setConfirmedPage}
                  />
                )
              )}
            </TabsContent>
          </Tabs>
        </Container.Content>
      </Container>
    </div>
  )
}
