import { MapPin } from 'lucide-react'
import { useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  TextButton,
} from '@/shared/ui'

import type { GetMeetingDetailResponse } from '../meetings.types'
import { MapModal } from './MapModal'

const MAX_DISPLAYED_AVATARS = 4
const LABEL_WIDTH = 'w-[68px]'

interface MeetingDetailInfoProps {
  meeting: GetMeetingDetailResponse
}

export function MeetingDetailInfo({ meeting }: MeetingDetailInfoProps) {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

  const host = meeting.participants.members.find((member) => member.role === 'HOST')
  const regularMembers = meeting.participants.members.filter((member) => member.role !== 'HOST')
  const displayedMembers = regularMembers.slice(0, MAX_DISPLAYED_AVATARS)
  const remainingMembers = regularMembers.slice(MAX_DISPLAYED_AVATARS)
  const hasRegularMembers = regularMembers.length > 0
  const hasRemainingMembers = remainingMembers.length > 0

  // displayDate를 시작/종료 시간으로 분리
  const [startDate, endDate] = meeting.schedule.displayDate.split(' ~ ')

  return (
    <div className="w-[300px] flex-none flex flex-col gap-base">
      <div className="flex flex-col gap-medium">
        {/* 도서 */}
        <dl className="flex gap-base">
          <dt className={`text-grey-600 typo-caption1 ${LABEL_WIDTH}`}>도서</dt>
          <dd className="flex flex-col gap-xtiny">
            <p className="text-black typo-body3">{meeting.book.bookName}</p>
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
          <dt className={`text-grey-600 ${LABEL_WIDTH}`}>참가인원</dt>
          <dd className="flex flex-col text-black typo-body3 gap-small">
            <p>
              {meeting.participants.currentCount}{' '}
              <span className="typo-cation2 text-grey-600">/{meeting.participants.maxCount}</span>
            </p>

            {/* 약속장 */}
            {host && (
              <div className="flex items-center gap-small">
                <p>약속장</p>
                <Avatar variant="host">
                  <AvatarImage src={host.profileImageUrl} alt={host.nickname} />
                  <AvatarFallback>장</AvatarFallback>
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
                    </Avatar>
                  ))}
                  {hasRemainingMembers && (
                    <AvatarGroupCount
                      items={remainingMembers.map((member) => ({
                        id: String(member.userId),
                        name: member.nickname,
                        src: member.profileImageUrl,
                      }))}
                      preview={{
                        name: remainingMembers[0].nickname,
                        src: remainingMembers[0].profileImageUrl,
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
          <dt className={`text-grey-600 typo-caption1 ${LABEL_WIDTH}`}>날짜 및 시간</dt>
          <dd className="text-black typo-body3">
            <p>{startDate}</p>
            <p>~ {endDate}</p>
          </dd>
        </dl>

        {/* 장소 */}
        {meeting.location && (
          <dl className="flex gap-base">
            <dt className={`text-grey-600 typo-caption1 ${LABEL_WIDTH}`}>장소</dt>
            <dd>
              <TextButton
                size="medium"
                icon={MapPin}
                className="text-black typo-body3 [&_svg]:text-grey-600"
                onClick={() => setIsMapModalOpen(true)}
              >
                {meeting.location.name}
              </TextButton>
            </dd>
          </dl>
        )}
      </div>

      {/* 지도 모달 */}
      {meeting.location && (
        <MapModal
          open={isMapModalOpen}
          onOpenChange={setIsMapModalOpen}
          locationName={meeting.location.name}
        />
      )}
    </div>
  )
}
