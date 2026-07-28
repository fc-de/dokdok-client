import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  MeetingApprovalList,
  MeetingApprovalListSkeleton,
  type MeetingStatus,
  useMeetingApprovals,
} from '@/features/meetings'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { PAGE_SIZES, ROUTES } from '@/shared/constants'
import { useDevice } from '@/shared/hooks'
import { MobileLayoutFrame } from '@/shared/layout'
import { Container } from '@/shared/ui/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { useGlobalModalStore } from '@/store'

type MeetingTab = Extract<MeetingStatus, 'PENDING' | 'CONFIRMED'>

export default function MeetingSettingPage() {
  const { gatheringId: gatheringIdParam } = useParams<{ gatheringId: string }>()
  const parsedId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<MeetingTab>('PENDING')
  const [pendingPage, setPendingPage] = useState(0)
  const [confirmedPage, setConfirmedPage] = useState(0)
  const { openError } = useGlobalModalStore()
  const { isMobile } = useDevice()

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
  } = useMeetingApprovals(
    {
      gatheringId,
      status: 'CONFIRMED',
      page: confirmedPage,
      size: PAGE_SIZES.MEETING_APPROVALS,
    },
    { enabled: !isMobile }
  )

  // 에러 발생 시 모달 표시 (동시 에러 발생 시 첫 번째 에러만 처리)
  useEffect(() => {
    if (isPendingError) {
      openError('에러', pendingError.userMessage, () => {
        navigate('/', { replace: true })
      })
    } else if (!isMobile && isConfirmedError) {
      openError('에러', confirmedError.userMessage, () => {
        navigate('/', { replace: true })
      })
    }
  }, [
    isPendingError,
    isConfirmedError,
    isMobile,
    openError,
    pendingError,
    confirmedError,
    navigate,
  ])

  const pendingCount = pendingData?.totalCount
  const confirmedCount = confirmedData?.totalCount

  return (
    <MobileLayoutFrame
      variant="header"
      title="승인 대기 중인 약속"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_DETAIL(gatheringId) }}
      className="min-h-dvh lg:min-h-0"
    >
      <SubPageHeader label="약속 설정" className="max-lg:hidden" />
      <div className="bg-grey-100 max-lg:bg-white">
        <div className="mx-auto max-w-layout-max px-layout-padding py-xlarge max-lg:px-5 max-lg:py-5">
          <div className="lg:hidden">
            {isPendingLoading || isPendingError ? (
              <MeetingApprovalListSkeleton />
            ) : (
              pendingData && (
                <MeetingApprovalList
                  data={pendingData}
                  gatheringId={gatheringId}
                  currentPage={pendingPage}
                  onPageChange={setPendingPage}
                />
              )
            )}
          </div>

          <Container className="max-lg:hidden">
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
                  {isPendingLoading || isPendingError ? (
                    <MeetingApprovalListSkeleton />
                  ) : (
                    pendingData && (
                      <MeetingApprovalList
                        data={pendingData}
                        gatheringId={gatheringId}
                        currentPage={pendingPage}
                        onPageChange={setPendingPage}
                      />
                    )
                  )}
                </TabsContent>
                <TabsContent value="CONFIRMED">
                  {isConfirmedLoading || isConfirmedError ? (
                    <MeetingApprovalListSkeleton />
                  ) : (
                    confirmedData && (
                      <MeetingApprovalList
                        data={confirmedData}
                        gatheringId={gatheringId}
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
      </div>
    </MobileLayoutFrame>
  )
}
