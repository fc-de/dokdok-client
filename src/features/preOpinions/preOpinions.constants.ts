import type { MemberRole } from './preOpinions.types'

/** API MemberRole → Avatar variant 매핑 */
export const ROLE_TO_AVATAR_VARIANT: Record<MemberRole, 'leader' | 'host' | 'member'> = {
  GATHERING_LEADER: 'leader',
  MEETING_LEADER: 'host',
  MEMBER: 'member',
}
