import { cn } from '@/shared/lib/utils'
import { UserChip } from '@/shared/ui/UserChip'

import { ROLE_TO_AVATAR_VARIANT } from '../preOpinion.constants'
import type { PreOpinionMember } from '../preOpinion.types'

type PreOpinionMemberListProps = {
  members: PreOpinionMember[]
  selectedMemberId: number | null
  onSelectMember: (memberId: number) => void
  /** 리스트 형태: "desktop"은 세로 카드 리스트, "mobile"은 가로 스크롤 아바타 리스트 */
  variant?: 'desktop' | 'mobile'
  className?: string
}

/**
 * 사전 의견 멤버 리스트
 *
 * @description
 * 사전 의견을 작성한/작성하지 않은 멤버들을 표시합니다.
 * "desktop" variant는 UserChip 카드 형태로 세로 나열되며,
 * "mobile" variant는 원형 아바타가 가로로 나열됩니다.
 * 사전 의견을 제출하지 않은 멤버는 disabled 상태로 표시됩니다.
 *
 * @example
 * ```tsx
 * <PreOpinionMemberList
 *   members={members}
 *   selectedMemberId={1}
 *   onSelectMember={(id) => setSelectedMemberId(id)}
 * />
 * ```
 */
function PreOpinionMemberList({
  members,
  selectedMemberId,
  onSelectMember,
  variant = 'desktop',
  className,
}: PreOpinionMemberListProps) {
  if (variant === 'mobile') {
    return (
      <div
        className={cn(
          'flex items-center gap-xsmall overflow-x-auto px-5 pt-3 pb-4.5 scrollbar-hide',
          className
        )}
      >
        {members.map((member) => (
          <UserChip
            key={member.memberInfo.userId}
            size="compact"
            name={member.memberInfo.nickname}
            imageUrl={member.memberInfo.profileImage}
            variant={ROLE_TO_AVATAR_VARIANT[member.memberInfo.role]}
            selected={selectedMemberId === member.memberInfo.userId}
            disabled={!member.isSubmitted}
            onClick={() => {
              if (member.isSubmitted) {
                onSelectMember(member.memberInfo.userId)
              }
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-xsmall', className)}>
      {members.map((member) => (
        <UserChip
          key={member.memberInfo.userId}
          name={member.memberInfo.nickname}
          imageUrl={member.memberInfo.profileImage}
          variant={ROLE_TO_AVATAR_VARIANT[member.memberInfo.role]}
          selected={selectedMemberId === member.memberInfo.userId}
          disabled={!member.isSubmitted}
          onClick={() => {
            if (member.isSubmitted) {
              onSelectMember(member.memberInfo.userId)
            }
          }}
        />
      ))}
    </div>
  )
}

export { PreOpinionMemberList }
