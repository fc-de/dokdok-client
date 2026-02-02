import { useParams } from 'react-router-dom'

import ReviewHistoryCard from '@/features/book/components/ReviewHistoryCard'
import { useBookDetail } from '@/features/book/hooks'
import { useBookReviewHistory } from '@/features/book/hooks/useBookReviewHistory'
import { Division } from '@/shared/components/Division'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'

export default function BookReviewHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const bookId = Number(id)

  const { data: bookDetail } = useBookDetail(bookId)
  const { data: historyData, isLoading } = useBookReviewHistory(bookId)

  return (
    <>
      <SubPageHeader label={bookDetail?.title ?? '뒤로가기'} to={ROUTES.BOOK_DETAIL(bookId)} />
      <section className="py-base">
        <h2 className="typo-heading2 text-grey-800 mb-large">지난 평가</h2>
        {isLoading && <div className="mt-medium">로딩중...</div>}
        {historyData?.items.map((item, idx) => (
          <>
            <ReviewHistoryCard key={item.bookReviewHistoryId} item={item} />
            {historyData?.items.length !== idx + 1 && <Division />}
          </>
        ))}
        {!isLoading && historyData?.items.length === 0 && (
          <div className="mt-medium py-base flex justify-center">
            <p className="typo-subtitle2 text-grey-600 text-center">
              아직 이 책을 평가하지 않았어요. <br />다 읽고 나서 이 책이 어땠는지 알려주세요!
            </p>
          </div>
        )}
      </section>
    </>
  )
}
