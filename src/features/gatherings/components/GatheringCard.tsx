import { Star } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

import type { GatheringListItem } from '../gatherings.types'

interface GatheringCardProps {
  gathering: GatheringListItem
  onFavoriteToggle: (gatheringId: number) => void
  onClick: () => void
}

export default function GatheringCard({
  gathering,
  onFavoriteToggle,
  onClick,
}: GatheringCardProps) {
  const {
    gatheringId,
    gatheringName,
    isFavorite,
    totalMembers,
    totalMeetings,
    currentUserRole,
    daysFromJoined,
  } = gathering

  const isLeader = currentUserRole === 'LEADER'

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavoriteToggle(gatheringId)
  }

  return (
    <div
      className="relative flex h-35 cursor-pointer flex-col justify-between rounded-base border border-grey-300 bg-white p-medium transition-colors hover:border-grey-400"
      onClick={onClick}
    >
      {/* 상단 영역: 배지 + 모임 이름 */}
      <div className="flex flex-col gap-xsmall">
        {isLeader && (
          <span className="w-fit rounded-tiny bg-primary-150 px-xsmall py-xtiny text-primary-400 typo-body5">
            모임장
          </span>
        )}
        <p className="typo-subtitle2 text-black line-clamp-1">{gatheringName}</p>
      </div>

      {/* 하단 영역: 메타 정보 */}
      <div className="flex items-center gap-small text-grey-600 typo-body4">
        <span>멤버 {totalMembers}명</span>
        <span className="h-3 w-px bg-grey-400" />
        <span>시작한지 {daysFromJoined}일</span>
        <span className="h-3 w-px bg-grey-400" />
        <span>약속 {totalMeetings}회</span>
      </div>

      {/* 즐겨찾기 버튼 */}
      <button
        type="button"
        className="absolute right-medium top-medium p-1 cursor-pointer"
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      >
        <Star
          className={cn(
            'size-6',
            isFavorite ? 'fill-yellow-200 text-yellow-200' : 'fill-none text-grey-400'
          )}
        />
      </button>
    </div>
  )
}
