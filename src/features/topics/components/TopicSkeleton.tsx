import TopicListSkeleton from '@/features/topics/components/TopicListSkeleton'

export default function TopicSkeleton() {
  return (
    <div className="flex flex-col gap-base">
      <div className="flex flex-col gap-tiny">
        <p className="w-3/5 h-5.5 bg-grey-200 rounded animate-pulse"></p>
        <p className="w-2/5 h-5 bg-grey-200 rounded animate-pulse"></p>
      </div>
      <TopicListSkeleton />
    </div>
  )
}
