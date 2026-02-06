import { Card } from '@/shared/ui'

export default function EmptyTopicList() {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <Card className="p-base w-full">
        <p className="text-grey-500 typo-body2 text-center">확정된 주제가 없습니다.</p>
      </Card>
    </div>
  )
}
