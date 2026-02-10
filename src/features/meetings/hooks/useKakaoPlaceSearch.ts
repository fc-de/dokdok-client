/**
 * @file useKakaoPlaceSearch.ts
 * @description Kakao Places API 검색 로직 훅
 */

import { useRef, useState } from 'react'

import type { KakaoPlace } from '../kakaoMap.types'

export type UseKakaoPlaceSearchOptions = {
  /** 검색 성공 콜백 */
  onSearchSuccess?: (places: KakaoPlace[]) => void
}

export function useKakaoPlaceSearch({ onSearchSuccess }: UseKakaoPlaceSearchOptions = {}) {
  const [places, setPlaces] = useState<KakaoPlace[]>([])
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placesServiceRef = useRef<any>(null)

  // 검색 실행
  const search = (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      return false
    }

    const kakao = window.kakao
    if (!kakao?.maps?.services) {
      return false
    }

    // Places 서비스
    if (!placesServiceRef.current) {
      placesServiceRef.current = new kakao.maps.services.Places()
    }

    const ps = placesServiceRef.current

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ps.keywordSearch(searchKeyword, (data: KakaoPlace[], status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        setError(null)
        setPlaces(data)
        onSearchSuccess?.(data)
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        setError(null)
        setPlaces([])
        onSearchSuccess?.([])
      } else {
        // Status.ERROR: 일반적인 검색 오류 (400 Bad Request 등)
        const message = '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (400 Bad Request)'
        setError(message)
        setPlaces([])
        onSearchSuccess?.([])
        console.error('[카카오 장소 검색] 오류 발생 - status:', status, '\n', message)
      }
    })

    return true
  }

  // 검색 상태 초기화
  const reset = () => {
    setPlaces([])
    setError(null)
    placesServiceRef.current = null
  }

  return {
    places,
    error,
    search,
    reset,
  }
}
