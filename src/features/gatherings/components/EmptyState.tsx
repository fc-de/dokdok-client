type EmptyStateType = 'all' | 'favorites' | 'meetings' | 'bookshelf'

interface EmptyStateProps {
  type?: EmptyStateType
}

const EMPTY_STATE_MESSAGES: Record<EmptyStateType, React.ReactNode> = {
  all: (
    <>
      아직 참여 중인 모임이 없어요.
      <br />첫 번째 모임을 시작해 보세요!
    </>
  ),
  favorites: (
    <>
      즐겨찾기한 모임이 없어요.
      <br />
      자주 방문하는 모임을 즐겨찾기에 추가해 보세요!
    </>
  ),
  meetings: (
    <>
      등록된 약속이 없어요.
      <br />첫 약속을 추가해보세요!
    </>
  ),
  bookshelf: (
    <>
      함께 읽은 책이 없어요
      <br />
      약속을 만들어 책을 추가해보세요!
    </>
  ),
}

export default function EmptyState({ type = 'all' }: EmptyStateProps) {
  return (
    <div className="flex h-35 items-center justify-center rounded-base border border-grey-300">
      <p className="text-center text-grey-600 typo-subtitle2">{EMPTY_STATE_MESSAGES[type]}</p>
    </div>
  )
}
