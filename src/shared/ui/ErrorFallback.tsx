import { Button } from './Button'

interface ErrorFallbackProps {
  message?: string
  onRetry?: () => void
}

/**
 * 에러 발생 시 표시되는 폴백 컴포넌트
 *
 * @description
 * - 서버 에러(5xx) 등 예기치 않은 에러 발생 시 사용
 * - 재시도 버튼을 통해 복구 시도 가능
 */
export function ErrorFallback({ message = '문제가 발생했습니다', onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="typo-body1 text-grey-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
