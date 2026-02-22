import { Badge, Card } from '@/shared/ui'

export default function DefaultTopicCard() {
  return (
    <Card className="p-medium flex flex-col gap-small">
      <div className="flex gap-xsmall items-center">
        <p className="text-black typo-subtitle3">기본주제</p>
        <Badge size="small" color="grey">
          자유형
        </Badge>
      </div>
      <p className="typo-body4 text-grey-700">자유롭게 이야기해봅시다.</p>
      <div className="flex justify-between items-end">
        <p className="typo-body6 text-grey-600">제안 : 도크도크</p>
      </div>
    </Card>
  )
}
