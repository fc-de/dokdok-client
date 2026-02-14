type PlaceListSkeletonProps = {
  count?: number
}

export default function PlaceListSkeleton({ count = 5 }: PlaceListSkeletonProps) {
  return (
    <ul className="flex flex-col overflow-y-auto custom-scroll">
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
