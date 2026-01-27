import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import BookInfo from '@/features/book/components/BookInfo'
import BookLogList from '@/features/book/components/BookLogList'
import { useBookDetail, useToggleBookReadingStatus } from '@/features/book/hooks'
import { TextButton } from '@/shared/ui/TextButton'

export default function BookDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const bookId = Number(id)

  const { data: bookDetail } = useBookDetail(bookId)
  const { mutate: toggleReadingStatus } = useToggleBookReadingStatus(bookId)

  const isRecording = bookDetail?.bookReadingStatus === 'READING'

  return (
    <>
      <nav aria-label="내 책장 페이지로 이동">
        <TextButton size={'medium'} icon={ChevronLeft} onClick={() => navigate('/books')}>
          내 책장
        </TextButton>
      </nav>
      <BookInfo
        bookId={bookId}
        isRecording={isRecording}
        onToggleRecording={() => toggleReadingStatus()}
      />
      <BookLogList bookId={bookId} isRecording={isRecording} />
    </>
  )
}
