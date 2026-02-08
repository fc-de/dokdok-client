import { Book, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'

import type { GatheringBookItem } from '../gatherings.types'

interface GatheringBookCardProps {
  book: GatheringBookItem
}

export default function GatheringBookCard({ book }: GatheringBookCardProps) {
  const navigate = useNavigate()

  const { bookId, bookName, author, thumbnail, ratingAverage } = book

  const handleClick = () => {
    navigate(ROUTES.BOOK_DETAIL(bookId))
  }

  return (
    <div className="flex flex-col gap-base cursor-pointer group w-40" onClick={handleClick}>
      {/* 책 커버 */}
      <div className="w-40 h-55 bg-grey-300 rounded-small overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={bookName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-grey-400">
            <Book className="size-8" />
          </div>
        )}
      </div>

      {/* 책 정보 */}
      <div className="flex flex-col gap-xtiny w-40">
        {/* 제목 + 저자 */}
        <div className="flex flex-col gap-0.5">
          <p className="typo-body2 font-semibold text-black whitespace-pre-wrap">{bookName}</p>
          <p className="typo-caption1 text-grey-600">{author}</p>
        </div>

        {/* 모임 평균 평점 */}
        {ratingAverage !== null && (
          <div className="flex items-center gap-xtiny">
            <span className="typo-caption2 text-grey-600">모임 평균</span>
            <div className="flex items-center gap-xtiny">
              <Star className="size-3 fill-yellow-200 text-yellow-200" />
              <span className="typo-caption1 text-grey-600">{ratingAverage.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
