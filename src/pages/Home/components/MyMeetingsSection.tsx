import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import { type MyMeetingFilter, useMyMeetings, useMyMeetingTabCounts } from '@/features/meetings'
import { useDeferredLoading } from '@/shared/hooks'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui'

import HomeMeetingCard from './HomeMeetingCard'
import HomeSectionHeader from './HomeSectionHeader'

export default function MyMeetingsSection() {
  const [activeTab, setActiveTab] = useState<MyMeetingFilter>('ALL')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { data: tabCounts } = useMyMeetingTabCounts()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMyMeetings(activeTab)
  const showSkeleton = useDeferredLoading(isLoading)

  const allItems = data?.pages.flatMap((page) => page.items) ?? []
  const hasMultiplePages = (data?.pages.length ?? 0) > 1
  const displayItems = isCollapsed ? allItems.slice(0, 4) : allItems

  const handleTabChange = (value: string) => {
    setActiveTab(value as MyMeetingFilter)
    setIsCollapsed(false)
  }

  const handleExpand = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
    setIsCollapsed(false)
  }

  const handleCollapse = () => {
    setIsCollapsed(true)
  }

  return (
    <section className="flex flex-col gap-medium">
      <HomeSectionHeader title="내 약속">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList size="large">
            <TabsTrigger value="ALL" badge={tabCounts?.all ?? 0}>
              전체
            </TabsTrigger>
            <TabsTrigger value="UPCOMING" badge={tabCounts?.upcoming ?? 0}>
              다가오는 약속
            </TabsTrigger>
            <TabsTrigger value="DONE" badge={tabCounts?.done ?? 0}>
              종료된 약속
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </HomeSectionHeader>

      {showSkeleton ? (
        <div className="flex flex-col">
          {[...Array(4).keys()].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-medium border-b border-grey-300 px-medium py-small last:border-b-0"
            >
              <div className="flex w-15 shrink-0 justify-center">
                <div className="h-6 w-10 rounded-tiny bg-grey-300" />
              </div>
              <div className="flex flex-1 flex-col gap-xtiny">
                <div className="h-5.5 w-2/3 rounded bg-grey-300" />
                <div className="h-5 w-1/2 rounded bg-grey-300" />
              </div>
            </div>
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <div className="flex h-24.5 items-center justify-center rounded-base border border-grey-300">
          <p className="text-grey-600 typo-subtitle2">참여 중인 약속이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* 약속 리스트 — 최대 높이 392px, 스크롤 */}
          <div className="max-h-98 overflow-y-auto overflow-x-hidden">
            {displayItems.map((meeting) => (
              <HomeMeetingCard key={meeting.meetingId} meeting={meeting} />
            ))}
            {isFetchingNextPage && (
              <div className="flex h-15 items-center justify-center">
                <p className="text-grey-600 typo-body3">불러오는 중...</p>
              </div>
            )}
          </div>

          {/* 펼치기 / 접기 버튼 */}
          {(hasNextPage || hasMultiplePages) && (
            <button
              type="button"
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-tiny rounded-small border border-grey-300 text-grey-700 typo-body3 hover:bg-grey-100"
              onClick={isCollapsed || hasNextPage ? handleExpand : handleCollapse}
            >
              {isCollapsed || hasNextPage ? (
                <>
                  펼치기 <ChevronDown className="size-4" />
                </>
              ) : (
                <>
                  접기 <ChevronUp className="size-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
