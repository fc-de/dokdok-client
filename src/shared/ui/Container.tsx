import { cn } from '@/shared/lib/utils'

type ContainerProps = {
  className?: string
  children?: React.ReactNode
}

type TitleProps = {
  className?: string
  children: string
  required?: boolean
}

type ContentProps = {
  className?: string
  children?: React.ReactNode
}

function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-base p-large shadow-drop flex flex-col gap-medium',
        className
      )}
    >
      {children}
    </div>
  )
}

function Title({ className, children, required }: TitleProps) {
  return (
    <h3 className={cn('typo-heading3', className)}>
      {children}
      {required && <span className="ml-xtiny text-primary-300 text-caption2 leading-none align-top" aria-hidden="true">*</span>}
    </h3>
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
 *
 * @example
 * ```tsx
 * <Container>
 *   <Container.Title>컨테이너 타이틀</Container.Title>
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
