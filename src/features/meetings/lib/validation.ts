/**
 * @file validation.ts
 * @description 약속 생성 폼 유효성 검사 함수
 */

/**
 * 시작 일시가 종료 일시보다 이전인지 검사
 *
 * @param startDateTime - 시작 일시 (ISO 8601 형식)
 * @param endDateTime - 종료 일시 (ISO 8601 형식)
 *
 * @returns 유효하면 true, 아니면 false
 */
export const isStartBeforeEnd = (startDateTime: string, endDateTime: string): boolean => {
  if (!startDateTime || !endDateTime) return false

  const startDate = new Date(startDateTime)
  const endDate = new Date(endDateTime)

  return startDate < endDate
}

/**
 * 날짜가 과거인지 검사
 *
 * @param date - 검사할 날짜
 *
 * @returns 과거 날짜이면 true, 아니면 false
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  return checkDate < today
}

/**
 * 참가 인원 유효성 검사
 *
 * @param maxParticipants - 최대 참가 인원
 * @param gatheringMaxCount - 모임 전체 최대 인원
 *
 * @returns 유효하면 true, 아니면 false
 */
export const isValidParticipants = (
  maxParticipants: number,
  gatheringMaxCount: number
): boolean => {
  return maxParticipants >= 1 && maxParticipants <= gatheringMaxCount
}
