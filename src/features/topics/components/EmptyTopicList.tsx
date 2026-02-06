import { Card } from '@/shared/ui'

export default function EmptyTopicList() {
  return (
    <Card className="p-base w-full flex items-center justify-center h-[160px]">
      <p className="text-grey-600 typo-subtitle3 text-center">아직 확정된 주제가 없어요</p>
    </Card>
  )
}
