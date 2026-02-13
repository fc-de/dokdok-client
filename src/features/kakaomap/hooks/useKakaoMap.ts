/**
 * @file useKakaoMap.ts
 * @description Kakao Maps 지도 및 마커 관리 훅
 *
 * 내부 동작 흐름:
 * 1. Loader.load()로 SDK 로드 보장
 * 2. mapDivRef의 DOM 엘리먼트에 kakao.maps.Map 인스턴스 생성
 * 3. map 인스턴스를 KakaoMapContext.Provider로 자식에게 전달
 * 4. props 변경 시 Kakao SDK 메서드 직접 호출 (리렌더 최소화)
 */

import { useCallback, useRef, useState } from 'react'

import { KakaoMapContext } from '../context/KakaoMapContext'
import type { KakaoInfoWindow, KakaoMap, KakaoMarker, KakaoPlace } from '../kakaoMap.types'
import { Loader } from '../lib/kakaoMapApiLoader'

export type UseKakaoMapOptions = {
  /** 초기 중심 좌표 */
  initialCenter?: { lat: number; lng: number }
  /** 초기 줌 레벨 */
  initialLevel?: number
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export function useKakaoMap({ initialCenter, initialLevel = 3 }: UseKakaoMapOptions = {}) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // DOM 참조: 콜백 ref 패턴 (렌더 직후 동기적으로 설정됨)
  const mapDivRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<KakaoMap | null>(null)
  const markersRef = useRef<KakaoMarker[]>([])
  const infowindowRef = useRef<KakaoInfoWindow | null>(null)

  const defaultCenter = useRef(initialCenter ?? { lat: 37.566826, lng: 126.9786567 })

  // map div에 연결할 콜백 ref — 렌더 직후 동기적으로 설정됨
  const setMapElement = useCallback((el: HTMLDivElement | null) => {
    mapDivRef.current = el
  }, [])

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
  }, [])

  const closeInfoWindow = useCallback(() => {
    infowindowRef.current?.close()
  }, [])

  const openInfoWindow = useCallback((marker: KakaoMarker, title: string) => {
    if (!mapRef.current || !infowindowRef.current) return
    infowindowRef.current.setContent(
      `<div style="padding:5px;z-index:1;">${escapeHtml(title)}</div>`
    )
    infowindowRef.current.open(mapRef.current, marker)
  }, [])

  /**
   * 지도 수동 초기화
   * - Loader.load()로 SDK 로드를 보장한 뒤 kakao.maps.Map 인스턴스 생성
   * - 이미 초기화된 경우 relayout만 실행
   */
  const initializeMap = useCallback(async () => {
    if (!mapDivRef.current) {
      console.warn('[카카오 지도] map 엘리먼트가 아직 준비되지 않았습니다.')
      return false
    }

    if (mapRef.current) {
      mapRef.current.relayout()
      return true
    }

    try {
      const loader = Loader.getInstance({
        appkey: import.meta.env.VITE_KAKAO_MAP_KEY as string,
        libraries: ['services'],
      })
      await loader.load()
    } catch (err) {
      const message = err instanceof Error ? err.message : '카카오 지도 SDK 로드에 실패했습니다.'
      setError(message)
      return false
    }

    const { kakao } = window

    if (!kakao?.maps) {
      setError('카카오 지도 SDK가 로드되지 않았습니다.')
      return false
    }

    const map = new kakao.maps.Map(mapDivRef.current, {
      center: new kakao.maps.LatLng(defaultCenter.current.lat, defaultCenter.current.lng),
      level: initialLevel,
    })

    mapRef.current = map
    infowindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 })

    setError(null)
    setIsInitialized(true)

    // Portal/Modal에서 사이즈 계산 이슈 방지
    // relayout 후 컨트롤 추가 — 초기화 전 크기 기준으로 위치가 잡히는 문제 방지
    setTimeout(() => {
      map.relayout()
      map.setCenter(new kakao.maps.LatLng(defaultCenter.current.lat, defaultCenter.current.lng))
      map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT)
      map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT)
    }, 0)

    return true
  }, [initialLevel])

  const cleanup = useCallback(() => {
    clearMarkers()
    closeInfoWindow()
    mapRef.current = null
    infowindowRef.current = null
    setIsInitialized(false)
    setError(null)
  }, [clearMarkers, closeInfoWindow])

  /** 장소 목록에 대한 마커 렌더링 */
  const renderMarkers = useCallback(
    (places: KakaoPlace[]) => {
      if (!mapRef.current || !window.kakao) return

      const { kakao } = window
      const map = mapRef.current

      clearMarkers()
      closeInfoWindow()

      const bounds = new kakao.maps.LatLngBounds()

      places.forEach((place) => {
        const position = new kakao.maps.LatLng(Number(place.y), Number(place.x))
        const marker = new kakao.maps.Marker({ position, map })

        kakao.maps.event.addListener(marker, 'mouseover', () => {
          openInfoWindow(marker, place.place_name)
        })
        kakao.maps.event.addListener(marker, 'mouseout', () => {
          closeInfoWindow()
        })

        markersRef.current.push(marker)
        bounds.extend(position)
      })

      if (places.length > 0) {
        map.setBounds(bounds)
      }
    },
    [clearMarkers, closeInfoWindow, openInfoWindow]
  )

  /** 특정 좌표로 지도 중심 이동 */
  const setCenter = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || !window.kakao) return
    const position = new window.kakao.maps.LatLng(lat, lng)
    mapRef.current.setCenter(position)
  }, [])

  /** 특정 장소로 지도 중심 이동 + 줌 레벨 변경 */
  const focusPlace = useCallback((lat: number, lng: number, level = 4) => {
    if (!mapRef.current || !window.kakao) return
    const position = new window.kakao.maps.LatLng(lat, lng)
    mapRef.current.setLevel(level)
    mapRef.current.setCenter(position)
  }, [])

  return {
    /** map div에 연결할 콜백 ref */
    mapElement: setMapElement,
    /** map 인스턴스를 자식에게 전달하는 Context Provider */
    MapProvider: KakaoMapContext.Provider,
    isInitialized,
    error,
    initializeMap,
    renderMarkers,
    closeInfoWindow,
    openInfoWindow,
    setCenter,
    focusPlace,
    cleanup,
  }
}
