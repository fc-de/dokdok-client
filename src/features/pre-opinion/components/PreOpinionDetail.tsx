import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'
import { showToast } from '@/shared/lib/toast'
import { Avatar, AvatarFallback, AvatarImage, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

import { useDeleteMyPreOpinionAnswer } from '../hooks/useDeleteMyPreOpinionAnswer'
import { ROLE_TO_AVATAR_VARIANT } from '../preOpinion.constants'
import type { PreOpinionAnswerTopic, PreOpinionMember } from '../preOpinion.types'
import { PreOpinionReviewContent } from './PreOpinionReviewContent'

type PreOpinionDetailProps = {
  member: PreOpinionMember
  topics: PreOpinionAnswerTopic[]
  gatheringId: number
  meetingId: number
}

/**
 * 사전 의견 상세 (선택된 멤버의 책 평가 + 주제별 의견)
 *
 * @description
 * 선택된 멤버의 책 평가(별점, 키워드)와 주제별 의견을 표시합니다.
 *
 * @example
 * ```tsx
 * <PreOpinionDetail member={selectedMember} topics={topics} />
 * ```
 */
function PreOpinionDetail({ member, topics, gatheringId, meetingId }: PreOpinionDetailProps) {
  const navigate = useNavigate()
  const { data: currentUser } = useAuth()
  const { openConfirm, openError } = useGlobalModalStore()
  const { bookReview, topicOpinions, memberInfo } = member
  const isMyOpinion = currentUser?.userId === memberInfo?.userId
  const deleteMutation = useDeleteMyPreOpinionAnswer({ gatheringId, meetingId })

  const handleDelete = async () => {
    const confirmed = await openConfirm(
      '내 의견 삭제하기',
      '내 의견을 삭제하면 다른 멤버들의 의견을 보는 권한도 함께 사라져요.\n삭제를 진행할까요?',
      { confirmText: '삭제', variant: 'danger' }
    )
    if (!confirmed) return

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        showToast('사전의견 삭제가 완료되었어요.')
        navigate(ROUTES.MEETING_DETAIL(gatheringId, meetingId))
      },
      onError: (error) => openError('에러', error.userMessage),
    })
  }

  const bookKeywords = bookReview?.keywordInfo.filter((k) => k.type === 'BOOK') ?? []
  const impressionKeywords = bookReview?.keywordInfo.filter((k) => k.type === 'IMPRESSION') ?? []
  const topicsWithContent = topics.flatMap((topic) => {
    const opinion = topicOpinions.find((o) => o.topicId === topic.topicId)
    return opinion ? [{ ...topic, content: opinion.content }] : []
  })

  return (
    <div className="flex flex-col gap-xlarge flex-1 mb-[100px]">
      {/* 회원 정보 섹션 */}
      {memberInfo && (
        <div className="flex justify-between items-center">
          <div className="flex gap-base items-center">
            <Avatar variant={ROLE_TO_AVATAR_VARIANT[memberInfo.role]}>
              <AvatarImage src={memberInfo.profileImage} alt={memberInfo.nickname} />
              <AvatarFallback>{memberInfo.nickname[0]}</AvatarFallback>
            </Avatar>
            <h4 className="typo-heading3 text-black">{memberInfo.nickname} 님의 의견</h4>
          </div>
          {isMyOpinion && <TextButton onClick={() => handleDelete()}>내 의견 삭제하기</TextButton>}
        </div>
      )}
      {/* 책 평가 + 주제별 의견 섹션 */}
      {bookReview && (
        <PreOpinionReviewContent
          rating={bookReview.rating}
          bookKeywords={bookKeywords}
          impressionKeywords={impressionKeywords}
          topics={topicsWithContent}
        />
      )}
    </div>
  )
}

export { PreOpinionDetail }
