type SummaryInfoBannerProps = {
  message?: string
}

export default function SummaryInfoBanner({
  message = 'AI 요약이 완료되었어요. 확인 후 자유롭게 수정해 보세요.',
}: SummaryInfoBannerProps) {
  return (
    <div className="w-full rounded-small bg-primary-100 border border-primary-200 px-base py-small">
      <p className="typo-caption1 text-primary-400">{message}</p>
    </div>
  )
}
