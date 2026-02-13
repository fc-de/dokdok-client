/**
 * @file useKakaoPlaceSearch.ts
 * @description Kakao Places API 검색 로직 훅
 *
 * initializeMap() 완료 후 호출해야 window.kakao.maps.services가 존재합니다.
 */

import { useCallback, useRef, useState } from 'react'

import type { KakaoPlace, KakaoPlacesService } from '../kakaoMap.types'

export type UseKakaoPlaceSearchOptions = {
  /** 검색 성공 콜백 */
  onSearchSuccess?: (places: KakaoPlace[]) => void
  /** 검색 오류 콜백 */
  onSearchError?: (message: string) => void
}

export function useKakaoPlaceSearch({
  onSearchSuccess,
  onSearchError,
}: UseKakaoPlaceSearchOptions = {}) {
  const [places, setPlaces] = useState<KakaoPlace[]>([])
  const [error, setError] = useState<string | null>(null)

  const placesServiceRef = useRef<KakaoPlacesService | null>(null)

  /** 검색 실행 — initializeMap() 완료 후 호출해야 window.kakao.maps.services가 존재함 */
  const search = useCallback(
    (searchKeyword: string) => {
      if (!searchKeyword.trim()) return false

      const { kakao } = window
      if (!kakao?.maps?.services) {
        console.warn('[카카오 장소 검색] SDK가 아직 준비되지 않았습니다.')
        return false
      }

      if (!placesServiceRef.current) {
        placesServiceRef.current = new kakao.maps.services.Places()
      }

      const ps = placesServiceRef.current

      ps.keywordSearch(searchKeyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setError(null)
          setPlaces(data)
          onSearchSuccess?.(data)
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          setError(null)
          setPlaces([])
          onSearchSuccess?.([])
        } else {
          const message = '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          setError(message)
          setPlaces([])
          onSearchError?.(message)
          console.error('[카카오 장소 검색] 오류 발생 - status:', status)
        }
      })

      return true
    },
    [onSearchSuccess, onSearchError]
  )

  /** 검색 상태 초기화 */
  const reset = useCallback(() => {
    setPlaces([])
    setError(null)
    placesServiceRef.current = null
  }, [])

  return {
    places,
    error,
    search,
    reset,
  }
}
