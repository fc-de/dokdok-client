import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

const TooltipContext = React.createContext<{
  dismissable: boolean
  close: () => void
}>({
  dismissable: false,
  close: () => {},
})

/**
 * TooltipProvider
 * - 앱 최상위에서 감싸서 사용합니다 (App.tsx에 이미 설정됨).
 * - `delayDuration`으로 툴팁이 나타나는 딜레이를 조절할 수 있습니다 (기본값: 0ms).
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/**
 * Tooltip (Root)
 * - 기본: hover 시 자동으로 표시/숨김되는 일반 툴팁
 * - dismissable 모드: `dismissable` prop을 true로 설정
 *   - 컴포넌트 내부에서 자동으로 상태 관리 (useState 불필요)
 *   - 처음에 항상 열려있음
 *   - X 버튼으로만 닫을 수 있음
 *   - 한 번 닫으면 hover로 다시 열리지 않음
 *   - 외부 클릭, ESC 키, 스크롤로 닫히지 않음
 * - 고급: `open`과 `onOpenChange`로 외부에서 제어 가능 (controlled 방식)
 */
function Tooltip({
  dismissable = false,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  dismissable?: boolean
}) {
  const [internalOpen, setInternalOpen] = React.useState(true)

  const handleOpenChange = (open: boolean) => {
    if (dismissable) {
      // dismissable 모드에서는 hover로 인한 상태 변경을 모두 무시
      // (X 버튼은 close() 함수를 직접 호출하므로 별도 처리됨)
      if (props.onOpenChange) {
        // 외부에서 제어하는 경우에만 전달
        props.onOpenChange(open)
      }
      return
    }

    // 일반 모드에서는 정상적으로 처리
    if (props.onOpenChange) {
      props.onOpenChange(open)
    }
  }

  const close = () => {
    setInternalOpen(false)
    if (props.onOpenChange) {
      props.onOpenChange(false)
    }
  }

  const actualOpen = dismissable
    ? props.open !== undefined
      ? props.open
      : internalOpen
    : props.open

  return (
    <TooltipContext.Provider value={{ dismissable, close }}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        {...props}
        open={actualOpen}
        onOpenChange={handleOpenChange}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipContext.Provider>
  )
}

/**
 * TooltipTrigger
 * - 툴팁을 트리거하는 요소입니다.
 * - `asChild` prop을 사용하여 자식 요소에 직접 이벤트를 연결할 수 있습니다.
 */
function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * TooltipContent
 * - 툴팁의 실제 내용을 담는 컴포넌트입니다.
 * - dismissable 모드일 때 자동으로 X 버튼이 표시됩니다 (Tooltip Root의 dismissable prop으로 제어).
 * - `side` prop으로 툴팁 위치를 조절할 수 있습니다 (top, right, bottom, left).
 * - `sideOffset`으로 트리거 요소와의 거리를 조절할 수 있습니다 (기본값: 0).
 * - `onDismiss` 콜백을 통해 X 버튼 클릭 시 커스텀 동작을 정의할 수 있습니다 (선택사항).
 *
 * @example
 * ```tsx
 * // 기본 사용 (hover)
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button>버튼</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>
 *     <p>툴팁 내용</p>
 *   </TooltipContent>
 * </Tooltip>
 *
 * // 닫을 수 있는 툴팁 (상태 관리 불필요)
 * <Tooltip dismissable>
 *   <TooltipTrigger asChild>
 *     <Button>버튼</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>
 *     <p>X 버튼으로만 닫을 수 있는 툴팁</p>
 *   </TooltipContent>
 * </Tooltip>
 *
 * // 툴팁 위치 조절
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button>위에 표시</Button>
 *   </TooltipTrigger>
 *   <TooltipContent side="top" sideOffset={10}>
 *     <p>위쪽에 여유있게 표시됩니다</p>
 *   </TooltipContent>
 * </Tooltip>
 * ```
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  onDismiss,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  onDismiss?: () => void
}) {
  const { dismissable, close } = React.useContext(TooltipContext)

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss()
    } else {
      close()
    }
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'typo-body5 bg-grey-800 text-grey-100 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-small px-base py-small text-balance',
          dismissable && 'flex items-start gap-small',
          className
        )}
        onPointerDownOutside={dismissable ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={dismissable ? (e) => e.preventDefault() : undefined}
        {...props}
      >
        {dismissable ? (
          <>
            <div className="flex-1">{children}</div>
            <button
              onClick={handleDismiss}
              className="text-grey-100 hover:opacity-70 shrink-0 transition-opacity cursor-pointer"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          children
        )}
        <TooltipPrimitive.Arrow className="bg-grey-800 fill-grey-800 z-50 size-4 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
