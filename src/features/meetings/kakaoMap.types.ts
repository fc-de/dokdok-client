/**
 * @file kakao.types.ts
 * @description 카카오 로컬 API 관련 타입 정의
 * @note 외부 API 응답 스펙을 따르기 위해 snake_case 사용
 */

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * 카카오 장소 검색 응답 문서 타입
 */
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

/**
 * 카카오 장소 검색 API 응답 메타 정보
 */
export type KakaoSearchMeta = {
  /** 검색된 문서 수 */
  total_count: number
  /** total_count 중 노출 가능 문서 수 */
  pageable_count: number
  /** 현재 페이지가 마지막 페이지인지 여부 */
  is_end: boolean
  /** 질의어의 지역 및 키워드 분석 정보 */
  same_name?: {
    /** 질의어에서 인식된 지역의 리스트 */
    region: string[]
    /** 질의어에서 지역 정보를 제외한 키워드 */
    keyword: string
    /** 인식된 지역 리스트 중, 현재 검색에 사용된 지역 정보 */
    selected_region: string
  }
}

/**
 * 카카오 장소 검색 API 응답 타입
 */
export type KakaoSearchResponse = {
  /** 검색 결과 문서 리스트 */
  documents: KakaoPlace[]
  /** 응답 관련 정보 */
  meta: KakaoSearchMeta
}

/**
 * 카카오 장소 검색 API 요청 파라미터
 */
export type KakaoSearchParams = {
  /** 검색을 원하는 질의어 (필수) */
  query: string
  /** 카테고리 그룹 코드 (선택) */
  category_group_code?: string
  /** 중심 좌표의 X 혹은 경도(longitude) */
  x?: string
  /** 중심 좌표의 Y 혹은 위도(latitude) */
  y?: string
  /** 중심 좌표부터의 반경거리. 미터(m) 단위 */
  radius?: number
  /** 결과 페이지 번호 (1~45, 기본값: 1) */
  page?: number
  /** 한 페이지에 보여질 문서의 개수 (1~15, 기본값: 15) */
  size?: number
  /** 결과 정렬 순서 (distance: 거리순, accuracy: 정확도순) */
  sort?: 'distance' | 'accuracy'
}
