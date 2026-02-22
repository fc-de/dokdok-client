import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'

interface HomeBookCardProps {
  bookId: number
  title: string
  authors: string
  thumbnail: string
}

export default function HomeBookCard({ bookId, title, authors, thumbnail }: HomeBookCardProps) {
  return (
    <Link to={ROUTES.BOOK_DETAIL(bookId)} className="block w-45 shrink-0">
      {/* 썸네일 */}
      <div className="h-65 w-45 overflow-hidden rounded-small bg-grey-200">
        <img
          src={thumbnail}
          alt={`${title} 표지`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 책 정보 */}
      <div className="mt-small flex flex-col gap-xtiny">
        <h3 className="line-clamp-2 typo-subtitle2 text-black">{title}</h3>
        <p className="line-clamp-1 typo-caption1 text-grey-600">{authors}</p>
      </div>
    </Link>
  )
}
