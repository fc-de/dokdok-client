import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

type ExcerptBlockProps = {
  children: ReactNode
  className?: string
}

/**
 * 발췌 인용 블록 컴포넌트
 * - 왼쪽 세로 보더가 있는 인용 블록 스타일을 제공합니다.
 *
 * @example
 * ```tsx
 * <ExcerptBlock>
 *   <p className="typo-subtitle5 text-grey-700">발췌 텍스트</p>
 *   <span className="typo-body1 text-grey-600">42p</span>
 * </ExcerptBlock>
 * ```
 */
const ExcerptBlock = ({ children, className }: ExcerptBlockProps) => {
  return (
    <blockquote
      className={cn('flex flex-col gap-tiny border-l-[4px] border-dark-100 pl-small', className)}
    >
      {children}
    </blockquote>
  )
}

export default ExcerptBlock
