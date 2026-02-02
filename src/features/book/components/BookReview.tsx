import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'
import { formatToShortDate } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { TextButton } from '@/shared/ui/TextButton'

import { StarRate } from '../../../shared/components/StarRate'
import { useBookReview } from '../hooks'

type BookReviewProps = {
  bookId: number
}

const BookReview = ({ bookId }: BookReviewProps) => {
  const navigate = useNavigate()
  const { data, isLoading } = useBookReview(bookId)

  //   if (isLoading) return <BookInfoSkeleton />
  if (isLoading) return <div>로딩중...</div>

  return (
    <section className="py-large">
      <div className="flex justify-between">
        <h3 className="typo-subtitle1">이 책에 대한 내 평가</h3>
        <div className="flex gap-small items-center">
          {data && (
            <TextButton onClick={() => navigate(ROUTES.BOOK_REVIEW_HISTORY(bookId))}>
              지난 평가
            </TextButton>
          )}
          <Button variant={'secondary'} outline>
            평가하기
          </Button>
        </div>
      </div>
      {data ? (
        <div className="mt-xxtiny">
          <p className="text-grey-500 typo-caption1 mb-medium">
            {formatToShortDate(data.createdAt)} 작성
          </p>
          <div className="flex flex-col gap-small">
            <div>
              <p className="typo-subtitle3 text-grey-600 mb-tiny">별점</p>
              <div className="flex gap-xsmall items-center">
                <StarRate rating={data.rating} />
                <p className="subtitle3 text-grey-600">{data.rating.toFixed(1)}</p>
              </div>
            </div>
            <div>
              <p className="typo-subtitle3 text-grey-600 mb-tiny">책 키워드</p>
              <div className="flex gap-xsmall flex-wrap">
                {data.keywords
                  .filter((k) => k.type === 'BOOK')
                  .map((keyword) => (
                    <Chip key={keyword.id} variant={'success'}>
                      {keyword.name}
                    </Chip>
                  ))}
              </div>
            </div>
            <div>
              <p className="typo-subtitle3 text-grey-600 mb-tiny">감상 키워드</p>
              <div className="flex gap-xsmall flex-wrap">
                {data.keywords
                  .filter((k) => k.type === 'IMPRESSION')
                  .map((keyword) => (
                    <Chip key={keyword.id} className="bg-blue-100 text-blue-200">
                      {keyword.name}
                    </Chip>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-base">
          <p className="typo-subtitle2 text-grey-600 text-center">
            아직 이 책을 평가하지 않았어요. <br />다 읽고 나서 이 책이 어땠는지 알려주세요!
          </p>
        </div>
      )}
    </section>
  )
}

export default BookReview
