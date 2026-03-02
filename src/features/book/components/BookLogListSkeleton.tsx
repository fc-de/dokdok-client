/**
 * 감상 기록 목록 스켈레톤 컴포넌트
 *
 * FoldedCard와 동일한 형태의 스켈레톤을 렌더링합니다.
 *
 * @example
 * ```tsx
 * <BookLogListSkeleton count={3} />
 * ```
 */
const BookLogListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-xlarge">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative"
          style={{ filter: 'drop-shadow(0 2px 16px rgba(17, 17, 17, 0.06))' }}
        >
          <div
            className="flex flex-col gap-large p-xlarge bg-white rounded-medium animate-pulse"
            style={{
              clipPath:
                'polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)',
            }}
          >
            {/* 헤더: 뱃지 + 날짜 */}
            <div className="flex items-center gap-small">
              <div className="h-5.5 w-12 rounded-xsmall bg-grey-200" />
              <div className="h-4 w-36 rounded-xsmall bg-grey-200" />
            </div>
            {/* 본문 텍스트 라인 */}
            <div className="flex flex-col gap-small">
              <div className="h-4 w-full rounded-xsmall bg-grey-200" />
              <div className="h-4 w-4/5 rounded-xsmall bg-grey-200" />
              <div className="h-4 w-3/5 rounded-xsmall bg-grey-200" />
            </div>
          </div>
          <div
            className="absolute bottom-0 right-0 bg-grey-200"
            style={{ width: 40, height: 40, clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          />
        </div>
      ))}
    </div>
  )
}

export default BookLogListSkeleton
