import { Card } from '@/shared/ui'

export default function EmptyTopicList() {
  return (
    <Card className="p-base w-full flex items-center justify-center h-[160px] max-lg:gap-[10px] max-lg:flex-col">
      <p className="text-grey-600 typo-subtitle3 text-center max-lg:text-black">
        아직 확정된 주제가 없어요
      </p>
      <p className="hidden max-lg:block max-lg:text-m-body3 max-lg:text-grey-600">
        약속장이 주제를 선정하고 있어요
      </p>
    </Card>
  )
}
