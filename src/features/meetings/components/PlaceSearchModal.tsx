/**
 * @file PlaceSearchModal.tsx
 * @description 장소 검색 모달 컴포넌트
 *
 * UI는 searchState 기준으로만 화면을 분기합니다.
 * 모든 상태 관리와 비동기 로직은 usePlaceSearch 훅에서 처리합니다.
 */

import { Map, MapMarker, ZoomControl } from '@/features/kakaomap'
import PlaceList from '@/features/meetings/components/PlaceList'
import PlaceListSkeleton from '@/features/meetings/components/PlaceListSkeleton'
import { usePlaceSearch } from '@/features/meetings/hooks'
import { cn } from '@/shared/lib/utils'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, SearchField } from '@/shared/ui'

export type PlaceSearchModalProps = {
  /** 모달 열림 상태 */
  open: boolean
  /** 모달 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  /** 장소 선택 핸들러 */
  onSelectPlace: (place: {
    name: string
    address: string
    latitude: number
    longitude: number
  }) => void
}

export default function PlaceSearchModal({
  open,
  onOpenChange,
  onSelectPlace,
}: PlaceSearchModalProps) {
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

          {/* 지도 + 리스트 영역
              isMapMounted: 첫 검색 전 / 에러는 마운트하지 않음
              isMapVisible: noResults일 때 Map 인스턴스를 유지한 채 CSS로만 숨김 */}
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

              <div className="flex flex-col shrink-0 w-[390px]">
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

          {/* 검색 결과 없음 */}
          {searchState === 'noResults' && (
            <div className="h-95 flex items-center justify-center">
              <p className="text-grey-600 typo-body3">검색 결과가 없습니다</p>
            </div>
          )}

          {/* SDK 오류 또는 검색 오류 */}
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
