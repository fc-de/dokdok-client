import { useRef } from 'react'

import { cn } from '@/shared/lib/utils'
import { Badge, Card } from '@/shared/ui'
import { NumberedCheckbox } from '@/shared/ui/NumberedCheckbox'

type ConfirmModalTopicCardProps = {
  title: string
  topicTypeLabel: string
  description: string
  createdByNickname: string
  topicId: number
  isSelected: boolean
}

export default function ConfirmModalTopicCard({
  title,
  topicTypeLabel,
  description,
  createdByNickname,
  topicId,
  isSelected,
}: ConfirmModalTopicCardProps) {
  const checkboxRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="cursor-pointer" onClick={() => checkboxRef.current?.click()}>
      <Card
        className={cn('flex gap-small items-start p-medium', isSelected && 'border-primary-200')}
      >
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <NumberedCheckbox id={topicId.toString()} ref={checkboxRef} />
        </div>
        <div className="flex flex-col gap-small flex-1">
          <div className="flex justify-between items-start">
            <div className="flex gap-xsmall items-center">
              <p className="text-black typo-subtitle3">{title}</p>
              <Badge size="small" color="grey">
                {topicTypeLabel}
              </Badge>
            </div>
          </div>
          <p className="typo-body4 text-grey-700">{description}</p>
          <p className="typo-body6 text-grey-600">제안 : {createdByNickname}</p>
        </div>
      </Card>
    </div>
  )
}
