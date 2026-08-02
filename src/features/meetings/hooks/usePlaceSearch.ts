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

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

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
  bottomOffset?: number
}

export function usePlaceSearch({
  open,
  onOpenChange,
  onSelectPlace,
  bottomOffset = 0,
}: UsePlaceSearchOptions) {
  const [sdkLoading, sdkError] = useKakaoLoader()

  const [searchState, setSearchState] = useState<PlaceSearchState>('idle')
  const [mapInstance, setMapInstance] = useState<KakaoMap | null>(null)
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null)

  // ref로 유지해 setBounds effect의 dep에서 제외 — 높이 변경 시 지도를 재초기화하지 않음
  const bottomOffsetRef = useRef(bottomOffset)
  useLayoutEffect(() => {
    bottomOffsetRef.current = bottomOffset
  })

  // 카카오 Map SDK는 마운트 시점의 컨테이너 크기로 지도를 초기화합니다.
  // display:none 상태에서 마운트되면 크기가 0으로 계산되어 지도가 깨지므로,
  // 첫 검색이 실행되어 지도 영역이 화면에 보이는 시점에 처음 마운트합니다.
  const [hasBeenSearched, setHasBeenSearched] = useState(false)

  const keywordRef = useRef<HTMLInputElement>(null)

  const {
    places,
    error: searchError,
    search,
    reset,
  } = useKakaoPlaceSearch({
    onSearchSuccess: (results) => {
      setSearchState(results.length > 0 ? 'hasResults' : 'noResults')
    },
    onSearchError: () => {
      setSearchState('error')
    },
  })

  const effectiveSearchState: PlaceSearchState = sdkError ? 'error' : searchState

  // places와 mapInstance 중 어느 쪽이 먼저 준비될지 모르므로 둘 다 dep에 포함
  useEffect(() => {
    if (!mapInstance || places.length === 0) return

    const { kakao } = window
    const bounds = new kakao.maps.LatLngBounds()
    places.forEach((p) => bounds.extend(new kakao.maps.LatLng(Number(p.y), Number(p.x))))
    mapInstance.setBounds(bounds, 0, 0, bottomOffsetRef.current, 0)
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

      if (sdkError) return
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
      if (bottomOffsetRef.current > 0) {
        mapInstance.panBy(0, bottomOffsetRef.current / 2)
      }
    },
    [mapInstance]
  )

  const handleClose = useCallback(() => {
    onOpenChange(false)
    resetState()
  }, [onOpenChange, resetState])

  const errorMessage = sdkError?.message ?? searchError ?? '오류가 발생했습니다. 다시 시도해주세요.'

  // error 시에는 unmount해 다음 검색 시 새로 초기화
  const isMapMounted = open && hasBeenSearched && effectiveSearchState !== 'error'
  // noResults 시 hidden으로만 숨겨 인스턴스를 유지 → 재검색 시 재초기화 없이 재사용
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
