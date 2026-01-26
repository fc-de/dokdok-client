import { cn } from '@/shared/lib/utils'

type CardProps = {
  className?: string
  children?: React.ReactNode
}

/**
 * Card
 *
 * - 배경, 테두리, 둥근 모서리를 기본으로 제공하는 카드 컴포넌트입니다.
 * - Container보다 가볍고 단순한 레이아웃을 구성할 때 사용합니다.
 *
 * @features
 * - 기본 스타일: `rounded-base`, `p-medium`, `border border-grey-300`
 * - `className`을 통해 스타일 확장 가능
 *
 * @example
 * ```tsx
 * <Card className="shadow-drop"></Card>
 * ```
 */

function Card({ className, children }: CardProps) {
  return (
    <div className={cn('bg-white rounded-base p-medium border-grey-300 border', className)}>
      {children}
    </div>
  )
}

export { Card }
