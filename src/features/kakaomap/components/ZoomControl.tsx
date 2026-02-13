/**
 * @file ZoomControl.tsx
 * @description 카카오 지도 줌 컨트롤 컴포넌트
 *
 * <Map> 내부에서 사용하며, KakaoMapContext로 map 인스턴스를 획득해
 * 줌 컨트롤을 추가/제거합니다.
 *
 * @example
 * <Map center={{ lat: 37.566826, lng: 126.9786567 }} level={3}>
 *   <ZoomControl position="RIGHT" />
 * </Map>
 */

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo } from 'react'

import { useKakaoMapContext } from '../context/KakaoMapContext'
import type { KakaoControl } from '../kakaoMap.types'

type KakaoControlPositionKey = keyof Window['kakao']['maps']['ControlPosition']

export type ZoomControlProps = {
  /** ZoomControl 표시 위치 (기본값: 'RIGHT') */
  position?: number | KakaoControlPositionKey
}

export const ZoomControl = forwardRef<KakaoControl, ZoomControlProps>(function ZoomControl(
  { position: _position = 'RIGHT' },
  ref
) {
  const map = useKakaoMapContext()

  const position =
    typeof _position === 'string' ? window.kakao.maps.ControlPosition[_position] : _position

  const zoomControl = useMemo(() => new window.kakao.maps.ZoomControl(), [])

  useImperativeHandle(ref, () => zoomControl, [zoomControl])

  useLayoutEffect(() => {
    if (!map) return

    map.addControl(zoomControl, position)

    return () => {
      map.removeControl(zoomControl)
    }
  }, [map, position, zoomControl])

  return null
})
