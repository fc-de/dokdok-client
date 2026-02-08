import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserProfile } from '@/features/user'
import { PAGE_SIZES, ROUTES } from '@/shared/constants'
import { Button, Pagination, Tabs, TabsList, TabsTrigger } from '@/shared/ui'

import type { GatheringUserRole, MeetingFilter } from '../gatherings.types'
import { useGatheringMeetings, useMeetingTabCounts } from '../hooks'
import { getMeetingDisplayStatus, sortMeetings } from '../lib/meetingStatus'
import EmptyState from './EmptyState'
import GatheringMeetingCard from './GatheringMeetingCard'

interface GatheringMeetingSectionProps {
  gatheringId: number
  currentUserRole: GatheringUserRole
}

/** 탭 필터 목록 */
const TAB_FILTERS: MeetingFilter[] = ['ALL', 'UPCOMING', 'DONE', 'JOINED']

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
  const [activeTab, setActiveTab] = useState<MeetingFilter>('ALL')
  const [currentPage, setCurrentPage] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const isLeader = currentUserRole === 'LEADER'

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

  // 정렬 후 진행 중 약속을 상단에 배치
  const sortedMeetings = sortMeetings(meetings)
  const displayMeetings = sortedMeetings.sort((a, b) => {
    const statusA = getMeetingDisplayStatus(a.startDateTime, a.endDateTime)
    const statusB = getMeetingDisplayStatus(b.startDateTime, b.endDateTime)
    // 진행 중인 약속을 맨 앞으로
    if (statusA === 'IN_PROGRESS' && statusB !== 'IN_PROGRESS') return -1
    if (statusA !== 'IN_PROGRESS' && statusB === 'IN_PROGRESS') return 1
    return 0
  })

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
    <section ref={sectionRef} className="flex flex-col gap-medium">
      {/* 섹션 헤더: 약속 + 탭들 + 버튼들 (한 줄) */}
      <div className="flex items-center justify-between h-9">
        <div className="flex items-center gap-large">
          {/* 섹션 제목 */}
          <h2 className="typo-heading3 text-black">약속</h2>

          {/* 탭들 */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as MeetingFilter)}
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

        {/* 버튼들 (모임장만) */}
        {isLeader && (
          <div className="flex items-center gap-xsmall">
            <Button variant="secondary" outline size="small" onClick={handleMeetingSettings}>
              약속 설정
            </Button>
            <Button size="small" onClick={handleCreateMeeting}>
              약속 만들기
            </Button>
          </div>
        )}
      </div>

      {/* 약속 목록 */}
      {isLoading ? (
        <div className="py-xlarge text-center text-grey-600 typo-body3">로딩 중...</div>
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
