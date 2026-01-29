import { useQuery } from '@tanstack/react-query'

import { checkNickname } from '../user.api'

/**
 * 닉네임 중복 확인 query 훅
 *
 * @description
 * - debounce된 닉네임 값으로 중복 여부를 확인합니다
 * - enabled가 false이거나 닉네임이 2자 미만이면 요청하지 않습니다
 * - 30초 동안 결과를 캐싱합니다
 *
 * @param nickname - 확인할 닉네임
 * @param enabled - 쿼리 활성화 여부 (유효한 형식일 때만 true)
 *
 * @example
 * ```tsx
 * const debouncedNickname = useDebounce(nickname, 500)
 * const isValidFormat = /^[가-힣a-zA-Z0-9]+$/.test(nickname) && nickname.length >= 2
 *
 * const { data, isLoading } = useCheckNickname(debouncedNickname, isValidFormat)
 *
 * if (data?.available) {
 *   // 사용 가능한 닉네임
 * }
 * ```
 */
export function useCheckNickname(nickname: string, enabled: boolean) {
  return useQuery({
    queryKey: ['user', 'check-nickname', nickname],
    queryFn: () => checkNickname(nickname),
    enabled: enabled && nickname.length >= 2, // 2자 이상일 때만 체크
    staleTime: 30 * 1000, // 30초 캐싱
    retry: false, // 에러 발생 시 재시도 안 함
  })
}
