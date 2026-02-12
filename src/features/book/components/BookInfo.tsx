import { Division } from '@/shared/components/Division'
import { Spinner } from '@/shared/ui'
import { Switch } from '@/shared/ui/Switch'

import { useBookDetail } from '../hooks'
import BookReview from './BookReview'

type BookInfoProps = {
  bookId: number
  isRecording: boolean
  onToggleRecording: () => void
}

const BookInfo = ({ bookId, isRecording, onToggleRecording }: BookInfoProps) => {
  const { data, isLoading, isError } = useBookDetail(bookId)

  //   if (isLoading) return <BookInfoSkeleton />
  if (isLoading)
    return (
      <div className="h-[486px] flex items-center justify-center">
        <Spinner />
      </div>
    )
  if (isError || !data) return <div>책 정보를 불러올 수 없습니다.</div>

  return (
    <div className="py-xlarge flex gap-[54px]">
      {/* 좌측 책 표시 */}
      <section className="relative size-[486px] shrink-0 rounded-base bg-grey-200 overflow-hidden">
        {/* 배경 블러 전용 래퍼 (영역 제한) */}
        <div
          className="
      absolute left-1/2 top-1/2
      -translate-x-[calc(50%+16px)] -translate-y-1/2
      w-[240px] h-[340px]
      z-0
      pointer-events-none
    "
        >
          <img
            src={data?.thumbnail}
            aria-hidden
            className="
        w-full h-full
        object-contain
        blur-[120px]
      "
          />
        </div>

        {/* 실제 책 커버 */}
        <div className="relative z-10 w-full h-full py-[100px] flex items-center justify-center">
          <img
            src={data?.thumbnail}
            alt="책 표지"
            className="
        max-h-full max-w-full object-contain
        filter shadow-drop
      "
          />
        </div>
      </section>

      {/* 우측 책 설명 */}
      <section className="w-full flex flex-col gap-small">
        <div className="flex flex-col gap-large py-large">
          <div className="flex justify-between">
            <h2 className="typo-heading2">{data?.title}</h2>
            <div className="flex gap-xsmall items-center">
              <p className="typo-body3 text-grey-600">{isRecording ? '기록 중' : '기록 완료'}</p>
              <Switch checked={isRecording} onCheckedChange={onToggleRecording} />
            </div>
          </div>
          <div>
            <div className="flex gap-small">
              <span className="typo-subtitle3 text-grey-600">저자</span>
              <p className="typo-subtitle3 text-grey-800">{data?.authors}</p>
            </div>
            <div className="flex gap-small">
              <span className="typo-subtitle3 text-grey-600">출판</span>
              <p className="typo-subtitle3 text-grey-800">{data?.publisher}</p>
            </div>
          </div>
        </div>

        <Division />

        <BookReview bookId={bookId} />
      </section>
    </div>
  )
}

export default BookInfo
