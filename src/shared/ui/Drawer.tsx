import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/shared/lib/utils'

type DrawerProps = {
  open: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  snapPoints?: (string | number)[]
  activeSnapPoint?: string | number | null
  setActiveSnapPoint?: (snapPoint: string | number | null) => void
  snapToSequentialPoint?: boolean
  /**
   * true일 때 handle 영역만 drag 가능, 콘텐츠 영역 터치는 스크롤로 동작
   * snap drawer에서 스크롤과 drag를 분리할 때 사용
   */
  handleOnly?: boolean
  /** true일 때: 상단 모서리 직각 + 드래그 핸들 숨김 */
  isExpanded?: boolean
  /** 스크린리더용 접근성 타이틀 */
  title: string
  children: React.ReactNode
  className?: string
  /** DrawerPrimitive.Portal의 container - 기본값은 document.body */
  container?: HTMLElement | null
  /**
   * 자유 높이 드래그 모드 — 설정 시 핸들을 드래그해 임의 높이로 변경 가능.
   * 드래그 완료(또는 expandThreshold 초과 시 자동 스냅) 후의 최종 px 값을 전달합니다.
   */
  onHandleDragEnd?: (heightPx: number) => void
  /** 드래그 가능한 최소 높이 (px) */
  minHeightPx?: number
  /** 드래그 가능한 최대 높이 (px). expandThreshold 이상 드래그하면 자동으로 이 값으로 스냅됩니다. */
  maxHeightPx?: number
  /**
   * 자동 expanded 임계값 (0~1).
   * 드래그 높이가 maxHeightPx * expandThreshold 이상이면 maxHeightPx로 스냅.
   * 기본값 0.85
   */
  expandThreshold?: number
}

// DrawerHandle: mt-3(12px) + h-1.5(6px) + mb-2(8px) = 26px
const HANDLE_HEIGHT = '26px'

function Drawer({
  open,
  onOpenChange,
  modal = false,
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  snapToSequentialPoint,
  handleOnly,
  isExpanded = false,
  title,
  children,
  className,
  container,
  onHandleDragEnd,
  minHeightPx,
  maxHeightPx,
  expandThreshold = 0.85,
}: DrawerProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  const currentHeightPx = React.useMemo(() => {
    if (activeSnapPoint == null) return 0
    if (typeof activeSnapPoint === 'number') return activeSnapPoint
    return parseInt(activeSnapPoint as string, 10) || 0
  }, [activeSnapPoint])

  const cssVars = {
    ...(activeSnapPoint != null && {
      '--drawer-snap-height':
        typeof activeSnapPoint === 'string' ? activeSnapPoint : `${activeSnapPoint}px`,
    }),
    '--drawer-handle-height': isExpanded ? '0px' : HANDLE_HEIGHT,
  } as React.CSSProperties

  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      snapToSequentialPoint={snapToSequentialPoint}
      handleOnly={handleOnly}
    >
      <DrawerPrimitive.Portal container={container ?? undefined}>
        {/* h-dvh: snap offset 계산 translateY = (window.innerHeight - snapValue)가 뷰포트 기준이므로
            DrawerContent도 동일 높이여야 픽셀 snap이 정확하게 동작함 */}
        <DrawerPrimitive.Content
          ref={contentRef}
          data-slot="drawer"
          style={cssVars}
          className={cn(
            'fixed inset-x-0 bottom-0 z-51 flex h-dvh flex-col bg-white outline-none',
            !isExpanded && 'rounded-t-medium',
            className
          )}
        >
          <DrawerPrimitive.Title className="sr-only">{title}</DrawerPrimitive.Title>
          {!isExpanded && (
            <DrawerHandle
              contentRef={contentRef}
              currentHeightPx={currentHeightPx}
              minHeightPx={minHeightPx}
              maxHeightPx={maxHeightPx}
              expandThreshold={expandThreshold}
              onDragEnd={onHandleDragEnd}
            />
          )}
          {children}
          {/* expanded 시 상단 그림자. children 뒤에 위치해야 목록 아이템 위에 paint됨 */}
          {isExpanded && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0"
              style={{
                height: '16px',
                background: 'linear-gradient(to bottom, rgba(17,17,17,0.08), transparent)',
              }}
            />
          )}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}

type DrawerHandleProps = {
  className?: string
  contentRef?: React.RefObject<HTMLDivElement | null>
  currentHeightPx?: number
  minHeightPx?: number
  maxHeightPx?: number
  expandThreshold?: number
  onDragEnd?: (heightPx: number) => void
}

function DrawerHandle({
  className,
  contentRef,
  currentHeightPx = 0,
  minHeightPx,
  maxHeightPx,
  expandThreshold = 0.85,
  onDragEnd,
}: DrawerHandleProps) {
  const dragState = React.useRef<{ startY: number; startHeight: number } | null>(null)
  const isDraggable = !!onDragEnd && !!contentRef

  const clamp = (value: number) => {
    let h = value
    if (minHeightPx !== undefined) h = Math.max(minHeightPx, h)
    if (maxHeightPx !== undefined) h = Math.min(maxHeightPx, h)
    return h
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!contentRef?.current) return
    // vaul이 이 drag 이벤트를 처리하지 않도록 버블링 차단
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragState.current = { startY: e.clientY, startHeight: currentHeightPx }
    // 드래그 중 vaul의 transition 비활성화 (즉각 반응을 위해)
    contentRef.current.style.transition = 'none'
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current || !contentRef?.current) return
    // vaul이 move 이벤트를 가로채 transform을 덮어쓰지 않도록 차단
    e.stopPropagation()
    const delta = dragState.current.startY - e.clientY
    const newHeight = clamp(dragState.current.startHeight + delta)
    // vaul의 transform 공식과 동일하게 imperative 업데이트 (re-render 없이 부드러운 드래그)
    contentRef.current.style.transform = `translateY(${window.innerHeight - newHeight}px)`
    contentRef.current.style.setProperty('--drawer-snap-height', `${newHeight}px`)
  }

  const pendingDragHeight = React.useRef<number | null>(null)

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current || !contentRef?.current) return
    const delta = dragState.current.startY - e.clientY
    let finalHeight = clamp(dragState.current.startHeight + delta)

    // 위로 드래그한 경우에만 자동 확장 스냅을 적용
    if (delta > 0 && maxHeightPx !== undefined && finalHeight >= maxHeightPx * expandThreshold) {
      finalHeight = maxHeightPx
    }

    dragState.current = null

    // 위치 변화 없으면 state 업데이트가 일어나지 않아 useLayoutEffect가 실행되지 않으므로 즉시 복구
    if (finalHeight === currentHeightPx) {
      contentRef.current.style.transition = ''
      onDragEnd?.(finalHeight)
      return
    }

    // transition은 아래 useLayoutEffect에서 복구 —
    // onDragEnd로 커밋된 새 activeSnapPoint를 vaul이 처리한 뒤 복구해야
    // 이전 snap point 기준 트랜지션으로 인한 점프를 방지할 수 있음
    pendingDragHeight.current = finalHeight
    onDragEnd?.(finalHeight)
  }

  // currentHeightPx(= activeSnapPoint)가 드래그 완료 높이로 갱신된 시점에 transition 복구.
  // useLayoutEffect는 paint 전 동기 실행 → vaul이 트랜지션을 계산하기 전에 안전하게 복구됨
  React.useLayoutEffect(() => {
    if (pendingDragHeight.current === null || !contentRef?.current) return
    if (currentHeightPx === pendingDragHeight.current) {
      contentRef.current.style.transition = ''
      pendingDragHeight.current = null
    }
  }, [currentHeightPx, contentRef])

  const handlePointerCancel = () => {
    if (!contentRef?.current) return
    // cancel 이벤트에서는 clientY가 유효하지 않으므로 높이를 재계산하지 않고 transition만 복구
    contentRef.current.style.transition = ''
    dragState.current = null
    pendingDragHeight.current = null
  }

  return (
    <div
      data-slot="drawer-handle"
      className={cn(
        'flex w-full shrink-0 items-center justify-center',
        isDraggable && 'cursor-grab active:cursor-grabbing touch-none',
        className
      )}
      style={{ height: HANDLE_HEIGHT }}
      {...(isDraggable && {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerCancel,
      })}
    >
      <div className="h-1.5 w-12 rounded-full bg-grey-300" />
    </div>
  )
}

type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * true일 때 data-vaul-no-drag를 제거해 vaul의 내장 drag/scroll 감지를 활성화합니다.
   * vaul은 scrollTop === 0에서 아래 스와이프 시 드로어를 드래그하고,
   * 위 스와이프 시 콘텐츠 스크롤을 허용합니다.
   */
  dragEnabled?: boolean
}

function DrawerBody({ className, style, dragEnabled = false, ...props }: DrawerBodyProps) {
  return (
    <div
      data-slot="drawer-body"
      {...(!dragEnabled && { 'data-vaul-no-drag': true })}
      className={cn('overflow-y-auto custom-scroll overscroll-contain touch-pan-y', className)}
      // 스크롤 컨테이너를 현재 snap 높이로 제한해 마지막 아이템이 가시 영역 안에 오도록 함
      // activeSnapPoint가 없으면 100dvh - 0px(핸들 없음)으로 fallback
      style={{
        maxHeight: 'calc(var(--drawer-snap-height, 100dvh) - var(--drawer-handle-height, 0px))',
        ...style,
      }}
      {...props}
    />
  )
}

const DrawerNamespace = Object.assign(Drawer, {
  Body: DrawerBody,
})

export { DrawerNamespace as Drawer }
