import { Button } from '@/shared/ui/Button'

import type { GatheringMember } from '../gatherings.types'

type MemberCardAction = 'approve' | 'reject' | 'remove'

interface MemberCardProps {
  member: GatheringMember
  /** 표시할 날짜 문자열 (YY.MM.DD) */
  dateLabel?: string
  /** 표시할 액션 버튼 목록 */
  actions: MemberCardAction[]
  /** 액션 버튼 클릭 핸들러 */
  onAction: (action: MemberCardAction, member: GatheringMember) => void
  /** 버튼 비활성화 여부 */
  disabled?: boolean
}

export default function MemberCard({
  member,
  dateLabel,
  actions,
  onAction,
  disabled,
}: MemberCardProps) {
  return (
    <div className="flex items-center justify-between rounded-base border border-grey-300 p-base">
      <div className="flex items-center gap-small">
        {member.profileImageUrl ? (
          <img
            src={member.profileImageUrl}
            alt={member.nickname}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-grey-400 text-white typo-body2">
            {member.nickname.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="typo-subtitle5 text-black">{member.nickname}</span>
          {dateLabel && <span className="typo-body4 text-grey-600">{dateLabel}</span>}
        </div>
      </div>
      <div className="flex items-center gap-xsmall">
        {actions.includes('reject') && (
          <Button
            variant="secondary"
            outline
            size="small"
            disabled={disabled}
            onClick={() => onAction('reject', member)}
          >
            거절
          </Button>
        )}
        {actions.includes('approve') && (
          <Button
            variant="primary"
            size="small"
            disabled={disabled}
            onClick={() => onAction('approve', member)}
          >
            승인
          </Button>
        )}
        {actions.includes('remove') && (
          <Button
            variant="danger"
            outline
            size="small"
            disabled={disabled}
            onClick={() => onAction('remove', member)}
          >
            삭제
          </Button>
        )}
      </div>
    </div>
  )
}
