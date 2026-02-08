import { Link2, Settings, Star } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { TextButton } from '@/shared/ui'

import type { GatheringUserRole } from '../gatherings.types'

interface GatheringDetailHeaderProps {
  gatheringName: string
  isFavorite: boolean
  currentUserRole: GatheringUserRole
  /** 스크롤되어 헤더가 고정된 상태인지 */
  isSticky?: boolean
  onFavoriteToggle: () => void
  onSettingsClick: () => void
  onInviteClick: () => void
}

export default function GatheringDetailHeader({
  gatheringName,
  isFavorite,
  currentUserRole,
  isSticky = false,
  onFavoriteToggle,
  onSettingsClick,
  onInviteClick,
}: GatheringDetailHeaderProps) {
  const isLeader = currentUserRole === 'LEADER'

  return (
    <header
      className={cn(
        'sticky top-gnb-height z-10 bg-white pt-xlarge pb-medium transition-shadow',
        isSticky && 'shadow-drop-bottom'
      )}
    >
      <div className="mx-auto max-w-layout-max px-layout-padding flex items-center justify-between">
        {/* 좌측: 모임명 + 즐겨찾기 */}
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-black typo-heading2 line-clamp-1">{gatheringName}</h1>
          <button
            type="button"
            onClick={onFavoriteToggle}
            className="p-1 cursor-pointer shrink-0"
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

        {/* 우측: 설정/초대링크 버튼 */}
        <div className="flex items-center gap-4">
          {/* 모임장 전용 - 설정 버튼 */}
          {isLeader && (
            <TextButton size="medium" icon={Settings} onClick={onSettingsClick}>
              설정
            </TextButton>
          )}
          {/* 초대링크 버튼 */}
          <TextButton size="medium" icon={Link2} onClick={onInviteClick}>
            초대링크
          </TextButton>
        </div>
      </div>
    </header>
  )
}
