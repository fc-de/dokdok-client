import { cn } from '@/shared/lib/utils'

type PlaceListSkeletonProps = {
  count?: number
  className?: string
}

export default function PlaceListSkeleton({ count = 5, className }: PlaceListSkeletonProps) {
  return (
    <ul className={cn('flex flex-col overflow-y-auto custom-scroll', className)}>
      {[...Array(count).keys()].map((i) => (
        <li key={i} className=" bg-white border-b border-grey-300 p-medium pb-base">
          <div className="flex gap-xsmall">
            <div className="h-5.5 bg-grey-200 rounded w-30 animate-pulse" />
            <div className="h-4.5 bg-grey-200 rounded w-15 animate-pulse" />
          </div>
          <div className="h-5 bg-grey-200 rounded w-full animate-pulse" />
        </li>
      ))}
    </ul>
  )
}
