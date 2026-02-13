/**
 * @file PlaceList.tsx
 * @description 장소 검색 결과 목록 컴포넌트
 */

import type { KakaoPlace } from '@/features/kakaomap'
import { Button } from '@/shared/ui'

export type PlaceListProps = {
  /** 장소 목록 */
  places: KakaoPlace[]
  /** li 클릭 시 지도 포커스 핸들러 */
  onPlaceFocus: (place: KakaoPlace) => void
  /** 선택 버튼 클릭 핸들러 */
  onPlaceClick: (place: KakaoPlace) => void
}

export default function PlaceList({ places, onPlaceFocus, onPlaceClick }: PlaceListProps) {
  return (
    <ul className="flex flex-col overflow-y-auto custom-scroll">
      {places.map((place) => (
        <li
          key={place.id}
          onClick={() => onPlaceFocus(place)}
          className="transition-colors bg-white border-b border-grey-300 hover:bg-grey-200 cursor-pointer p-medium pb-base"
        >
          <div className="mb-tiny flex gap-xsmall items-center">
            <p className="text-black typo-subtitle3 ">{place.place_name}</p>
            <span className="typo-body6 text-grey-600">{place.category_group_name}</span>
          </div>
          <p className="typo-body4 text-grey-700 mb-xsmall">{place.road_address_name}</p>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              outline
              onClick={(e) => {
                e.stopPropagation()
                onPlaceClick(place)
              }}
            >
              선택
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
