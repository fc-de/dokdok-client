import { MapPin } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  TextButton,
} from '@/shared/ui'

import type { GetMeetingDetailResponse } from '../meetings.types'

const MAX_DISPLAYED_AVATARS = 4
const DT_VARIANTS = 'w-[68px] text-grey-600 typo-caption1'

interface MeetingDetailInfoProps {
  meeting: GetMeetingDetailResponse
}

export function MeetingDetailInfo({ meeting }: MeetingDetailInfoProps) {
  const leader = meeting.participants.members.find((member) => member.role === 'LEADER')
  const members = meeting.participants.members.filter((member) => member.role === 'MEMBER')
  const displayedMembers = members.slice(0, MAX_DISPLAYED_AVATARS)
  const remainingMembers = members.slice(MAX_DISPLAYED_AVATARS)
  const hasRegularMembers = members.length > 0
  const hasRemainingMembers = remainingMembers.length > 0

  const [startDate, endDate] = meeting.schedule.displayDate.split(' ~ ')

  const location = meeting.location

  return (
    <div className="w-[300px] flex-none flex flex-col gap-base">
      <div className="flex flex-col gap-medium">
        {/* 도서 */}
        <dl className="flex gap-base">
          <dt className={DT_VARIANTS}>도서</dt>
          <dd className="flex flex-col gap-tiny">
            <div className="flex flex-col gap-xtiny">
              <p className="text-black typo-body3">{meeting.book.bookName}</p>
              <p className="typo-caption1 text-grey-700">{meeting.book.authors}</p>
            </div>
            <div className="w-[120px] h-[170px] overflow-hidden rounded">
              <img
                src={meeting.book.thumbnail}
                alt={meeting.book.bookName}
                className="object-cover w-full h-full"
              />
            </div>
          </dd>
        </dl>

        {/* 참가인원 */}
        <dl className="flex gap-base">
          <dt className={DT_VARIANTS}>참가인원</dt>
          <dd className="flex flex-col text-black typo-body3 gap-small">
            <p>
              {meeting.participants.currentCount}{' '}
              <span className="typo-caption2 text-grey-600">/{meeting.participants.maxCount}</span>
            </p>

            {/* 약속장 */}
            {leader && (
              <div className="flex items-center gap-small">
                <p>약속장</p>
                <Avatar variant="host">
                  <AvatarImage src={leader.profileImageUrl} alt={leader.nickname} />
                  <AvatarFallback>{leader.nickname[0]}</AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* 멤버 */}
            {hasRegularMembers && (
              <div className="flex items-center gap-small">
                <p>멤버</p>
                <AvatarGroup>
                  {displayedMembers.map((member) => (
                    <Avatar key={member.userId}>
                      <AvatarImage src={member.profileImageUrl} alt={member.nickname} />
                      <AvatarFallback>{member.nickname[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {hasRemainingMembers && (
                    <AvatarGroupCount
                      items={remainingMembers.map((member) => ({
                        id: String(member.userId),
                        name: member.nickname,
                        src: member.profileImageUrl,
                        fallbackText: member.nickname[0],
                      }))}
                      preview={{
                        name: remainingMembers[0].nickname,
                        src: remainingMembers[0].profileImageUrl,
                        fallbackText: remainingMembers[0].nickname[0],
                      }}
                    >
                      +{remainingMembers.length}
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>
              </div>
            )}
          </dd>
        </dl>

        {/* 날짜 및 시간 */}
        <dl className="flex gap-base">
          <dt className={DT_VARIANTS}>날짜 및 시간</dt>
          <dd className="text-black typo-body3">
            <p>{startDate}</p>
            <p>~ {endDate}</p>
          </dd>
        </dl>

        {/* 장소 */}
        <dl className="flex gap-base">
          <dt className={DT_VARIANTS}>장소</dt>
          <dd>
            {location && (
              <TextButton
                size="medium"
                icon={MapPin}
                className="text-black typo-body3 [&_svg]:text-grey-600"
                onClick={() => {
                  window.open(
                    `https://map.kakao.com/link/map/${location.name},${location.latitude},${location.longitude}`,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }}
              >
                {location.name}
              </TextButton>
            )}
          </dd>
        </dl>
      </div>
    </div>
  )
}
