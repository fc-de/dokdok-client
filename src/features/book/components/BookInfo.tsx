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
    <div className="py-xlarge flex gap-[54px] max-lg:flex-col max-lg:gap-medium max-lg:py-0">
      {/* 좌측 책 표시 */}
      <section className="relative size-[486px] shrink-0 rounded-base bg-grey-200 overflow-hidden max-lg:h-83.75 max-lg:w-full max-lg:rounded-none">
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
        <div className="relative z-10 w-full h-full py-[100px] flex items-center justify-center max-lg:py-12">
          <img src={data?.thumbnail} alt="책 표지" className="h-full w-auto filter shadow-drop" />
        </div>
      </section>

      {/* 우측 책 설명 */}
      <section className="w-full flex flex-col gap-small max-lg:gap-base max-lg:px-5 max-lg:pb-large">
        <div className="flex flex-col gap-large py-large max-lg:gap-xsmall max-lg:pt-0 max-lg:pb-0">
          <div className="flex justify-between gap-small">
            <h2 className="typo-heading2 max-lg:typo-m-heading1 min-w-0">{data?.title}</h2>
            <div className="flex gap-xsmall items-center shrink-0">
              <p className="typo-body3 text-grey-600 whitespace-nowrap">
                {isRecording ? '기록 중' : '기록 완료'}
              </p>
              <Switch checked={isRecording} onCheckedChange={onToggleRecording} />
            </div>
          </div>
          <div>
            <div className="flex gap-small">
              <span className="typo-subtitle3 max-lg:typo-m-body3 text-grey-600">저자</span>
              <p className="typo-subtitle3 max-lg:typo-m-body3 text-grey-800">{data?.authors}</p>
            </div>
            <div className="flex gap-small">
              <span className="typo-subtitle3 max-lg:typo-m-body3 text-grey-600">출판</span>
              <p className="typo-subtitle3 max-lg:typo-m-body3 text-grey-800">{data?.publisher}</p>
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
