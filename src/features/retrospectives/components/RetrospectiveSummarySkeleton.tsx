import { Card } from '@/shared/ui'

type RetrospectiveSummarySkeletonProps = {
  count?: number
}

export default function RetrospectiveSummarySkeleton({
  count = 3,
}: RetrospectiveSummarySkeletonProps) {
  return (
    <div className="flex flex-col gap-medium">
      {[...Array(count).keys()].map((i) => (
        <Card key={i} className="p-large">
          <div className="flex flex-col gap-base">
            {/* 토픽 헤더 */}
            <div className="flex items-center gap-xsmall">
              <div className="h-5 w-8 bg-grey-200 rounded animate-pulse" />
              <div className="h-5 w-1/3 bg-grey-200 rounded animate-pulse" />
            </div>
            {/* 요약 텍스트 */}
            <div className="flex flex-col gap-xsmall">
              <div className="h-4 w-full bg-grey-200 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-grey-200 rounded animate-pulse" />
              <div className="h-4 w-3/5 bg-grey-200 rounded animate-pulse" />
            </div>
            {/* 키포인트 */}
            <div className="flex flex-col gap-xsmall mt-xsmall">
              <div className="h-4 w-1/4 bg-grey-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-grey-200 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-grey-200 rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
