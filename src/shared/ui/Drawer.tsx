import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

type DrawerSnapPoint = number | string

type DrawerProps = {
  /** Drawer가 열려있는지 여부 (컨트롤드 컴포넌트) */
  open: boolean
  /** 열림/닫힘 상태가 바뀔 때 호출됩니다. open prop과 함께 사용하세요. */
  onOpenChange?: (open: boolean) => void
  /** true면 배경 스크롤 잠금 + 포커스 트랩. 기본값 false */
  modal?: boolean
  /** 스크린리더용 제목 (화면엔 보이지 않음, sr-only) */
  title: string
  children: React.ReactNode
  className?: string
  /** 오름차순 스냅 포인트(px) 목록. 가장 큰 값이 최대 확장 높이입니다. */
  snapPoints: DrawerSnapPoint[]
  /** 현재 스냅 포인트. snapPoints 중 하나의 값이어야 합니다. */
  snapPoint: DrawerSnapPoint
  /** 드래그/스와이프로 스냅 포인트가 바뀔 때 호출됩니다. snapPoint state를 갱신하는 데 사용하세요. */
  onSnapPointChange: (snapPoint: DrawerSnapPoint) => void
  /** Popup의 max-height(px). snapPoints 중 가장 큰 값과 같아야 합니다. */
  maxHeightPx: number
  /**
   * 현재 snapPoint가 최대 확장 높이인지 여부. true면 상단 모서리가 직각이 되고
   * 드래그 핸들이 사라지며 상단에 그림자가 표시됩니다.
   * base-ui의 data-expanded는 snapPoint가 리터럴 값 1(뷰포트 100%)일 때만 켜지므로,
   * px 기반 snapPoints를 쓰는 우리는 직접 계산해서 넘겨줘야 함.
   */
  isExpanded?: boolean
}

const HANDLE_HEIGHT = '26px'

function Drawer({
  open,
  onOpenChange,
  modal = false,
  title,
  children,
  className,
  snapPoints,
  snapPoint,
  onSnapPointChange,
  maxHeightPx,
  isExpanded = false,
}: DrawerProps) {
  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      snapPoints={snapPoints}
      snapPoint={snapPoint}
      onSnapPointChange={(sp) => {
        if (sp != null) onSnapPointChange(sp)
      }}
    >
      <DrawerPrimitive.Portal>
        {/* Viewport는 화면 전체를 덮으므로 pointer-events를 꺼야 Popup 바깥
            (뒤로가기 버튼, 검색 입력 등) 클릭이 막히지 않음.
            z-51: Drawer를 사용하는 화면(예: PlaceSearchMobileView)이 자체 풀스크린
            오버레이를 z-50으로 띄우는 경우가 있어 그 위에 오도록 +1 */}
        <DrawerPrimitive.Viewport className="pointer-events-none fixed inset-0 z-51 flex touch-none items-end justify-center">
          <DrawerPrimitive.Popup
            data-slot="drawer"
            style={{ maxHeight: maxHeightPx }}
            className={cn(
              'pointer-events-auto flex w-full touch-none flex-col overflow-visible bg-white outline-none will-change-transform',
              isExpanded ? 'rounded-t-none' : 'rounded-t-medium',
              'pb-[max(0px,calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))]',
              'transform-[translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))]',
              'transition-transform duration-300 ease-out',
              className
            )}
            // 검색 입력에 포커스가 남아있어야 하므로 Drawer가 열려도 포커스를 가져오지 않음
            initialFocus={false}
            finalFocus={false}
          >
            <DrawerPrimitive.Title className="sr-only">{title}</DrawerPrimitive.Title>
            {!isExpanded && <DrawerHandle />}
            {children}
            {/* children 뒤에 위치해야 목록 아이템 위에 그림자가 paint됨 */}
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
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.Viewport>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}

// 드래그 핸들러가 따로 없어도, base-ui가 Popup 영역(Drawer.Content 제외) 전체를
// 네이티브로 드래그 처리하므로 이 핸들도 자연스럽게 드래그된다
function DrawerHandle() {
  return (
    <div
      data-slot="drawer-handle"
      className="flex w-full shrink-0 items-center justify-center"
      style={{ height: HANDLE_HEIGHT }}
    >
      <div className="h-1.5 w-12 rounded-full bg-grey-300" />
    </div>
  )
}

type DrawerBodyProps = React.ComponentProps<typeof DrawerPrimitive.Content>

// scrollTop 기반 스크롤/드래그 전환은 base-ui가 처리하므로 별도 로직 없이 그대로 사용
function DrawerBody({ className, ...props }: DrawerBodyProps) {
  return (
    <DrawerPrimitive.Content
      data-slot="drawer-body"
      className={cn(
        'min-h-0 flex-1 touch-auto overflow-y-auto custom-scroll overscroll-contain',
        className
      )}
      {...props}
    />
  )
}

const DrawerNamespace = Object.assign(Drawer, {
  Body: DrawerBody,
})

export { DrawerNamespace as Drawer }
