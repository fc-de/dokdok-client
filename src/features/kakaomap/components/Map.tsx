/**
 * @file Map.tsx
 * @description 카카오 지도 컨테이너 컴포넌트
 *
 * 동작 흐름:
 * 1. <div ref> DOM 생성
 * 2. useLayoutEffect: new kakao.maps.Map(div, options) 인스턴스 생성 (깜빡임 없음)
 * 3. KakaoMapContext.Provider로 자식(MapMarker 등)에게 map 인스턴스 전달
 * 4. center/level props 변경 → SDK setter 직접 호출 (리렌더 없이 동기화)
 *
 * @example
 * const [loading] = useKakaoLoader()
 * if (loading) return <Spinner />
 *
 * return (
 *   <Map
 *     center={{ lat: 37.566826, lng: 126.9786567 }}
 *     level={3}
 *     style={{ width: '100%', height: '350px' }}
 *     onCreate={setMap}
 *   >
 *     <MapMarker position={{ lat: 37.566826, lng: 126.9786567 }} />
 *   </Map>
 * )
 */

import { useLayoutEffect, useRef, useState } from 'react'

import { KakaoMapContext } from '../context/KakaoMapContext'
import type { KakaoMap } from '../kakaoMap.types'

export type MapProps = {
  /** 지도 중심 좌표 */
  center: { lat: number; lng: number }
  /** 지도 줌 레벨 (기본값: 3) */
  level?: number
  style?: React.CSSProperties
  className?: string
  /** 지도 인스턴스 생성 완료 콜백 — 외부에서 map 인스턴스에 직접 접근할 때 사용 */
  onCreate?: (map: KakaoMap) => void
  children?: React.ReactNode
}

export function Map({ center, level = 3, style, className, onCreate, children }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<KakaoMap | null>(null)

  // onCreate 콜백을 ref로 안정화 — deps 변경 없이 항상 최신 참조 유지
  const onCreateRef = useRef(onCreate)
  onCreateRef.current = onCreate

  // ── 최초 마운트 시 지도 인스턴스 생성 ────────────────────────
  // useLayoutEffect: DOM paint 직전 실행 → 깜빡임 없음
  useLayoutEffect(() => {
    if (!containerRef.current || !window.kakao?.maps) return

    const kakaoMap = new window.kakao.maps.Map(containerRef.current, {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level,
    })

    setMap(kakaoMap)
    onCreateRef.current?.(kakaoMap)

    return () => {
      setMap(null)
    }
    // center/level 초기값은 한 번만 사용. 이후 변경은 아래 effect에서 SDK setter로 처리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── center props 변경 → map.setCenter() 호출 ─────────────
  useLayoutEffect(() => {
    if (!map) return
    map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng))
  }, [map, center.lat, center.lng])

  // ── level props 변경 → map.setLevel() 호출 ───────────────
  useLayoutEffect(() => {
    if (!map) return
    map.setLevel(level)
  }, [map, level])

  return (
    <KakaoMapContext.Provider value={map}>
      <div ref={containerRef} style={style} className={className} />
      {/* map 인스턴스가 준비된 후에만 자식 렌더링 */}
      {map && children}
    </KakaoMapContext.Provider>
  )
}
