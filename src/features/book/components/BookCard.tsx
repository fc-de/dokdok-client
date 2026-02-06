import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/shared/ui'

import type { BookListItem } from '../book.types'

type BookCardProps = {
  book: BookListItem
  /** 필터에서 선택된 모임명 (일치하는 Badge는 green으로 표시) */
  selectedGatheringName?: string
}

/**
 * 책 카드 컴포넌트
 *
 * 책 목록에서 개별 책을 표시하는 카드입니다.
 * 썸네일, 제목, 저자, 별점, 소속 모임을 표시합니다.
 *
 * @example
 * ```tsx
 * <BookCard book={bookData} />
 * ```
 */
function BookCard({ book, selectedGatheringName }: BookCardProps) {
  const { bookId, title, authors, thumbnail, rating, gatheringNames } = book

  return (
    <Link to={`/books/${bookId}`} className="block group">
      <article className="flex flex-col gap-small">
        {/* 책 표지 */}
        <div className="relative aspect-3/4 rounded-small overflow-hidden bg-grey-200">
          <img src={thumbnail} alt={`${title} 표지`} className="w-full h-full object-cover" />
        </div>

        {/* 책 정보 */}
        <div className="flex flex-col gap-xxtiny">
          <h3 className="typo-subtitle2 text-black line-clamp-2">{title}</h3>
          <p className="typo-caption1 text-grey-600">{authors}</p>

          {/* 별점 */}
          <div className="flex items-center gap-xtiny">
            <Star className="size-4 fill-grey-600 text-grey-600" />
            <span className="typo-body4 text-grey-600">{rating.toFixed(1)}</span>
          </div>

          {/* 모임 태그 */}
          {gatheringNames.length > 0 && (
            <div className="flex flex-wrap gap-tiny mt-tiny max-h-[62px] overflow-hidden">
              {gatheringNames.map((name) => (
                <Badge
                  key={name}
                  color={name === selectedGatheringName ? 'green' : 'grey'}
                >
                  {name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export default BookCard
