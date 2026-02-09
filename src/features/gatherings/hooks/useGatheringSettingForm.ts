import { useCallback, useEffect, useState } from 'react'

import type { GatheringDetailResponse } from '../gatherings.types'

export const MAX_NAME_LENGTH = 12
export const MAX_DESCRIPTION_LENGTH = 150

/**
 * 모임 설정 폼 상태 관리 훅
 *
 * gathering 데이터가 변경되면 폼을 리셋합니다.
 */
export const useGatheringSettingForm = (gathering: GatheringDetailResponse | undefined) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // gathering 데이터가 로드/변경되면 폼 리셋
  const gatheringId = gathering?.gatheringId
  useEffect(() => {
    if (gathering) {
      setName(gathering.gatheringName)
      setDescription(gathering.description ?? '')
    }
    // gatheringId 변경 시에만 리셋
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatheringId])

  const isValid = name.trim().length > 0 && name.length <= MAX_NAME_LENGTH

  const getFormData = useCallback(
    () => ({
      gatheringName: name.trim(),
      description: description.trim() || undefined,
    }),
    [name, description]
  )

  return {
    name,
    setName,
    description,
    setDescription,
    isValid,
    getFormData,
  }
}
