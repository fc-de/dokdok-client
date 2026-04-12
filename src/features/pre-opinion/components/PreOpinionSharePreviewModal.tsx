import { useKeywords } from '@/features/keywords'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

import { PreOpinionReviewContent, type ReviewTopicItem } from './PreOpinionReviewContent'

export type SharePreviewTopic = ReviewTopicItem

interface PreOpinionSharePreviewModalProps {
  open: boolean
  onClose: () => void
  rating: number
  keywordIds: number[]
  topics: ReviewTopicItem[]
  isSubmitting: boolean
  onConfirmShare: () => Promise<void>
  onGoToPreOpinions: () => void
  onGoToBook: () => void
}

/**
 * 사전 의견 공유 전 미리보기 모달
 *
 * @description
 * 공유하기 버튼 클릭 시 작성한 내용을 한번 보여주고,
 * 확인 후 실제 공유(제출)를 진행합니다.
 * 공유 성공 시 전역 confirm 모달로 완료 안내를 표시합니다.
 *
 * @example
 * ```tsx
 * <PreOpinionSharePreviewModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   rating={4.5}
 *   keywordIds={[1, 2, 3]}
 *   topics={topics}
 *   isSubmitting={false}
 *   onConfirmShare={handleShare}
 *   onGoToPreOpinions={() => navigate(ROUTES.PRE_OPINIONS(gatheringId, meetingId))}
 *   onGoToBook={() => navigate(ROUTES.BOOK_DETAIL(bookId))}
 * />
 * ```
 */
function PreOpinionSharePreviewModal({
  open,
  onClose,
  rating,
  keywordIds,
  topics,
  isSubmitting,
  onConfirmShare,
  onGoToPreOpinions,
  onGoToBook,
}: PreOpinionSharePreviewModalProps) {
  const { openConfirm } = useGlobalModalStore()
  const { data: keywordsData } = useKeywords()

  const bookKeywords =
    keywordsData?.keywords.filter(
      (k) => k.type === 'BOOK' && k.isSelectable && keywordIds.includes(k.id)
    ) ?? []

  const impressionKeywords =
    keywordsData?.keywords.filter(
      (k) => k.type === 'IMPRESSION' && k.isSelectable && keywordIds.includes(k.id)
    ) ?? []

  const handleShare = async () => {
    try {
      await onConfirmShare()
      onClose()
      const confirmed = await openConfirm(
        '사전 의견이 공유됐어요',
        '내 책장 기록에도 함께 반영됐어요',
        { confirmText: '확인', cancelText: '내 책장 보기' }
      )
      if (confirmed) {
        onGoToPreOpinions()
      } else {
        onGoToBook()
      }
    } catch {
      // 오류는 페이지에서 openError로 처리됨
    }
  }

  return (
    <Modal open={open} onOpenChange={(open) => !open && onClose()}>
      <ModalContent variant="wide">
        <ModalHeader>
          <ModalTitle>사전 의견 공유하기</ModalTitle>
          <p className="typo-body2 text-grey-600 mt-xtiny">
            이 내용으로 공유할까요? 사전 의견을 공유하면 수정할 수 없어요.
          </p>
        </ModalHeader>
        <ModalBody>
          <PreOpinionReviewContent
            rating={rating}
            bookKeywords={bookKeywords}
            impressionKeywords={impressionKeywords}
            topics={topics}
          />
        </ModalBody>
        <ModalFooter variant="full">
          <Button className="w-full" onClick={handleShare} disabled={isSubmitting}>
            {isSubmitting ? '공유 중...' : '공유하기'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PreOpinionSharePreviewModal
