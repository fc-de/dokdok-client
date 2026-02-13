/**
 * @file MapMarker.tsx
 * @description 카카오 지도 마커 공개 컴포넌트
 *
 * Map 컴포넌트의 자식으로 사용합니다.
 * position을 useMemo로 최적화하고, 실제 마커 로직은 Marker에 위임합니다.
 *
 * @example
 * <Map center={{ lat: 37.566826, lng: 126.9786567 }} level={3}>
 *   <MapMarker
 *     position={{ lat: 37.566826, lng: 126.9786567 }}
 *     onClick={(marker) => console.log(marker)}
 *   >
 *     <div style={{ color: '#000' }}>마커 내용</div>
 *   </MapMarker>
 * </Map>
 */

import { forwardRef, type PropsWithChildren, useMemo } from 'react'

import { useKakaoMapContext } from '../context/KakaoMapContext'
import type { KakaoMarker } from '../kakaoMap.types'
import { Marker, type MarkerImageProp } from './Marker'

export type MapMarkerProps = {
  /**
   * 마커 표시 좌표
   */
  position: { lat: number; lng: number } | { x: number; y: number }

  /** 마커 이미지 커스터마이징 */
  image?: MarkerImageProp

  /** 마커 툴팁 텍스트 */
  title?: string

  /** 드래그 가능 여부 */
  draggable?: boolean

  /** 클릭 가능 여부 */
  clickable?: boolean

  /** z-index */
  zIndex?: number

  /** 투명도 (0–1) */
  opacity?: number

  /** 마커 클릭 이벤트 */
  onClick?: (marker: KakaoMarker) => void

  /** 마커 마우스오버 이벤트 */
  onMouseOver?: (marker: KakaoMarker) => void

  /** 마커 마우스아웃 이벤트 */
  onMouseOut?: (marker: KakaoMarker) => void

  /** 마커 드래그 시작 이벤트 */
  onDragStart?: (marker: KakaoMarker) => void

  /** 마커 드래그 종료 이벤트 */
  onDragEnd?: (marker: KakaoMarker) => void

  /** 마커 생성 완료 콜백 */
  onCreate?: (marker: KakaoMarker) => void

  /** InfoWindow 옵션 */
  infoWindowOptions?: {
    disableAutoPan?: boolean
    removable?: boolean
    zIndex?: number
  }
}

export const MapMarker = forwardRef<KakaoMarker, PropsWithChildren<MapMarkerProps>>(
  function MapMarker({ position, ...props }, ref) {
    const map = useKakaoMapContext()

    // 복잡한 표현식을 변수로 추출해 useMemo deps를 정적으로 분석 가능하게 함
    const lat = 'lat' in position ? position.lat : position.y
    const lng = 'lng' in position ? position.lng : position.x

    const markerPosition = useMemo(() => {
      if (!window.kakao?.maps) return null
      return new window.kakao.maps.LatLng(lat, lng)
    }, [lat, lng])

    if (!map || !markerPosition) return null

    return <Marker map={map} position={markerPosition} {...props} ref={ref} />
  }
)
