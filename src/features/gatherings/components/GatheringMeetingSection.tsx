import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserProfile } from '@/features/user'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui/Button'
import { Pagination } from '@/shared/ui/Pagination'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/Tabs'

import type { GatheringMeetingItem, GatheringUserRole, MeetingFilter } from '../gatherings.types'
import { useGatheringMeetings } from '../hooks/useGatheringMeetings'
import { useMeetingTabCounts } from '../hooks/useMeetingTabCounts'
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

/** 페이지당 표시할 약속 수 */
const ITEMS_PER_PAGE = 4

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

  // 약속 목록 조회
  const { data, isLoading } = useGatheringMeetings({
    gatheringId,
    filter: activeTab,
  })

  const rawMeetings = useMemo(() => data?.items ?? [], [data?.items])

  // 정렬된 약속 목록
  const allMeetings = useMemo(() => sortMeetings(rawMeetings), [rawMeetings])

  // 약속 중인 약속은 페이지 상관 없이 항상 상단에 고정
  const { ongoingMeetings, otherMeetings } = useMemo(() => {
    const ongoing: GatheringMeetingItem[] = []
    const others: GatheringMeetingItem[] = []

    allMeetings.forEach((meeting) => {
      const status = getMeetingDisplayStatus(meeting.startDateTime, meeting.endDateTime)
      if (status === 'IN_PROGRESS') {
        ongoing.push(meeting)
      } else {
        others.push(meeting)
      }
    })

    return { ongoingMeetings: ongoing, otherMeetings: others }
  }, [allMeetings])

  // 페이지네이션 계산 (약속 중 제외한 목록만 페이지네이션)
  const totalPages = Math.ceil(otherMeetings.length / ITEMS_PER_PAGE)
  const paginatedMeetings = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE
    return otherMeetings.slice(start, start + ITEMS_PER_PAGE)
  }, [otherMeetings, currentPage])

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
      ) : allMeetings.length === 0 ? (
        <EmptyState type="meetings" />
      ) : (
        <div className="flex flex-col gap-xsmall">
          {/* 약속 중인 약속 - 항상 상단에 고정 */}
          {ongoingMeetings.map((meeting) => (
            <GatheringMeetingCard
              key={meeting.meetingId}
              meeting={meeting}
              gatheringId={gatheringId}
              isHost={meeting.meetingLeaderName === currentUserNickname}
            />
          ))}
          {/* 예정/종료 약속 - 페이지네이션 적용 */}
          {paginatedMeetings.map((meeting) => (
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
