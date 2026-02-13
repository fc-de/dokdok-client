/**
 * @file KakaoMapContext.ts
 * @description 카카오 map 인스턴스를 자식 컴포넌트에 전달하는 Context
 *
 * <Map> 컴포넌트가 Provider가 되고, 자식의 마커·인포윈도우 등이
 * useContext(KakaoMapContext)로 map 인스턴스를 획득합니다.
 */

import { createContext, useContext } from 'react'

import type { KakaoMap } from '../kakaoMap.types'

export const KakaoMapContext = createContext<KakaoMap | null>(null)

/** map 인스턴스가 필요한 자식 컴포넌트에서 사용 */
export function useKakaoMapContext(): KakaoMap | null {
  return useContext(KakaoMapContext)
}
