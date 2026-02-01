/**
 * @file useKakaoMap.ts
 * @description Kakao Maps 지도 및 마커 관리 훅
 */

import { useRef, useState } from 'react'

import type { KakaoPlace } from '../kakaoMap.types'

export type UseKakaoMapOptions = {
  /** 초기 중심 좌표 */
  initialCenter?: { lat: number; lng: number }
  /** 초기 줌 레벨 */
  initialLevel?: number
}

export function useKakaoMap({ initialCenter, initialLevel = 3 }: UseKakaoMapOptions = {}) {
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infowindowRef = useRef<any>(null)

  const defaultCenter = useRef(initialCenter ?? { lat: 37.566826, lng: 126.9786567 })

  // 마커 제거
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })
    markersRef.current = []
  }

  // 인포윈도우 닫기
  const closeInfoWindow = () => {
    infowindowRef.current?.close()
  }

  // HTML escape 유틸리티
  const escapeHtml = (text: string) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // 인포윈도우 열기
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openInfoWindow = (marker: any, title: string) => {
    if (!mapRef.current || !infowindowRef.current) return
    const escapedTitle = escapeHtml(title)
    infowindowRef.current.setContent(`<div style="padding:5px;z-index:1;">${escapedTitle}</div>`)
    infowindowRef.current.open(mapRef.current, marker)
  }

  // 지도 수동 초기화
  const initializeMap = () => {
    if (!mapElement) {
      console.warn('Map element not ready')
      return false
    }

    if (mapRef.current) {
      // 이미 초기화된 경우 relayout만 실행
      mapRef.current.relayout()
      return true
    }

    const kakao = window.kakao

    if (!kakao?.maps) {
      console.error('Kakao Maps SDK not loaded')
      return false
    }

    // 지도 생성
    const map = new kakao.maps.Map(mapElement, {
      center: new kakao.maps.LatLng(defaultCenter.current.lat, defaultCenter.current.lng),
      level: initialLevel,
    })

    mapRef.current = map

    infowindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 })
    setIsInitialized(true)

    // Portal/Modal에서 사이즈 계산 이슈 방지
    setTimeout(() => {
      map.relayout()
      map.setCenter(new kakao.maps.LatLng(defaultCenter.current.lat, defaultCenter.current.lng))
    }, 0)

    return true
  }

  // 지도 정리
  const cleanup = () => {
    clearMarkers()
    closeInfoWindow()
    mapRef.current = null
    infowindowRef.current = null
    setIsInitialized(false)
  }

  // 장소 목록에 대한 마커 렌더링
  const renderMarkers = (places: KakaoPlace[]) => {
    if (!mapRef.current || !window.kakao) return

    const kakao = window.kakao
    const map = mapRef.current

    clearMarkers()
    closeInfoWindow()

    const bounds = new kakao.maps.LatLngBounds()

    places.forEach((place) => {
      const position = new kakao.maps.LatLng(Number(place.y), Number(place.x))

      const marker = new kakao.maps.Marker({
        position,
        map,
      })

      // 마커 hover 이벤트
      kakao.maps.event.addListener(marker, 'mouseover', () => {
        openInfoWindow(marker, place.place_name)
      })
      kakao.maps.event.addListener(marker, 'mouseout', () => {
        closeInfoWindow()
      })

      markersRef.current.push(marker)
      bounds.extend(position)
    })

    // 마커들이 모두 보이도록 bounds 조정
    if (places.length > 0) {
      map.setBounds(bounds)
    }
  }

  // 특정 좌표로 지도 중심 이동
  const setCenter = (lat: number, lng: number) => {
    if (!mapRef.current || !window.kakao) return
    const kakao = window.kakao
    const position = new kakao.maps.LatLng(lat, lng)
    mapRef.current.setCenter(position)
  }

  return {
    mapElement: setMapElement,
    isInitialized,
    initializeMap,
    renderMarkers,
    closeInfoWindow,
    openInfoWindow,
    setCenter,
    cleanup,
  }
}
