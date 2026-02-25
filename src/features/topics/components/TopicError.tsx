import { Button } from '@/shared/ui'

interface TopicErrorProps {
  message?: string
  onRetry: () => void
}

export default function TopicError({
  message = '주제를 불러오지 못했습니다',
  onRetry,
}: TopicErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-medium py-large">
      <p className="typo-body2 text-grey-600">{message}</p>
      <Button outline onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  )
}
