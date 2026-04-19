/**
 * @file useBookLogDeleteActions.ts
 * @description 감상 기록 목록에서 사용하는 삭제 액션 뮤테이션 훅 모음
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteMyPreOpinionAnswer } from '@/features/pre-opinion/preOpinion.api'
import { deletePersonalRetrospective } from '@/features/retrospectives/personal/personalRetrospective.api'
import { showToast } from '@/shared/lib/toast'

import { deleteBookRecord } from '../book.api'
import { bookRecordsKeys } from './useBookRecords'

/**
 * 감상 기록 목록에서 각 기록 유형별 삭제 액션을 제공하는 훅
 *
 * 삭제 성공 시 공통으로 `bookRecordsKeys.all`을 무효화합니다.
 *
 * @param bookId - 개인 책 ID
 *
 * @example
 * ```tsx
 * const { deletePersonalRecord, deletePreOpinion, deleteRetrospective } =
 *   useBookLogDeleteActions(bookId)
 *
 * deletePersonalRecord(recordId)
 * deletePreOpinion({ gatheringId, meetingId })
 * deleteRetrospective(meetingId)
 * ```
 */
export function useBookLogDeleteActions(bookId: number) {
  const queryClient = useQueryClient()

  const invalidateBookRecords = () =>
    queryClient.invalidateQueries({ queryKey: bookRecordsKeys.all })

  const { mutate: deletePersonalRecord } = useMutation({
    mutationFn: (recordId: number) => deleteBookRecord(bookId, recordId),
    onSuccess: () => {
      invalidateBookRecords()
      showToast('기록이 삭제되었어요.')
    },
    onError: () => toast.error('기록 삭제에 실패했어요. 다시 시도해주세요.'),
  })

  const { mutate: deletePreOpinion } = useMutation({
    mutationFn: (params: { gatheringId: number; meetingId: number }) =>
      deleteMyPreOpinionAnswer(params),
    onSuccess: invalidateBookRecords,
    onError: () => toast.error('사전 의견 삭제에 실패했어요. 다시 시도해주세요.'),
  })

  const { mutate: deleteRetrospective } = useMutation({
    mutationFn: (meetingId: number) => deletePersonalRetrospective(meetingId),
    onSuccess: invalidateBookRecords,
    onError: () => toast.error('회고 삭제에 실패했어요. 다시 시도해주세요.'),
  })

  return { deletePersonalRecord, deletePreOpinion, deleteRetrospective }
}
