/**
 * @file useKakaoLoader.ts
 * @description 카카오 Maps SDK 로드 상태를 관리하는 훅
 *
 * 내부적으로 Loader.load()를 호출하고 [loading, error] 상태를 반환합니다.
 * loading이 false가 된 후에 <Map> 컴포넌트를 렌더링해야 합니다.
 *
 * @example
 * const [loading, error] = useKakaoLoader()
 * if (loading) return <Spinner />
 * if (error) return <ErrorMessage message={error.message} />
 * return <Map ... />
 */

import { useEffect, useState } from 'react'

import { Loader } from '../lib/kakaoMapApiLoader'

const appkey = import.meta.env.VITE_KAKAO_MAP_KEY

export function useKakaoLoader(): [loading: boolean, error: Error | null] {
  const [state, setState] = useState<[loading: boolean, error: Error | null]>(
    appkey ? [true, null] : [false, new Error('VITE_KAKAO_MAP_KEY 환경변수가 설정되지 않았습니다.')]
  )

  useEffect(() => {
    if (!appkey) return

    const loader = Loader.getInstance({
      appkey,
      libraries: ['services'],
    })

    loader
      .load()
      .then(() => {
        setState([false, null])
      })
      .catch((err: unknown) => {
        setState([
          false,
          err instanceof Error ? err : new Error('카카오 지도 SDK 로드에 실패했습니다.'),
        ])
      })
  }, [])

  return state
}
