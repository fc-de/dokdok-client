import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'

import type { GetMeetingDetailResponse } from '../meetings.types'

interface MeetingParticipantsProps {
  participants: GetMeetingDetailResponse['participants']
}

export default function MeetingParticipants({ participants }: MeetingParticipantsProps) {
  return (
    <div className="flex flex-col gap-base pb-xsmall max-lg:pb-large">
      <p className="text-black typo-body3">
        참가인원{' '}
        <span className="text-grey-600">
          {participants.currentCount}/{participants.maxCount}
        </span>
      </p>

      <div className="grid grid-cols-2 gap-y-small">
        {participants.members.map((member) => (
          <div key={member.userId} className="flex items-center gap-small min-w-0">
            <Avatar title={member.nickname}>
              <AvatarImage src={member.profileImageUrl} alt={member.nickname} />
              <AvatarFallback>{member.nickname[0]}</AvatarFallback>
            </Avatar>
            <p className="text-black typo-body3 truncate min-w-0" title={member.nickname}>
              {member.nickname}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
