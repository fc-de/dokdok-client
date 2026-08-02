// PC: Radix Dialog / Mobile: 전체화면 + vaul Drawer
// Mobile에서 Radix Dialog를 쓰지 않는 이유: vaul과의 aria-hidden/inert 충돌 방지

import { Map, MapMarker, ZoomControl } from '@/features/kakaomap'
import PlaceList from '@/features/meetings/components/PlaceList'
import PlaceListSkeleton from '@/features/meetings/components/PlaceListSkeleton'
import { usePlaceSearch } from '@/features/meetings/hooks'
import { useDevice } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, SearchField } from '@/shared/ui'

import PlaceSearchMobileView from './PlaceSearchMobileView'

export type PlaceSearchModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPlace: (place: {
    name: string
    address: string
    latitude: number
    longitude: number
  }) => void
}

export default function PlaceSearchModal(props: PlaceSearchModalProps) {
  const { isMobile } = useDevice()
  if (isMobile) return <PlaceSearchMobileView {...props} />
  return <PlaceSearchPCModal {...props} />
}

function PlaceSearchPCModal({ open, onOpenChange, onSelectPlace }: PlaceSearchModalProps) {
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
  } = usePlaceSearch({ open, onOpenChange, onSelectPlace })

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="wide" onEscapeKeyDown={handleClose} onPointerDownOutside={handleClose}>
        <ModalHeader>
          <ModalTitle>장소 검색</ModalTitle>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-base">
          <SearchField
            placeholder="장소 또는 주소를 입력해주세요"
            ref={keywordRef}
            onKeyDown={handleKeyDown}
          />

          {/* noResults 시 Map 인스턴스를 hidden으로만 숨겨 재검색 시 재초기화를 방지 */}
          {isMapMounted && (
            <div className={cn('flex gap-base h-95 flex-1 pb-large', !isMapVisible && 'hidden')}>
              <Map
                center={{ lat: 37.566826, lng: 126.9786567 }}
                level={3}
                className="relative rounded-small bg-grey-100 size-full"
                onCreate={setMapInstance}
              >
                <ZoomControl position="TOPRIGHT" />
                {places.map((place) => (
                  <MapMarker
                    key={place.id}
                    position={{ lat: Number(place.y), lng: Number(place.x) }}
                    onMouseOver={() => setHoveredPlaceId(place.id)}
                    onMouseOut={() => setHoveredPlaceId(null)}
                  >
                    {hoveredPlaceId === place.id && (
                      <div className="py-xsmall px-small bg-white text-black">
                        {place.place_name}
                      </div>
                    )}
                  </MapMarker>
                ))}
              </Map>
              <div className="flex flex-col shrink-0 w-97.5">
                {searchState === 'searching' ? (
                  <PlaceListSkeleton />
                ) : (
                  <PlaceList
                    places={places}
                    onPlaceFocus={handlePlaceFocus}
                    onPlaceClick={handlePlaceClick}
                  />
                )}
              </div>
            </div>
          )}

          {searchState === 'noResults' && (
            <div className="h-95 flex items-center justify-center">
              <p className="text-grey-600 typo-body3">검색 결과가 없습니다</p>
            </div>
          )}
          {searchState === 'error' && (
            <div className="h-95 flex items-center justify-center">
              <p className="text-red-500 typo-body3">{errorMessage}</p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
