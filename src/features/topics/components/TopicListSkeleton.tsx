import { Card } from '@/shared/ui'

type TopicListSkeletonProps = {
  count?: number
}

export default function TopicListSkeleton({ count = 5 }: TopicListSkeletonProps) {
  return (
    <>
      {[...Array(count).keys()].map((i) => (
        <Card key={i} className="p-base">
          <div className="flex flex-col gap-xsmall">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-xsmall flex-1">
                <div className="h-5 bg-grey-200 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-grey-200 rounded w-16 animate-pulse" />
              </div>
              <div className="h-4 bg-grey-200 rounded w-12 animate-pulse" />
            </div>
            <div className="h-4 bg-grey-200 rounded w-full animate-pulse" />
            <div className="h-3 bg-grey-200 rounded w-24 animate-pulse" />
          </div>
        </Card>
      ))}
    </>
  )
}
