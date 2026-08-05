import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Map, MapMarker } from '@/features/kakaomap'
import PlaceList from '@/features/meetings/components/PlaceList'
import PlaceListSkeleton from '@/features/meetings/components/PlaceListSkeleton'
import { usePlaceSearch } from '@/features/meetings/hooks'
import { cn } from '@/shared/lib/utils'
import { Drawer, SearchField } from '@/shared/ui'

import type { PlaceSearchModalProps } from './PlaceSearchModal'

const DEFAULT_SNAP_PX = 300

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getMidSnapPx(maxSnapPx: number) {
  return Math.round((DEFAULT_SNAP_PX + maxSnapPx) / 2)
}

// Drawer(Drawer.tsx)는 base-ui Portal로 document.body에 렌더링되어 dialog div와 DOM상
// 형제 관계가 아니므로, 두 컨테이너의 포커스 가능 요소를 모아 수동으로 트랩 대상 목록을 만든다.
function getFocusableElements(containers: (HTMLElement | null)[]) {
  const elements: HTMLElement[] = []
  containers.forEach((container) => {
    if (!container) return
    elements.push(...Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)))
  })
  return elements.filter((el) => el.offsetParent !== null)
}

export default function PlaceSearchMobileView({
  open,
  onOpenChange,
  onSelectPlace,
}: PlaceSearchModalProps) {
  const [snapPoint, setSnapPoint] = useState<number>(DEFAULT_SNAP_PX)
  const [maxSnapPx, setMaxSnapPx] = useState<number | null>(null)
  const mapAreaRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  // ResizeObserver 콜백(async)에서 최신 state를 읽기 위한 ref
  const snapPointRef = useRef(DEFAULT_SNAP_PX)
  const maxSnapPxRef = useRef<number | null>(null)
  useLayoutEffect(() => {
    snapPointRef.current = snapPoint
    maxSnapPxRef.current = maxSnapPx
  })

  const {
    searchState,
    errorMessage,
    places,
    isMapMounted,
    isMapVisible,
    hoveredPlaceId,
    keywordRef,
    setMapInstance,
    setHoveredPlaceId,
    handleKeyDown,
    handlePlaceClick,
    handlePlaceFocus,
    handleClose,
  } = usePlaceSearch({
    open,
    onOpenChange,
    onSelectPlace,
    bottomOffset: snapPoint,
    mapContainerHeight: maxSnapPx ?? undefined,
  })

  useLayoutEffect(() => {
    if (!open || !mapAreaRef.current) return

    const el = mapAreaRef.current
    const update = () => {
      const newMaxSnapPx = el.clientHeight
      if (newMaxSnapPx === maxSnapPxRef.current) return

      // 리사이즈 전에 mid/max에 있었다면 새 mid/max로 따라가고, 화면을 벗어나면 새 max로 clamp
      const oldMax = maxSnapPxRef.current
      const oldMid = oldMax !== null ? getMidSnapPx(oldMax) : null
      setSnapPoint((prev) => {
        if (prev === oldMax) return newMaxSnapPx
        if (prev === oldMid) return getMidSnapPx(newMaxSnapPx)
        if (prev > newMaxSnapPx) return newMaxSnapPx
        return prev
      })

      maxSnapPxRef.current = newMaxSnapPx
      setMaxSnapPx(newMaxSnapPx)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [open])

  // 일반 div 기반이라 Radix Dialog의 scroll lock이 없으므로 직접 처리
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // 수동 dialog라 Radix의 Escape 처리가 없으므로 직접 처리
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
        return
      }
      if (e.key !== 'Tab') return

      // Drawer는 base-ui Portal로 body에 렌더링되어 dialogRef 바깥에 있으므로 함께 모아 트랩한다.
      const drawerEl = document.querySelector<HTMLElement>('[data-slot="drawer"]')
      const focusable = getFocusableElements([dialogRef.current, drawerEl])
      if (focusable.length === 0) return

      e.preventDefault()
      const lastIndex = focusable.length - 1
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)
      const nextIndex = e.shiftKey
        ? currentIndex <= 0
          ? lastIndex
          : currentIndex - 1
        : currentIndex === -1 || currentIndex === lastIndex
          ? 0
          : currentIndex + 1
      focusable[nextIndex]?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, handleClose])

  // 다이얼로그가 열릴 때 트리거 요소를 기억해두고 내부로 포커스를 이동, 닫힐 때 복원한다.
  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null
    keywordRef.current?.focus()
    return () => {
      previouslyFocusedRef.current?.focus()
    }
  }, [open, keywordRef])

  const isExpanded = maxSnapPx !== null && snapPoint >= maxSnapPx
  const isDrawerOpen = searchState === 'hasResults' || searchState === 'searching'
  const snapPoints =
    maxSnapPx !== null ? [DEFAULT_SNAP_PX, getMidSnapPx(maxSnapPx), maxSnapPx] : [DEFAULT_SNAP_PX]

  const handleDrawerBodyWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isExpanded) return
    if (e.currentTarget.scrollTop === 0 && e.deltaY < 0) setSnapPoint(DEFAULT_SNAP_PX)
  }

  if (!open) return null

  return (
    <>
      {/* Radix Dialog 대신 일반 div를 사용해 base-ui Drawer와의 aria-hidden/inert 충돌을 방지 */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="장소 검색"
        className="fixed inset-0 z-50 flex flex-col bg-white"
      >
        <div className="flex shrink-0 items-center gap-small px-medium py-small">
          <button
            type="button"
            onClick={handleClose}
            aria-label="뒤로가기"
            className="flex items-center justify-center rounded-full text-grey-700 transition-colors hover:bg-grey-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft aria-hidden className="size-6" />
          </button>
          <span className="typo-m-heading3 text-black">장소 검색</span>
        </div>

        <div className="shrink-0 px-medium pb-medium">
          <SearchField
            placeholder="장소 또는 주소를 입력해주세요"
            ref={keywordRef}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* isMapVisible=false(noResults)일 때 hidden으로만 숨겨 Map 인스턴스를 재사용 */}
        <div ref={mapAreaRef} className="relative flex-1 overflow-hidden">
          {isMapMounted && (
            <Map
              center={{ lat: 37.566826, lng: 126.9786567 }}
              level={3}
              className={cn('absolute inset-0 size-full', !isMapVisible && 'hidden')}
              onCreate={setMapInstance}
            >
              {places.map((place) => (
                <MapMarker
                  key={place.id}
                  position={{ lat: Number(place.y), lng: Number(place.x) }}
                  onMouseOver={() => setHoveredPlaceId(place.id)}
                  onMouseOut={() => setHoveredPlaceId(null)}
                >
                  {hoveredPlaceId === place.id && (
                    <div className="px-small py-xsmall bg-white text-black">{place.place_name}</div>
                  )}
                </MapMarker>
              ))}
            </Map>
          )}
          {searchState === 'noResults' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="typo-body3 text-grey-600">검색 결과가 없습니다</p>
            </div>
          )}
          {searchState === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="typo-body3 text-red-500">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={isDrawerOpen}
        title="장소 검색 결과"
        snapPoints={snapPoints}
        snapPoint={snapPoint}
        onSnapPointChange={(sp) => setSnapPoint(typeof sp === 'number' ? sp : parseInt(sp, 10))}
        maxHeightPx={maxSnapPx ?? DEFAULT_SNAP_PX}
        isExpanded={isExpanded}
      >
        <Drawer.Body onWheel={handleDrawerBodyWheel}>
          {searchState === 'searching' ? (
            <PlaceListSkeleton className="overflow-y-visible" />
          ) : (
            <PlaceList
              places={places}
              onPlaceFocus={handlePlaceFocus}
              onPlaceClick={handlePlaceClick}
              className="overflow-y-visible"
            />
          )}
        </Drawer.Body>
      </Drawer>
    </>
  )
}
