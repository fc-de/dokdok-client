type SummaryInfoBannerProps = {
  message?: string
  variant?: 'success' | 'error'
}

export default function SummaryInfoBanner({
  message,
  variant = 'success',
}: SummaryInfoBannerProps) {
  const defaultMessage =
    variant === 'error'
      ? 'AI 요약에 실패했어요. 수정하기를 눌러 직접 내용을 입력해 보세요.'
      : 'AI 요약이 완료되었어요. 확인 후 자유롭게 수정해 보세요.'

  const isError = variant === 'error'

  return (
    <div
      className={`w-full rounded-small border px-base py-small ${
        isError ? 'bg-accent-100 border-accent-200' : 'bg-primary-100 border-primary-200'
      }`}
    >
      <p className={`typo-caption1 ${isError ? 'text-accent-300' : 'text-primary-400'}`}>
        {message ?? defaultMessage}
      </p>
    </div>
  )
}
