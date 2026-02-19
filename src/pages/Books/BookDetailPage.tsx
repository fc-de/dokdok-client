import { useParams } from 'react-router-dom'

import BookInfo from '@/features/book/components/BookInfo'
import BookLogList from '@/features/book/components/BookLogList'
import { useBookDetail, useToggleBookReadingStatus } from '@/features/book/hooks'
import SubPageHeader from '@/shared/components/SubPageHeader'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const bookId = Number(id)

  const { data: bookDetail } = useBookDetail(bookId)
  const { mutate: toggleReadingStatus } = useToggleBookReadingStatus(bookId)

  const isRecording = bookDetail?.bookReadingStatus === 'READING'

  return (
    <>
      <SubPageHeader label="내 책장" to="/books" />
      <div className="mx-auto max-w-layout-max px-layout-padding">
        <BookInfo
          bookId={bookId}
          isRecording={isRecording}
          onToggleRecording={() => toggleReadingStatus()}
        />
      </div>
      <BookLogList bookId={bookId} isRecording={isRecording} />
    </>
  )
}
