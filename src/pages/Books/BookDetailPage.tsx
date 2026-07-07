import { useParams } from 'react-router-dom'

import BookInfo from '@/features/book/components/BookInfo'
import BookLogList from '@/features/book/components/BookLogList'
import {
  useBookDetail,
  useDeleteBookAction,
  useToggleBookReadingStatus,
} from '@/features/book/hooks'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants/routes'
import { useScrollCollapse } from '@/shared/hooks'
import { MobileLayoutFrame } from '@/shared/layout'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const bookId = Number(id)

  const { data: bookDetail } = useBookDetail(bookId)
  const { deleteBooks, isDeleting } = useDeleteBookAction()
  const { mutate: toggleReadingStatus } = useToggleBookReadingStatus(
    bookId,
    bookDetail?.personalBookId ?? 0
  )

  const isRecording = bookDetail?.bookReadingStatus === 'READING'
  const isBookLogSticky = useScrollCollapse({ collapseThreshold: 500, expandThreshold: 100 })

  const handleDelete = async () => {
    if (!bookDetail || isDeleting) return

    await deleteBooks([bookDetail.bookId])
  }

  return (
    <MobileLayoutFrame
      variant="content"
      title={bookDetail?.title ?? '도서 상세'}
      backTo={ROUTES.BOOKS}
      headerAction={{
        label: '삭제',
        onClick: () => handleDelete(),
        disabled: !bookDetail || isDeleting,
      }}
    >
      <SubPageHeader
        label="내 책장"
        to={ROUTES.BOOKS}
        disableShadow={isBookLogSticky}
        className="max-lg:hidden"
      />
      <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-0">
        <BookInfo
          bookId={bookId}
          isRecording={isRecording}
          onToggleRecording={() => toggleReadingStatus()}
        />
      </div>
      <BookLogList personalBookId={bookDetail?.personalBookId ?? 0} isRecording={isRecording} />
    </MobileLayoutFrame>
  )
}
