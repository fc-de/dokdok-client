import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@/shared/ui'

import type { GatheringMember } from '../gatherings.types'

interface GatheringDetailInfoProps {
  daysFromCreation: number
  totalMeetings: number
  totalMembers: number
  members: GatheringMember[]
  description: string | null
}

/** 멤버 아바타 그룹에 표시할 최대 인원 수 */
const MAX_VISIBLE_MEMBERS = 5

export default function GatheringDetailInfo({
  daysFromCreation,
  totalMeetings,
  totalMembers,
  members,
  description,
}: GatheringDetailInfoProps) {
  const leader = members.find((m) => m.role === 'LEADER')
  const otherMembers = members.filter((m) => m.role !== 'LEADER')
  const visibleMembers = otherMembers.slice(0, MAX_VISIBLE_MEMBERS)
  const remainingCount = totalMembers - 1 - visibleMembers.length

  return (
    <section className="flex flex-col gap-1.5 transition-all duration-300 max-lg:gap-small">
      {/* 첫 번째 줄: 통계 정보 (좌측) + 모임장 (우측) */}
      {/* 모바일은 contents로 풀어서 통계 → 설명 → 모임장/멤버 순으로 세로 배치 */}
      <div className="flex items-center justify-between max-lg:contents">
        {/* 통계 정보 */}
        <div className="flex items-center gap-3 text-grey-700 typo-subtitle2 max-lg:gap-xsmall max-lg:typo-m-body3">
          <span>시작한지 {daysFromCreation}일</span>
          <span className="h-3.5 w-px bg-grey-600" />
          <span>약속 {totalMeetings}회 진행</span>
          <span className="h-3.5 w-px bg-grey-600" />
          <span>총 구성원 {totalMembers}명</span>
        </div>

        {/* 모임장 + 멤버 그룹 (모바일은 설명 아래로) */}
        <div className="flex items-center gap-5 max-lg:order-last max-lg:gap-base">
          {/* 모임장 */}
          {leader && (
            <div className="flex items-center gap-2">
              <span className="text-grey-600 typo-body2 font-semibold">모임장</span>
              <Avatar variant="leader" size="default" title={leader.nickname}>
                <AvatarImage src={leader.profileImageUrl ?? undefined} alt={leader.nickname} />
                <AvatarFallback>{leader.nickname.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* 멤버 아바타 그룹 (멤버가 있을 때만) */}
          {otherMembers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-grey-600 typo-body2 font-semibold">멤버</span>
              <AvatarGroup>
                {visibleMembers.map((member) => (
                  <Avatar key={member.gatheringMemberId} size="default" title={member.nickname}>
                    <AvatarImage src={member.profileImageUrl ?? undefined} alt={member.nickname} />
                    <AvatarFallback>{member.nickname.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                ))}
                {remainingCount > 0 && (
                  <AvatarGroupCount
                    items={otherMembers.slice(MAX_VISIBLE_MEMBERS).map((m) => ({
                      id: String(m.gatheringMemberId),
                      name: m.nickname,
                      src: m.profileImageUrl ?? undefined,
                    }))}
                    preview={
                      otherMembers[MAX_VISIBLE_MEMBERS]
                        ? {
                            name: otherMembers[MAX_VISIBLE_MEMBERS].nickname,
                            src: otherMembers[MAX_VISIBLE_MEMBERS].profileImageUrl ?? undefined,
                          }
                        : undefined
                    }
                  >
                    +{remainingCount}
                  </AvatarGroupCount>
                )}
              </AvatarGroup>
            </div>
          )}
        </div>
      </div>

      {/* 두 번째 줄: 모임 설명 */}
      {description && (
        <p className="text-grey-600 typo-body1 max-w-146.75 whitespace-pre-wrap max-lg:max-w-none max-lg:typo-m-body1">
          {description}
        </p>
      )}
    </section>
  )
}
