import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useUserProfile } from '@/features/user'
import { PAGE_SIZES, ROUTES } from '@/shared/constants'
import {
  Button,
  Pagination,
  Spinner,
  Tabs,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui'

import type { GatheringUserRole, MeetingFilter } from '../gatherings.types'
import { useGatheringMeetings, useMeetingTabCounts } from '../hooks'
import { sortMeetings } from '../lib/meetingStatus'
import EmptyState from './EmptyState'
import GatheringMeetingCard from './GatheringMeetingCard'

interface GatheringMeetingSectionProps {
  gatheringId: number
  currentUserRole: GatheringUserRole
}

/** 탭 필터 목록 */
const TAB_FILTERS: MeetingFilter[] = ['ALL', 'UPCOMING', 'DONE', 'JOINED']

/** 모바일에서 약속 설정/만들기 버튼을 전체 폭으로 균등 분할 */
const MOBILE_MEETING_BUTTON = 'max-lg:h-12 max-lg:flex-1 max-lg:typo-m-subtitle1'

const FILTER_LABELS: Record<MeetingFilter, string> = {
  ALL: '전체 약속',
  UPCOMING: '예정된 약속',
  DONE: '종료한 약속',
  JOINED: '내가 참여한 약속',
}

export default function GatheringMeetingSection({
  gatheringId,
  currentUserRole,
}: GatheringMeetingSectionProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<MeetingFilter>('ALL')
  const [currentPage, setCurrentPage] = useState(0)
  const [showCreateTooltip, setShowCreateTooltip] = useState(
    () => location.state?.justCreated === true
  )

  const isLeader = currentUserRole === 'LEADER'

  // 모임 생성 직후 state를 소비한 뒤 히스토리에서 제거 (새로고침 시 재표시 방지)
  useEffect(() => {
    if (location.state?.justCreated) {
      window.history.replaceState({}, '')
    }
  }, [location.state])

  // 현재 사용자 정보
  const { data: currentUser } = useUserProfile()
  const currentUserNickname = currentUser?.nickname ?? ''

  // 탭별 카운트 조회 (서버 API)
  const { data: tabCounts } = useMeetingTabCounts(gatheringId)

  // 약속 목록 조회 (서버 페이지네이션)
  const { data, isLoading } = useGatheringMeetings({
    gatheringId,
    filter: activeTab,
    page: currentPage,
    size: PAGE_SIZES.GATHERING_MEETINGS,
  })

  // 서버에서 받은 데이터
  const meetings = data?.items ?? []
  const totalPages = data?.totalPages ?? 0
  const totalCount = data?.totalCount ?? 0

  // 정렬: 진행 중 → 예정 → 종료 (sortMeetings에서 처리)
  const displayMeetings = sortMeetings(meetings)

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (filter: MeetingFilter) => {
    setActiveTab(filter)
    setCurrentPage(0)
  }

  // 약속 설정 버튼 핸들러
  const handleMeetingSettings = () => {
    navigate(ROUTES.MEETING_SETTING(gatheringId))
  }

  // 약속 만들기 버튼 핸들러
  const handleCreateMeeting = () => {
    navigate(ROUTES.MEETING_CREATE(gatheringId))
  }

  // 탭별 카운트 (서버 데이터 또는 0)
  const getTabCount = (filter: MeetingFilter): number => {
    if (!tabCounts) return 0
    switch (filter) {
      case 'ALL':
        return tabCounts.all
      case 'UPCOMING':
        return tabCounts.upcoming
      case 'DONE':
        return tabCounts.done
      case 'JOINED':
        return tabCounts.joined
    }
  }

  return (
    <section className="flex flex-col gap-medium max-lg:gap-base">
      {/* 섹션 헤더: 약속 + 탭들 + 버튼들 (한 줄) */}
      {/* 모바일은 버튼 → 제목 → 탭 순으로 세로 배치 */}
      <div className="flex items-center justify-between h-9 max-lg:h-auto max-lg:flex-col max-lg:items-stretch max-lg:gap-8">
        <div className="flex items-center gap-large max-lg:flex-col max-lg:items-start max-lg:gap-xsmall">
          {/* 섹션 제목 */}
          <h2 className="typo-heading3 text-black max-lg:typo-m-heading3">약속</h2>

          {/* 탭들 (모바일은 화면 끝까지 가로 스크롤) */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as MeetingFilter)}
            className="max-lg:w-full max-lg:-mr-5 max-lg:overflow-x-auto max-lg:pr-5 max-lg:scrollbar-hide"
          >
            <TabsList size="large">
              {TAB_FILTERS.map((filter) => (
                <TabsTrigger
                  key={filter}
                  value={filter}
                  badge={getTabCount(filter)}
                  className="typo-subtitle3"
                >
                  {FILTER_LABELS[filter]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* 버튼들 (모바일은 섹션 최상단에서 전체 폭 2분할) */}
        <div className="flex items-center gap-xsmall max-lg:order-first max-lg:gap-small">
          {/* 약속 설정: 모임장만 */}
          {isLeader && (
            <Button
              variant="secondary"
              outline
              size="small"
              onClick={handleMeetingSettings}
              className={MOBILE_MEETING_BUTTON}
            >
              약속 설정
            </Button>
          )}
          {/* 약속 만들기: 모든 멤버 */}
          {showCreateTooltip ? (
            <Tooltip dismissable onOpenChange={(open) => !open && setShowCreateTooltip(false)}>
              <TooltipTrigger asChild>
                <Button
                  size="small"
                  onClick={handleCreateMeeting}
                  className={MOBILE_MEETING_BUTTON}
                >
                  약속 만들기
                </Button>
              </TooltipTrigger>
              <TooltipContent>약속을 만들어 함께 책을 읽어보세요!</TooltipContent>
            </Tooltip>
          ) : (
            <Button size="small" onClick={handleCreateMeeting} className={MOBILE_MEETING_BUTTON}>
              약속 만들기
            </Button>
          )}
        </div>
      </div>

      {/* 약속 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : totalCount === 0 ? (
        <EmptyState type="meetings" />
      ) : (
        <div className="flex flex-col gap-xsmall">
          {displayMeetings.map((meeting) => (
            <GatheringMeetingCard
              key={meeting.meetingId}
              meeting={meeting}
              gatheringId={gatheringId}
              isHost={meeting.meetingLeaderName === currentUserNickname}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollTop={false}
        />
      )}
    </section>
  )
}
