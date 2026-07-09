import { useNavigate } from 'react-router-dom'

import { logger } from '@/api/logger'
import { ROUTES } from '@/shared/constants/routes'
import { useGlobalModalStore } from '@/store'

import { useDeleteBook } from './useDeleteBook'

export function useDeleteBookAction() {
  const navigate = useNavigate()
  const { openConfirm } = useGlobalModalStore()
  const { mutateAsync: deleteBook, isPending: isDeleting } = useDeleteBook()

  const deleteBooks = async (bookIds: number[]) => {
    if (bookIds.length === 0 || isDeleting) return false

    const confirmed = await openConfirm(
      '책 삭제하기',
      '책장 속 책을 삭제하면 해당 책의 감상 기록도 모두 삭제되며,\n이 과정은 되돌릴 수 없어요. 삭제를 진행할까요?',
      {
        confirmText: '삭제',
        variant: 'danger',
      }
    )

    if (!confirmed) return false

    try {
      await deleteBook(bookIds)
      navigate(ROUTES.BOOKS)
      return true
    } catch (error) {
      logger.error(error)
      await openConfirm('삭제 실패', '책 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.', {
        confirmText: '확인',
      })
      return false
    }
  }

  return { deleteBooks, isDeleting }
}
