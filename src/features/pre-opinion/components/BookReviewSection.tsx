import {
  BookReviewForm,
  type BookReviewFormValues,
} from '@/features/book/components/BookReviewForm'
import { useBookReview } from '@/features/book/hooks'
import { Container } from '@/shared/ui'

/**
 * 사전 의견 작성 페이지의 책 평가 섹션
 *
 * @description 기존 평가가 있으면 해당 데이터를 채워서 보여주고,
 * 없으면 빈 폼을 보여줘서 사용자가 평가를 남길 수 있게 합니다.
 * 제출은 상위 페이지에서 일괄 처리합니다.
 *
 * @example
 * ```tsx
 * <BookReviewSection bookId={1} onChange={(values) => setReviewValues(values)} />
 * ```
 */
interface BookReviewSectionProps {
  bookId: number
  onChange?: (values: BookReviewFormValues) => void
}

const BookReviewSection = ({ bookId, onChange }: BookReviewSectionProps) => {
  const { data: review, isLoading } = useBookReview(bookId)

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg p-large">
        <h3 className="typo-subtitle1 mb-medium">책 평가</h3>
        <div className="flex items-center justify-center py-xlarge">
          <p className="typo-body2 text-grey-600">로딩 중...</p>
        </div>
      </section>
    )
  }

  return (
    <Container className="gap-small">
      <Container.Title
        infoMessage={
          review
            ? '내 책장의 기록을 자동으로 불러왔어요. 여기서 수정하는 내용은 내 책장에도 똑같이 반영돼요!'
            : ''
        }
        className="typo-subtitle3 pl-xxtiny"
      >
        이 책은 어떠셨나요?
      </Container.Title>
      <Container.Content>
        <BookReviewForm
          initialRating={review?.rating ?? 0}
          initialKeywordIds={review?.keywords.map((k) => k.id) ?? []}
          onChange={onChange}
        />
      </Container.Content>
    </Container>
  )
}

export default BookReviewSection
