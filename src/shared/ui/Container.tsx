import { Info } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

type ContainerProps = {
  className?: string
  children?: React.ReactNode
}

type TitleProps = {
  className?: string
  children: string
  required?: boolean
  errorMessage?: string
}

type ContentProps = {
  className?: string
  children?: React.ReactNode
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, children },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-base p-large shadow-drop flex flex-col gap-medium',
        className
      )}
    >
      {children}
    </div>
  )
})

function Title({ className, children, required, errorMessage }: TitleProps) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-xsmall">
        <h3 className={cn('typo-heading3', className)}>
          {children}
          {required && (
            <span
              className="leading-none align-top ml-xtiny text-primary-300 text-caption2"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </h3>
      </div>
      {errorMessage && (
        <span className="flex items-center typo-body3 text-accent-300 gap-tiny">
          <Info size="16" /> {errorMessage}
        </span>
      )}
    </div>
  )
}

function Content({ className, children }: ContentProps) {
  return <div className={cn('', className)}>{children}</div>
}

/**
 * Container
 *
 * - 배경, 그림자, 둥근 모서리를 기본으로 제공하는 컨테이너 컴포넌트입니다.
 *
 * @features
 * - 기본 스타일: `rounded-base`, `p-large`, `shadow-drop`, `flex-col gap-medium`
 * - `className`을 통해 스타일 확장 가능
 * - Title에 `errorMessage` 프롭을 전달하면 타이틀 옆에 에러 메시지 표시
 *
 * @example
 * ```tsx
 * <Container>
 *   <Container.Title required errorMessage="에러 메시지">컨테이너 타이틀</Container.Title>
 *   <Container.Content>내용이 들어갑니다</Container.Content>
 * </Container>
 * ```
 */

// Namespace pattern
const ContainerNamespace = Object.assign(Container, {
  Title,
  Content,
})

export { ContainerNamespace as Container }
