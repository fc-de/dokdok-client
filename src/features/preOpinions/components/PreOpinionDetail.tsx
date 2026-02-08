import { useAuth } from '@/features/auth'
import { StarRate } from '@/shared/components/StarRate'
import { Avatar, AvatarFallback, AvatarImage, Badge, TextButton } from '@/shared/ui'
import { Chip } from '@/shared/ui/Chip'
import { useGlobalModalStore } from '@/store'

import { useDeleteMyPreOpinionAnswer } from '../hooks/useDeleteMyPreOpinionAnswer'
import { ROLE_TO_AVATAR_VARIANT } from '../preOpinions.constants'
import type { PreOpinionMember, PreOpinionTopic } from '../preOpinions.types'

type PreOpinionDetailProps = {
  member: PreOpinionMember
  topics: PreOpinionTopic[]
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
      onError: (error) => openError('에러', error.userMessage),
    })
  }

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
      {/* 책 평가 섹션 */}
      {bookReview && (
        <section className="flex flex-col gap-small">
          {/* 별점 */}
          <div>
            <p className="typo-body4 text-grey-600 mb-tiny">별점</p>
            <div className="flex gap-small items-center">
              <StarRate rating={bookReview.rating} size={36} />
              <span className="typo-subtitle5 text-black">{bookReview.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* 책 키워드 */}
          {bookReview.keywordInfo.filter((k) => k.type === 'BOOK').length > 0 && (
            <div>
              <p className="typo-body4 text-grey-600 mb-tiny">책 키워드</p>
              <div className="flex gap-tiny flex-wrap">
                {bookReview.keywordInfo
                  .filter((k) => k.type === 'BOOK')
                  .map((keyword) => (
                    <Chip key={keyword.id} variant="success">
                      {keyword.name}
                    </Chip>
                  ))}
              </div>
            </div>
          )}

          {/* 감상 키워드 */}
          {bookReview.keywordInfo.filter((k) => k.type === 'IMPRESSION').length > 0 && (
            <div>
              <p className="typo-body4 text-grey-600 mb-tiny">감상 키워드</p>
              <div className="flex gap-tiny flex-wrap">
                {bookReview.keywordInfo
                  .filter((k) => k.type === 'IMPRESSION')
                  .map((keyword) => (
                    <Chip key={keyword.id} className="bg-blue-100 text-blue-200">
                      {keyword.name}
                    </Chip>
                  ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 주제별 의견 섹션 */}
      {topicOpinions.length > 0 && (
        <section className="flex flex-col gap-[32px]">
          {topics.map((topic) => {
            const opinion = topicOpinions.find((o) => o.topicId === topic.topicId)
            if (!opinion) return null

            return (
              <div key={topic.topicId} className="flex flex-col">
                <div className="flex flex-col gap-small">
                  <div className="flex gap-xsmall items-center">
                    <h4 className="typo-subtitle3 text-black">
                      주제 {topic.confirmOrder}. {topic.title}
                    </h4>
                    <Badge>{topic.topicTypeLabel}</Badge>
                  </div>
                  <p className="typo-body4 text-grey-600">{topic.description}</p>
                </div>
                {opinion.content && (
                  <p className="typo-body1 text-black mt-base">{opinion.content}</p>
                )}
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}

export { PreOpinionDetail }
