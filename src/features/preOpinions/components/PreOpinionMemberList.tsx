import { UserChip } from '@/shared/ui/UserChip'

import { ROLE_TO_AVATAR_VARIANT } from '../preOpinions.constants'
import type { PreOpinionMember } from '../preOpinions.types'

type PreOpinionMemberListProps = {
  members: PreOpinionMember[]
  selectedMemberId: number | null
  onSelectMember: (memberId: number) => void
}

/**
 * 사전 의견 멤버 리스트
 *
 * @description
 * 사전 의견을 작성한/작성하지 않은 멤버들을 UserChip 형태로 표시합니다.
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
}: PreOpinionMemberListProps) {
  return (
    <div className="flex flex-col gap-xsmall">
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
