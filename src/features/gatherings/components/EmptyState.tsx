interface EmptyStateProps {
  type?: 'all' | 'favorites'
}

export default function EmptyState({ type = 'all' }: EmptyStateProps) {
  const message =
    type === 'all' ? (
      <>
        아직 참여 중인 모임이 없어요.
        <br />첫 번째 모임을 시작해 보세요!
      </>
    ) : (
      <>
        즐겨찾기한 모임이 없어요.
        <br />
        자주 방문하는 모임을 즐겨찾기에 추가해 보세요!
      </>
    )

  return (
    <div className="flex h-35 items-center justify-center rounded-base border border-grey-300">
      <p className="text-center text-grey-600 typo-subtitle2">{message}</p>
    </div>
  )
}
