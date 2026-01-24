import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import BookInfo from '@/features/book/components/BookInfo'
import BookLogList from '@/features/book/components/BookLogList'
import { TextButton } from '@/shared/ui/TextButton'

export default function BookDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const bookId = Number(id)

  return (
    <>
      <nav aria-label="이전 페이지로 이동">
        <TextButton size={'medium'} icon={ChevronLeft} onClick={() => navigate('/books')}>
          내 책장
        </TextButton>
      </nav>
      <BookInfo bookId={bookId} />
      <BookLogList bookId={bookId} />
    </>
  )
}
