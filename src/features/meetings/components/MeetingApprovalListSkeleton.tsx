/**
 * @file MeetingApprovalListSkeleton.tsx
 * @description 약속 승인 리스트 스켈레톤 컴포넌트
 */

export default function MeetingApprovalListSkeleton() {
  const SKELETON_COUNT = 10

  return (
    <ul>
      {[...Array(SKELETON_COUNT).keys()].map((i) => (
        <li
          key={i}
          className="flex items-center justify-between border-b gap-medium py-large border-grey-300 last:border-b-0"
        >
          <div className="flex flex-col gap-xtiny flex-1">
            <div className="h-5 bg-grey-200 rounded w-20 animate-pulse" />
            <div className="h-5.5 bg-grey-200 rounded w-40 animate-pulse" />
            <div className="h-5 bg-grey-200 rounded w-1/3 animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  )
}
