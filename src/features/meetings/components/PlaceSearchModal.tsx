/**
 * @file PlaceSearchModal.tsx
 * @description 카카오 장소 검색 모달 컴포넌트
 */

import { AlertCircle, Search } from 'lucide-react'
import { useEffect, useRef } from 'react'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui'

import { useKakaoMap } from '../hooks/useKakaoMap'
import { useKakaoPlaceSearch } from '../hooks/useKakaoPlaceSearch'
import type { KakaoPlace } from '../kakaoMap.types'
import PlaceList from './PlaceList'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any
  }
}

export type PlaceSearchModalProps = {
  /** 모달 열림 상태 */
  open: boolean
  /** 모달 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  /** 장소 선택 핸들러 */
  onSelectPlace: (place: {
    name: string
    address: string
    latitude: number
    longitude: number
  }) => void
}

export default function PlaceSearchModal({
  open,
  onOpenChange,
  onSelectPlace,
}: PlaceSearchModalProps) {
  // 지도 관리
  const {
    mapElement,
    isInitialized,
    error: mapError,
    initializeMap,
    renderMarkers,
    setCenter,
    cleanup,
  } = useKakaoMap()

  // 장소 검색 관리
  const keywordRef = useRef<HTMLInputElement>(null)
  const {
    places,
    error: searchError,
    search,
    reset,
  } = useKakaoPlaceSearch({
    onSearchSuccess: renderMarkers,
  })

  // 모달 열릴 때 지도 초기화
  useEffect(() => {
    if (open && !isInitialized) {
      initializeMap()
    }
  }, [open, isInitialized, initializeMap])

  // 검색 실행
  const handleSearch = () => {
    const keyword = keywordRef.current?.value || ''
    search(keyword)
  }

  // Enter 키 처리
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  // 장소 선택
  const handlePlaceClick = (place: KakaoPlace) => {
    setCenter(Number(place.y), Number(place.x))

    onSelectPlace({
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      latitude: Number(place.y),
      longitude: Number(place.x),
    })

    onOpenChange(false)
    reset()
    cleanup()
  }

  // 모달 닫기
  const handleClose = () => {
    onOpenChange(false)
    reset()
    cleanup()
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="wide" onEscapeKeyDown={handleClose} onPointerDownOutside={handleClose}>
        <ModalHeader>
          <ModalTitle>장소 검색</ModalTitle>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-base">
          <div className="flex gap-xsmall">
            <Input
              placeholder="장소 또는 주소를 검색해주세요"
              ref={keywordRef}
              onKeyUp={handleKeyUp}
              className="flex-1"
            />
            <Button onClick={handleSearch} size="large" type="button">
              <Search size={18} className="mr-tiny" />
              검색
            </Button>
          </div>

          <div className="flex gap-base h-95">
            {/* 지도 영역 */}
            <div className="relative flex-1">
              <div ref={mapElement} className="w-full h-full rounded-small bg-grey-100" />

              {/* SDK 로드 에러 오버레이 */}
              {mapError && (
                <div className="absolute inset-0 flex items-center justify-center rounded-small bg-grey-50">
                  <div className="text-center text-red-500 px-base">
                    <AlertCircle size={48} className="mx-auto mb-base opacity-70" />
                    <p className="text-sm font-medium">{mapError}</p>
                  </div>
                </div>
              )}

              {/* 검색 전 안내 메시지 오버레이 */}
              {!isInitialized && !mapError && (
                <div className="absolute inset-0 flex items-center justify-center rounded-small bg-grey-50">
                  <div className="text-center text-grey-400">
                    <Search size={48} className="mx-auto mb-base opacity-30" />
                    <p className="text-lg font-medium mb-xsmall">장소를 검색하면</p>
                    <p className="text-sm">지도에 표시됩니다</p>
                  </div>
                </div>
              )}
            </div>

            {/* 장소 리스트 */}
            <div className="flex flex-col w-[300px] shrink-0">
              {searchError && (
                <div className="flex items-start gap-xsmall text-red-500 text-sm p-xsmall mb-xsmall bg-red-50 rounded-small">
                  <AlertCircle size={16} className="mt-[2px] shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}
              <PlaceList places={places} onPlaceClick={handlePlaceClick} />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" outline onClick={handleClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
