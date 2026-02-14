/**
 * @file kakaoMap.types.ts
 * @description 카카오 Maps SDK 타입 정의
 * @note 외부 API 응답 스펙을 따르기 위해 snake_case 사용
 */

/* eslint-disable @typescript-eslint/naming-convention */

// ─── 카카오 장소 검색 응답 타입 ──────────────────────────────────────────

/** 카카오 장소 검색 응답 문서 타입 */
export type KakaoPlace = {
  /** 장소명, 업체명 */
  place_name: string
  /** 전체 지번 주소 */
  address_name: string
  /** 전체 도로명 주소 */
  road_address_name: string
  /** X 좌표값, 경도(longitude) */
  x: string
  /** Y 좌표값, 위도(latitude) */
  y: string
  /** 장소 ID */
  id: string
  /** 카테고리 그룹 코드 */
  category_group_code: string
  /** 카테고리 그룹명 */
  category_group_name: string
  /** 카테고리 이름 */
  category_name: string
  /** 전화번호 */
  phone: string
  /** 장소 상세페이지 URL */
  place_url: string
  /** 중심좌표까지의 거리 (단, x,y 파라미터를 준 경우에만 존재) */
  distance?: string
}

/** 카카오 장소 검색 API 응답 메타 정보 */
export type KakaoSearchMeta = {
  total_count: number
  pageable_count: number
  is_end: boolean
  same_name?: {
    region: string[]
    keyword: string
    selected_region: string
  }
}

/** 카카오 장소 검색 API 응답 타입 */
export type KakaoSearchResponse = {
  documents: KakaoPlace[]
  meta: KakaoSearchMeta
}

/** 카카오 장소 검색 API 요청 파라미터 */
export type KakaoSearchParams = {
  query: string
  category_group_code?: string
  x?: string
  y?: string
  radius?: number
  page?: number
  size?: number
  sort?: 'distance' | 'accuracy'
}

// ─── 카카오 Maps SDK 내부 타입 ────────────────────────────────────────────

export interface KakaoLatLng {
  getLat(): number
  getLng(): number
}

export interface KakaoLatLngBounds {
  extend(latlng: KakaoLatLng): void
  isEmpty(): boolean
}

/** 카카오 SDK Size 객체 */
export interface KakaoSize {
  width: number
  height: number
}

/** 카카오 SDK Point 객체 */
export interface KakaoPoint {
  x: number
  y: number
}

/** kakao.maps.MarkerImage 인스턴스 */
export type KakaoSdkMarkerImage = object

/** MarkerImage 생성 옵션 */
export interface KakaoMarkerImageOptions {
  alt?: string
  coords?: string
  offset?: KakaoPoint
  shape?: 'default' | 'rect' | 'circle' | 'poly'
  spriteOrigin?: KakaoPoint
  spriteSize?: KakaoSize
}

export interface KakaoMarker {
  setMap(map: KakaoMap | null): void
  getPosition(): KakaoLatLng
  setPosition(latlng: KakaoLatLng): void
  setImage(image: KakaoSdkMarkerImage): void
  setTitle(title: string): void
  setDraggable(draggable: boolean): void
  setClickable(clickable: boolean): void
  setZIndex(zIndex: number): void
  setOpacity(opacity: number): void
}

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void
  setContent(content: HTMLElement | string): void
  setPosition(latlng: KakaoLatLng): void
  getContent(): HTMLElement | string
}

export interface KakaoCustomOverlayOptions {
  map?: KakaoMap
  position: KakaoLatLng
  content?: HTMLElement | string
  zIndex?: number
  /** 마커 기준 Y 오프셋 (0: 하단, 1: 중앙, 2: 상단) */
  yAnchor?: number
  xAnchor?: number
}

export interface KakaoInfoWindow {
  open(map: KakaoMap, marker: KakaoMarker): void
  close(): void
  setContent(content: string): void
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void
  setLevel(level: number): void
  setBounds(bounds: KakaoLatLngBounds): void
  relayout(): void
  addControl(control: KakaoControl, position: number): void
  removeControl(control: KakaoControl): void
}

export type KakaoControl = object

export interface KakaoMapOptions {
  center: KakaoLatLng
  level?: number
}

export interface KakaoMarkerOptions {
  position: KakaoLatLng
  map?: KakaoMap
  image?: KakaoSdkMarkerImage
  title?: string
  draggable?: boolean
  clickable?: boolean
  zIndex?: number
  opacity?: number
}

export interface KakaoInfoWindowOptions {
  zIndex?: number
  content?: string
}

export interface KakaoPlacesService {
  keywordSearch(
    keyword: string,
    callback: (data: KakaoPlace[], status: string) => void,
    options?: Partial<KakaoSearchParams>
  ): void
}

// ─── window.kakao 글로벌 타입 선언 ────────────────────────────────────────

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap
        LatLng: new (lat: number, lng: number) => KakaoLatLng
        LatLngBounds: new () => KakaoLatLngBounds
        Size: new (width: number, height: number) => KakaoSize
        Point: new (x: number, y: number) => KakaoPoint
        MarkerImage: new (
          src: string,
          size: KakaoSize,
          options?: KakaoMarkerImageOptions
        ) => KakaoSdkMarkerImage
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker
        CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay
        InfoWindow: new (options?: KakaoInfoWindowOptions) => KakaoInfoWindow
        MapTypeControl: new () => KakaoControl
        ZoomControl: new () => KakaoControl
        ControlPosition: {
          TOPRIGHT: number
          RIGHT: number
          TOP: number
          TOPLEFT: number
          LEFT: number
          BOTTOMLEFT: number
          BOTTOM: number
          BOTTOMRIGHT: number
        }
        event: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addListener(target: object, type: string, handler: (...args: any[]) => void): void
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          removeListener(target: object, type: string, handler: (...args: any[]) => void): void
        }
        services: {
          Places: new () => KakaoPlacesService
          Status: {
            OK: string
            ZERO_RESULT: string
            ERROR: string
          }
        }
        load(callback: () => void): void
      }
    }
  }
}
