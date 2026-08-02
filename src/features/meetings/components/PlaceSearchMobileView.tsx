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
const EXPAND_THRESHOLD = 0.85

export default function PlaceSearchMobileView({
  open,
  onOpenChange,
  onSelectPlace,
}: PlaceSearchModalProps) {
  const [drawerHeight, setDrawerHeight] = useState(DEFAULT_SNAP_PX)
  const [maxSnapPx, setMaxSnapPx] = useState<number | null>(null)
  const mapAreaRef = useRef<HTMLDivElement>(null)

  // ResizeObserver 콜백(async)에서 최신 state를 읽기 위한 ref
  const drawerHeightRef = useRef(DEFAULT_SNAP_PX)
  const maxSnapPxRef = useRef<number | null>(null)
  useLayoutEffect(() => {
    drawerHeightRef.current = drawerHeight
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
    bottomOffset: drawerHeight,
    mapContainerHeight: maxSnapPx ?? undefined,
  })

  // 지도 영역 크기를 추적해 Drawer가 올라갈 수 있는 최대 높이를 계산
  useLayoutEffect(() => {
    if (!open || !mapAreaRef.current) return

    const el = mapAreaRef.current
    const update = () => {
      const newMaxSnapPx = el.clientHeight
      if (newMaxSnapPx === maxSnapPxRef.current) return
      const wasExpanded = drawerHeightRef.current === maxSnapPxRef.current
      const overflows = drawerHeightRef.current > newMaxSnapPx
      if (wasExpanded || overflows) setDrawerHeight(newMaxSnapPx)
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
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, handleClose])

  const isExpanded = maxSnapPx !== null && drawerHeight >= maxSnapPx
  // drawerHeight를 단일 스냅 포인트로 사용 — 드래그 후 state가 갱신되면 vaul이 동일 위치로 snap해 시각적 점프가 없음
  const activeSnapPoint = `${drawerHeight}px`
  const snapPoints: (string | number)[] = [activeSnapPoint]
  const isDrawerOpen = searchState === 'hasResults' || searchState === 'searching'

  const handleDrawerBodyWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isExpanded) return
    if (e.currentTarget.scrollTop === 0 && e.deltaY < 0) setDrawerHeight(DEFAULT_SNAP_PX)
  }

  if (!open) return null

  return (
    <>
      {/* Radix Dialog 대신 일반 div를 사용해 vaul Drawer와의 aria-hidden/inert 충돌을 방지 */}
      <div
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
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={(sp) => {
          if (sp == null) return
          const h = typeof sp === 'number' ? sp : parseInt(sp as string, 10)
          if (!isNaN(h)) setDrawerHeight(h)
        }}
        snapToSequentialPoint
        isExpanded={isExpanded}
        onHandleDragEnd={setDrawerHeight}
        minHeightPx={DEFAULT_SNAP_PX}
        maxHeightPx={maxSnapPx ?? undefined}
        expandThreshold={EXPAND_THRESHOLD}
      >
        <Drawer.Body dragEnabled={isExpanded} onWheel={handleDrawerBodyWheel}>
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
