/**
 * @file PlaceList.tsx
 * @description 장소 검색 결과 목록 컴포넌트
 */

import type { KakaoPlace } from '../kakaoMap.types'

export type PlaceListProps = {
  /** 장소 목록 */
  places: KakaoPlace[]
  /** 장소 클릭 핸들러 */
  onPlaceClick: (place: KakaoPlace) => void
  /** 장소 hover 핸들러 */
  onPlaceHover?: (place: KakaoPlace, index: number) => void
  /** 장소 hover 종료 핸들러 */
  onPlaceHoverEnd?: () => void
}

export function PlaceList({ places, onPlaceClick, onPlaceHover, onPlaceHoverEnd }: PlaceListProps) {
  if (places.length === 0) {
    return (
      <div className="w-[300px] flex items-center justify-center">
        <p className="text-center text-grey-600 typo-body3">검색 결과가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="w-[300px] flex flex-col gap-xtiny overflow-y-auto custom-scroll">
      {places.map((place, index) => (
        <button
          key={place.id}
          type="button"
          onClick={() => onPlaceClick(place)}
          onMouseEnter={() => onPlaceHover?.(place, index)}
          onMouseLeave={onPlaceHoverEnd}
          className="text-left transition-colors bg-white border p-small rounded-small border-grey-300 hover:bg-grey-50"
        >
          <p className="text-black typo-subtitle5 mb-xtiny">{place.place_name}</p>
          <p className="typo-body4 text-grey-600 line-clamp-2">
            {place.road_address_name || place.address_name}
          </p>
          {place.phone && <p className="typo-body4 text-grey-500 mt-xtiny">{place.phone}</p>}
        </button>
      ))}
    </div>
  )
}
