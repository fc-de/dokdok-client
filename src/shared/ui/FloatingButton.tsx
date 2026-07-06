import * as React from 'react'

import { cn } from '@/shared/lib/utils'
import { Button, type ButtonProps } from '@/shared/ui/Button'

export interface FloatingButtonProps extends ButtonProps {
  /**
   * 하단 메뉴(모바일 내비게이션) 존재 여부.
   * true이면 메뉴 높이 + 16px 위에 위치하고, false이면 바닥에서 40px 위에 위치.
   */
  hasBottomMenu?: boolean
}

/**
 * 모바일 전용 고정 위치 플로팅 버튼 컴포넌트
 *
 * @description
 * - 모바일(1024px 미만)에서만 표시되는 fixed 버튼
 * - 오른쪽 벽 기준 16px, 하단 메뉴 유무에 따라 bottom 위치 결정
 *
 * @example
 * ```tsx
 * // 하단 메뉴 없는 경우
 * <FloatingButton onClick={handleCreate}>+ 만들기</FloatingButton>
 *
 * // 하단 메뉴 있는 경우
 * <FloatingButton hasBottomMenu onClick={handleCreate}>+ 만들기</FloatingButton>
 * ```
 */
const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ hasBottomMenu = false, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'fixed right-4 z-50',
          'hidden max-lg:inline-flex',
          'h-11.5 rounded-full px-4.5 gap-1 shadow-fab',
          hasBottomMenu
            ? 'bottom-[calc(var(--spacing-mobile-bottom-nav-height)+16px)]'
            : 'bottom-10',
          className
        )}
        {...props}
      />
    )
  }
)

FloatingButton.displayName = 'FloatingButton'

export { FloatingButton }
