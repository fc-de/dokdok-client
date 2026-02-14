/**
 * @file usePlaceSearch.ts
 * @description 장소 검색 모달의 상태 관리 훅
 *
 * SDK 로드, 지도 초기화, 장소 검색 API 등 모든 비동기 로직과 에러를
 * 하나의 searchState로 추상화하여 UI가 선언적으로 상태를 수신할 수 있도록 합니다.
 *
 * searchState:
 *   - 'idle'       초기 화면 (검색 전)
 *   - 'searching'  검색 중 (리스트 스켈레톤 표시)
 *   - 'hasResults' 검색 결과 있음 (지도 + 리스트 표시)
 *   - 'noResults'  일치하는 결과 없음
 *   - 'error'      SDK 로드 실패 또는 검색 API 오류
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import type { KakaoMap, KakaoPlace } from '@/features/kakaomap'
import { useKakaoLoader, useKakaoPlaceSearch } from '@/features/kakaomap'

export type PlaceSearchState = 'idle' | 'searching' | 'hasResults' | 'noResults' | 'error'

type SelectedPlace = {
  name: string
  address: string
  latitude: number
  longitude: number
}

export type UsePlaceSearchOptions = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPlace: (place: SelectedPlace) => void
}

export function usePlaceSearch({ open, onOpenChange, onSelectPlace }: UsePlaceSearchOptions) {
  const [sdkLoading, sdkError] = useKakaoLoader()

  const [searchState, setSearchState] = useState<PlaceSearchState>('idle')
  const [mapInstance, setMapInstance] = useState<KakaoMap | null>(null)
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null)

  // 카카오 Map SDK는 마운트 시점의 컨테이너 크기로 지도를 초기화합니다.
  // display:none 상태에서 마운트되면 크기가 0으로 계산되어 지도가 깨지므로,
  // 첫 검색이 실행되어 지도 영역이 화면에 보이는 시점에 처음 마운트합니다.
  const [hasBeenSearched, setHasBeenSearched] = useState(false)

  const keywordRef = useRef<HTMLInputElement>(null)

  const { places, error: searchError, search, reset } = useKakaoPlaceSearch({
    onSearchSuccess: (results) => {
      setSearchState(results.length > 0 ? 'hasResults' : 'noResults')
    },
    onSearchError: () => {
      setSearchState('error')
    },
  })

  // SDK 로드 실패 시 error 상태로 전환
  const effectiveSearchState: PlaceSearchState = sdkError ? 'error' : searchState

  // places 또는 mapInstance가 준비되면 지도 범위를 자동 조정
  // (첫 검색 시 places가 먼저 오거나 mapInstance가 먼저 올 수 있으므로 둘 다 dep에 포함)
  useEffect(() => {
    if (!mapInstance || places.length === 0) return

    const { kakao } = window
    const bounds = new kakao.maps.LatLngBounds()
    places.forEach((p) => bounds.extend(new kakao.maps.LatLng(Number(p.y), Number(p.x))))
    mapInstance.setBounds(bounds)
  }, [mapInstance, places])

  const resetState = useCallback(() => {
    setSearchState('idle')
    setHoveredPlaceId(null)
    setHasBeenSearched(false)
    setMapInstance(null)
    reset()
  }, [reset])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      // 한국어 등 IME 입력 중 composition 이벤트는 무시
      if (e.nativeEvent.isComposing) return
      e.preventDefault()

      const keyword = keywordRef.current?.value.trim() ?? ''
      if (!keyword) return

      // SDK 로드 실패 상태에서는 검색 불가
      if (sdkError) return

      // SDK 아직 로드 중이라면 무시
      if (sdkLoading) return

      reset()
      setHoveredPlaceId(null)
      setSearchState('searching')
      setHasBeenSearched(true)
      search(keyword)
    },
    [sdkLoading, sdkError, reset, search]
  )

  const handlePlaceClick = useCallback(
    (place: KakaoPlace) => {
      if (mapInstance) {
        mapInstance.setCenter(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)))
      }
      onSelectPlace({
        name: place.place_name,
        address: place.road_address_name || place.address_name,
        latitude: Number(place.y),
        longitude: Number(place.x),
      })
      onOpenChange(false)
      resetState()
    },
    [mapInstance, onSelectPlace, onOpenChange, resetState]
  )

  const handlePlaceFocus = useCallback(
    (place: KakaoPlace) => {
      if (!mapInstance) return
      mapInstance.setLevel(4)
      mapInstance.setCenter(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)))
    },
    [mapInstance]
  )

  const handleClose = useCallback(() => {
    onOpenChange(false)
    resetState()
  }, [onOpenChange, resetState])

  // error 상태에서 노출할 메시지 — SDK 오류 우선
  const errorMessage = sdkError?.message ?? searchError ?? '오류가 발생했습니다. 다시 시도해주세요.'

  // Map 컴포넌트를 DOM에 마운트할지 여부
  // error 상태는 인스턴스 보존이 불필요하므로 unmount (다음 검색 시 새로 초기화)
  const isMapMounted = open && hasBeenSearched && effectiveSearchState !== 'error'

  // 지도 영역을 화면에 표시할지 여부 (isMapMounted가 true일 때만 유의미)
  // noResults에서는 Map 인스턴스를 유지한 채 CSS로만 숨김 → 재검색 시 재초기화 없이 재사용
  const isMapVisible = effectiveSearchState === 'searching' || effectiveSearchState === 'hasResults'

  return {
    searchState: effectiveSearchState,
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
  }
}
