import { formatToShortDate } from '@/shared/lib/date'
import { Chip } from '@/shared/ui/Chip'

import { StarRate } from '../../../shared/components/StarRate'
import type { BookReviewHistoryItem } from '../book.types'

type ReviewHistoryCardProps = {
  item: BookReviewHistoryItem
}

/**
 * 지난 평가 카드 컴포넌트
 *
 * @description 평가 히스토리 목록에서 개별 평가 항목을 표시합니다.
 *
 * @example
 * ```tsx
 * <ReviewHistoryCard item={historyItem} />
 * ```
 */
const ReviewHistoryCard = ({ item }: ReviewHistoryCardProps) => {
  return (
    <div className="py-large px-medium">
      <p className="text-grey-700 typo-subtitle3 mb-medium">
        {formatToShortDate(item.createdAt)} 작성
      </p>
      <div className="flex flex-col gap-small">
        <div>
          <p className="typo-subtitle3 text-grey-600 mb-tiny">별점</p>
          <div className="flex gap-xsmall items-center">
            <StarRate rating={item.rating} />
            <p className="subtitle3 text-grey-600">{item.rating.toFixed(1)}</p>
          </div>
        </div>
        <div>
          <p className="typo-subtitle3 text-grey-600 mb-tiny">책 키워드</p>
          <div className="flex gap-xsmall flex-wrap">
            {item.bookKeywords.map((keyword) => (
              <Chip key={keyword.id} variant={'success'}>
                {keyword.name}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="typo-subtitle3 text-grey-600 mb-tiny">감상 키워드</p>
          <div className="flex gap-xsmall flex-wrap">
            {item.impressionKeywords.map((keyword) => (
              <Chip key={keyword.id} className="bg-blue-100 text-blue-200">
                {keyword.name}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewHistoryCard
