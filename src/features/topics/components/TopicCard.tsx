import { Badge, Card, LikeButton, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

import { useDeleteTopic, useLikeTopic } from '../hooks'

type TopicCardProps = {
  title: string
  topicTypeLabel: string
  description: string
  createdByNickname: string
  likeCount: number
  isLiked?: boolean
  isLikeDisabled?: boolean
  canDelete?: boolean
  gatheringId?: number
  meetingId?: number
  topicId?: number
}

export default function TopicCard({
  title,
  topicTypeLabel,
  description,
  createdByNickname,
  likeCount,
  isLiked = false,
  isLikeDisabled = false,
  canDelete = false,
  gatheringId,
  meetingId,
  topicId,
}: TopicCardProps) {
  const { openConfirm, openAlert, openError } = useGlobalModalStore()
  const deleteMutation = useDeleteTopic()
  const likeMutation = useLikeTopic()

  const handleDelete = async () => {
    if (!gatheringId || !meetingId || !topicId) {
      openError('삭제 실패', '주제 삭제에 필요한 정보가 없습니다.')
      return
    }

    const confirmed = await openConfirm('주제 삭제', '정말 이 주제를 삭제하시겠습니까?', {
      confirmText: '삭제',
      variant: 'danger',
    })

    if (!confirmed) {
      return
    }

    deleteMutation.mutate(
      { gatheringId, meetingId, topicId },
      {
        onSuccess: () => {
          openAlert('삭제 완료', '주제가 삭제되었습니다.')
        },
        onError: (error) => {
          openError('삭제 실패', error.userMessage)
        },
      }
    )
  }

  const handleLike = () => {
    if (!gatheringId || !meetingId || !topicId) {
      return
    }

    if (likeMutation.isPending) return

    likeMutation.mutate({ gatheringId, meetingId, topicId })
  }
  return (
    <Card className="p-medium flex flex-col gap-small">
      <div className="flex justify-between items-start">
        <div className="flex gap-xsmall items-center">
          <p className="text-black typo-subtitle3">{title}</p>
          <Badge size="small" color="grey">
            {topicTypeLabel}
          </Badge>
        </div>
        {canDelete && (
          <TextButton onClick={handleDelete} disabled={deleteMutation.isPending}>
            삭제하기
          </TextButton>
        )}
      </div>
      <p className="typo-body4 text-grey-700">{description}</p>
      <div className="flex justify-between items-end">
        <p className="typo-body6 text-grey-600">제안 : {createdByNickname}</p>
        <LikeButton
          count={likeCount}
          isLiked={isLiked}
          disabled={isLikeDisabled}
          isPending={likeMutation.isPending}
          onClick={handleLike}
        />
      </div>
    </Card>
  )
}
