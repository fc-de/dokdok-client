import { useState } from 'react'

import { Button } from '@/shared/ui/Button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/Modal'
import { useGlobalModalStore } from '@/store'

import { useCreateBookReview } from '../hooks'
import { BookReviewForm, type BookReviewFormValues } from './BookReviewForm'

/**
 * 책 평가하기 모달
 *
 * @description 별점과 키워드를 선택하여 책을 평가하는 모달
 *
 * @example
 * ```tsx
 * <BookReviewModal
 *   bookId={1}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export interface BookReviewModalProps {
  bookId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookReviewModal({ bookId, open, onOpenChange }: BookReviewModalProps) {
  const [formValues, setFormValues] = useState<BookReviewFormValues>({
    rating: 0,
    keywordIds: [],
    isValid: false,
  })
  const { mutate: submitReview, isPending } = useCreateBookReview(bookId)
  const { openError } = useGlobalModalStore()

  const handleSubmit = () => {
    if (formValues.rating === 0) {
      openError('별점 필요', '별점을 선택해주세요.')
      return
    }

    submitReview(
      { rating: formValues.rating, keywordIds: formValues.keywordIds },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (error) => {
          openError('평가 저장 실패', error.message)
        },
      }
    )
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="wide">
        <ModalHeader>
          <ModalTitle>책 평가하기</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <BookReviewForm onChange={setFormValues} />
        </ModalBody>
        <ModalFooter variant="full">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!formValues.isValid || isPending}
          >
            {isPending ? '저장 중...' : '저장하기'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
