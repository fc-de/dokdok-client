/**
 * @file RetrospectiveCommentsSkeleton.tsx
 * @description 약속회고 댓글 로딩 스켈레톤 컴포넌트
 */

type RetrospectiveCommentsSkeletonProps = {
  /** 스켈레톤 항목 개수 */
  count?: number
}

/**
 * 약속회고 댓글 로딩 스켈레톤 컴포넌트
 *
 * @param count - 스켈레톤 항목 개수 (기본값: 10)
 */
export default function RetrospectiveCommentsSkeleton({
  count = 10,
}: RetrospectiveCommentsSkeletonProps) {
  return (
    <ul>
      {[...Array(count).keys()].map((i) => (
        <li key={i} className="border-b border-grey-300 py-large flex gap-small last:border-none">
          {/* 아바타 스켈레톤 */}
          <div className="w-10 h-10 bg-grey-200 rounded-full animate-pulse flex-shrink-0 mt-xtiny" />

          <div className="flex flex-col gap-base flex-1">
            {/* 사용자 정보 */}
            <div className="flex justify-between items-start flex-col gap-tiny">
              <div className="h-5.5 w-1/3 bg-grey-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-grey-200 rounded animate-pulse" />
            </div>

            {/* 댓글 내용 */}
            <div className="flex flex-col gap-xsmall">
              <div className="h-4 w-full bg-grey-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-grey-200 rounded animate-pulse" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
