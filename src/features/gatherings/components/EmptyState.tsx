import { cn } from '@/shared/lib/utils'

type EmptyStateType = 'all' | 'favorites' | 'meetings' | 'bookshelf'

interface EmptyStateProps {
  type?: EmptyStateType
  className?: string
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

export default function EmptyState({ type = 'all', className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-35 max-lg:h-40 items-center justify-center rounded-base border border-grey-300',
        className
      )}
    >
      <p className="typo-subtitle2 text-center text-grey-600 max-lg:typo-m-body2">
        {EMPTY_STATE_MESSAGES[type]}
      </p>
    </div>
  )
}
