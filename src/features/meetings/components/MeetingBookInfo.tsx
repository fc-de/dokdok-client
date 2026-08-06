import type { GetMeetingDetailResponse } from '../meetings.types'

interface MeetingBookInfoProps {
  book: GetMeetingDetailResponse['book']
}

export default function MeetingBookInfo({ book }: MeetingBookInfoProps) {
  return (
    <div className="relative w-75 h-75 rounded-small overflow-hidden bg-grey-200 flex items-center justify-center">
      <img
        src={book.thumbnail}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-125 blur-[82px] opacity-50"
      />
      <div className="relative flex w-full flex-col items-center justify-center gap-base px-large">
        <div className="w-[100px] h-[171px] overflow-hidden shrink-0 drop-shadow">
          <img
            src={book.thumbnail}
            alt={book.bookName}
            className="object-fill w-full h-full drop-shadow-xl"
          />
        </div>
        <div className="w-full text-center">
          <p className="text-black typo-m-heading3 truncate" title={book.bookName}>
            {book.bookName}
          </p>
          <p className="typo-caption1 text-grey-700 mt-xxtiny">{book.authors}</p>
        </div>
      </div>
    </div>
  )
}
