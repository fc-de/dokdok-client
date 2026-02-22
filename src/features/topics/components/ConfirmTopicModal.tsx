import { useState } from 'react'

import { ConfirmModalTopicCard, TopicListSkeleton } from '@/features/topics/components'
import { useConfirmTopics, useProposedTopics } from '@/features/topics/hooks'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  TextButton,
} from '@/shared/ui'
import { NumberedCheckboxGroup } from '@/shared/ui/NumberedCheckbox'
import { useGlobalModalStore } from '@/store'

export type ConfirmTopicModalProps = {
  /** 모달 열림 상태 */
  open: boolean
  /** 모달 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  gatheringId: number
  meetingId: number
}

export default function ConfirmTopicModal({
  open,
  onOpenChange,
  gatheringId,
  meetingId,
}: ConfirmTopicModalProps) {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])

  const { openConfirm, openError } = useGlobalModalStore()
  const confirmMutation = useConfirmTopics()

  // 모달 전용 독립 데이터 - 한 번에 전체 로드 (pageSize 크게)
  const { data: topicsInfiniteData, isLoading } = useProposedTopics({
    gatheringId,
    meetingId,
    pageSize: 100,
  })

  const topics = topicsInfiniteData?.pages.flatMap((page) => page.items) ?? []

  const resetSelected = () => {
    setSelectedTopicIds([])
  }

  const handleClose = () => {
    resetSelected()
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    const confirmed = await openConfirm(
      '주제 확정',
      `한 번 확정하면 이후에는 순서를 바꾸거나 주제를 추가하기 어려워요. \n이대로 확정할까요?`,
      { confirmText: '확정하기' }
    )

    if (!confirmed) return

    confirmMutation.mutate(
      {
        gatheringId,
        meetingId,
        topicIds: selectedTopicIds.map(Number),
      },
      {
        onSuccess: () => {
          handleClose()
        },
        onError: (error) => {
          openError('확정 실패', error.userMessage)
        },
      }
    )
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent variant="wide" onInteractOutside={(e) => e.preventDefault()}>
        <ModalHeader className="items-start">
          <ModalTitle>
            <div className="flex flex-col gap-base">
              <p>주제 확정하기</p>
              <div className="flex justify-between items-center">
                <p className="typo-subtitle4 text-grey-600">확정할 주제를 순서대로 선택해주세요</p>
                {selectedTopicIds.length > 0 && (
                  <TextButton className="-mr-base" onClick={resetSelected}>
                    전체해제
                  </TextButton>
                )}
              </div>
            </div>
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-base">
          {isLoading ? (
            <TopicListSkeleton count={5} />
          ) : (
            <NumberedCheckboxGroup
              value={selectedTopicIds}
              onChange={setSelectedTopicIds}
              className="flex flex-col gap-small"
            >
              {topics.map((topic) => (
                <ConfirmModalTopicCard
                  key={topic.topicId}
                  title={topic.title}
                  topicTypeLabel={topic.topicTypeLabel}
                  description={topic.description}
                  createdByNickname={topic.createdByInfo.nickname}
                  topicId={topic.topicId}
                  isSelected={selectedTopicIds.includes(topic.topicId.toString())}
                />
              ))}
            </NumberedCheckboxGroup>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="flex gap-large justify-between items-start flex-1">
            <p className="typo-body4 text-grey-700 shrink-0">
              선택 <span className="typo-body3 text-black">{selectedTopicIds.length}</span>개
            </p>
            <Button
              size="medium"
              className="w-full"
              disabled={selectedTopicIds.length === 0 || confirmMutation.isPending}
              onClick={handleConfirm}
            >
              확정하기
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
