import { Link } from 'react-router-dom'

import type { BookMeetingProgressStatus } from '@/features/book'
import { MEETING_PROGRESS_STATUS_BADGE_COLOR, MEETING_PROGRESS_STATUS_LABEL } from '@/features/book'
import { ROUTES } from '@/shared/constants'
import { Badge } from '@/shared/ui'

interface HomeBookCardProps {
  bookId: number
  title: string
  authors: string
  thumbnail: string
  meetingProgressStatus: BookMeetingProgressStatus | null
}

export default function HomeBookCard({
  bookId,
  title,
  authors,
  thumbnail,
  meetingProgressStatus,
}: HomeBookCardProps) {
  return (
    <Link
      to={ROUTES.BOOK_DETAIL(bookId)}
      className="block w-45 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 max-lg:w-30"
    >
      {/* 썸네일 */}
      <div className="relative h-65 w-45 overflow-hidden rounded-small bg-grey-200 max-lg:h-45 max-lg:w-30">
        <img
          src={thumbnail}
          alt={`${title} 표지`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {meetingProgressStatus && (
          <Badge
            color={MEETING_PROGRESS_STATUS_BADGE_COLOR[meetingProgressStatus]}
            size="small"
            className="absolute top-2 left-2"
          >
            {MEETING_PROGRESS_STATUS_LABEL[meetingProgressStatus]}
          </Badge>
        )}
      </div>

      {/* 책 정보 */}
      <div className="mt-small flex flex-col gap-xtiny max-lg:mt-tiny">
        <h3 className="line-clamp-2 typo-subtitle2 text-black max-lg:typo-m-body3">{title}</h3>
        <p className="line-clamp-1 typo-caption1 text-grey-600 max-lg:typo-m-caption1">{authors}</p>
      </div>
    </Link>
  )
}
