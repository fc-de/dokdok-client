/**
 * @file RetrospectiveComments.tsx
 * @description 약속회고 댓글 컴포넌트
 */

import { MessageCircleMore } from 'lucide-react'
import { useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import { Avatar, AvatarFallback, AvatarImage, Button, Textarea, TextButton } from '@/shared/ui'

import {
  useCreateRetrospectiveComment,
  useDeleteRetrospectiveComment,
  useRetrospectiveComments,
} from '../hooks'
import { formatToDateWithDay } from '../lib/dateFormatters'
import type { GetCommentsResponse } from '../retrospectives.types'
import RetrospectiveCommentsSkeleton from './RetrospectiveCommentsSkeleton'

type RetrospectiveCommentsProps = {
  /** 약속 ID */
  meetingId: number
  /** 약속 리더 ID (삭제 권한 판단용) */
  meetingLeaderId: number
}

/**
 * 약속회고 댓글 컴포넌트
 *
 * @description
 * 약속회고의 댓글 목록을 표시하고, 댓글 작성 및 삭제 기능을 제공합니다.
 * - 무한 스크롤로 댓글 목록 표시
 * - 약속장 또는 댓글 작성자는 댓글 삭제 가능
 */
export default function RetrospectiveComments({
  meetingId,
  meetingLeaderId,
}: RetrospectiveCommentsProps) {
  const [comment, setComment] = useState('')

  // 현재 로그인 사용자 정보
  const { data: currentUser } = useAuth()
  const currentUserId = currentUser?.userId

  // 댓글 조회
  const {
    data: commentsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRetrospectiveComments({ meetingId })

  const observerRef = useInfiniteScroll(fetchNextPage, {
    hasNextPage,
    isFetchingNextPage,
  })

  // 댓글 작성
  const createMutation = useCreateRetrospectiveComment()

  // 댓글 삭제
  const deleteMutation = useDeleteRetrospectiveComment()

  // 댓글 총 개수
  const totalCount = commentsData?.pages[0]?.totalCount ?? 0

  // 댓글 작성 핸들러
  const handleSubmit = () => {
    if (!comment.trim()) {
      showErrorToast('댓글을 입력해주세요.')
      return
    }

    createMutation.mutate(
      {
        meetingId,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment('')
        },
        onError: (error) => {
          showErrorToast(error.userMessage)
        },
      }
    )
  }

  // 댓글 삭제 핸들러
  const handleDelete = (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return

    deleteMutation.mutate(
      {
        meetingId,
        commentId,
      },
      {
        onSuccess: () => {
          showToast('댓글이 삭제되었습니다.')
        },
        onError: (error) => {
          showErrorToast(error.userMessage)
        },
      }
    )
  }

  // 삭제 권한 확인 (약속장 또는 댓글 작성자)
  const canDelete = (commentUserId: number) => {
    if (!currentUserId) return false
    return currentUserId === meetingLeaderId || currentUserId === commentUserId
  }

  return (
    <div className="mt-[36px]">
      <p className="flex gap-tiny text-grey-600 typo-body2 items-center mb-large">
        <MessageCircleMore size={20} />
        {totalCount}개의 의견
      </p>

      {/* 댓글 작성 폼 */}
      <div className="flex gap-small mb-base">
        <Avatar>
          <AvatarImage src={currentUser?.profileImageUrl ?? ''} alt={currentUser?.nickname ?? ''} />
          <AvatarFallback>{currentUser?.nickname?.slice(0, 1) ?? ''}</AvatarFallback>
        </Avatar>
        <Textarea
          format="comment"
          height={56}
          maxLength={500}
          counter={false}
          placeholder="코멘트는 공백 포함 500자까지 작성할 수 있어요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="flex justify-end mb-base">
        <Button
          className="w-[90px]"
          onClick={handleSubmit}
          disabled={createMutation.isPending || !comment.trim()}
        >
          {createMutation.isPending ? '등록 중...' : '등록'}
        </Button>
      </div>

      {/* 댓글 목록 */}
      {isLoading || !commentsData ? (
        <RetrospectiveCommentsSkeleton />
      ) : totalCount === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-grey-500 typo-body2">아직 작성된 의견이 없습니다.</p>
        </div>
      ) : (
        <>
          <ul>
            {commentsData.pages
              .flatMap((page: GetCommentsResponse) => page.items)
              .map((commentItem) => (
                <li
                  key={commentItem.commentId}
                  className="border-b border-grey-300 py-large flex gap-small last:border-none"
                >
                  <Avatar className="mt-xtiny">
                    <AvatarImage src={commentItem.profileImageUrl} alt={commentItem.nickname} />
                    <AvatarFallback>{commentItem.nickname.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-base flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="typo-subtitle5 text-black">{commentItem.nickname}</p>
                        <p className="typo-body6 text-grey-600">
                          {formatToDateWithDay(commentItem.createdAt)}
                        </p>
                      </div>
                      {canDelete(commentItem.userId) && (
                        <TextButton
                          size="medium"
                          onClick={() => handleDelete(commentItem.commentId)}
                          disabled={deleteMutation.isPending}
                        >
                          삭제
                        </TextButton>
                      )}
                    </div>
                    <div className="typo-body1 text-grey-700 whitespace-pre-wrap">
                      {commentItem.comment}
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          {/* 무한 스크롤 로딩 상태 */}
          {isFetchingNextPage && <RetrospectiveCommentsSkeleton />}

          {/* 무한 스크롤 트리거 */}
          {hasNextPage && !isFetchingNextPage && <div ref={observerRef} className="h-4" />}
        </>
      )}
    </div>
  )
}
