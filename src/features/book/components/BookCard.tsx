import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge, Checkbox } from '@/shared/ui'

import type { BookListItem } from '../book.types'

type BookCardProps = {
  book: BookListItem
  /** 필터에서 선택된 모임명 (일치하는 Badge는 green으로 표시) */
  selectedGatheringName?: string
  /** 편집 모드 여부 */
  isEditMode?: boolean
  /** 선택 여부 (편집 모드에서 사용) */
  isSelected?: boolean
  /** 선택 토글 핸들러 (편집 모드에서 사용) */
  onSelectToggle?: (bookId: number) => void
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
 *
 * // 편집 모드
 * <BookCard
 *   book={bookData}
 *   isEditMode
 *   isSelected={selectedIds.has(book.bookId)}
 *   onSelectToggle={(id) => toggleSelection(id)}
 * />
 * ```
 */
function BookCard({
  book,
  selectedGatheringName,
  isEditMode = false,
  isSelected = false,
  onSelectToggle,
}: BookCardProps) {
  const { bookId, title, authors, thumbnail, rating, gatheringNames } = book

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault()
      onSelectToggle?.(bookId)
    }
  }

  const CardContent = (
    <article className="flex flex-col gap-small">
      {/* 책 표지 */}
      <div className="relative h-[260px] rounded-small overflow-hidden bg-grey-200">
        <img src={thumbnail} alt={`${title} 표지`} className="w-full h-full object-cover" />
        {isEditMode && (
          <div className="absolute top-[10px] right-[10px]">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelectToggle?.(bookId)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
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
              <Badge key={name} color={name === selectedGatheringName ? 'green' : 'grey'}>
                {name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  )

  if (isEditMode) {
    return (
      <div className="block group cursor-pointer" onClick={handleClick}>
        {CardContent}
      </div>
    )
  }

  return (
    <Link to={`/books/${bookId}`} className="block group">
      {CardContent}
    </Link>
  )
}

export default BookCard
