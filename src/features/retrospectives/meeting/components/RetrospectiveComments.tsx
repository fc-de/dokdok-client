/**
 * @file RetrospectiveComments.tsx
 * @description 약속회고 댓글 컴포넌트
 */

import { MessageCircleMore } from 'lucide-react'
import type { PointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import { Avatar, AvatarFallback, AvatarImage, Button, Textarea, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

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

const MOBILE_COMMENT_MIN_HEIGHT = 56
const MOBILE_COMMENT_AUTO_MAX_HEIGHT = 124
const MOBILE_COMMENT_DRAG_MAX_HEIGHT = 352

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
  const [isMobileComposerOpen, setIsMobileComposerOpen] = useState(false)
  const [draggedTextareaHeight, setDraggedTextareaHeight] = useState<number | null>(null)
  const commentsHeadingRef = useRef<HTMLParagraphElement>(null)
  const firstCommentRef = useRef<HTMLLIElement>(null)
  const mobileTextareaRef = useRef<HTMLTextAreaElement>(null)
  const resizeStartRef = useRef<{ pointerId: number; clientY: number; height: number } | null>(null)

  // 현재 로그인 사용자 정보
  const { data: currentUser } = useAuth()
  const currentUserId = currentUser?.userId

  // 댓글 조회
  const {
    data: commentsData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRetrospectiveComments({ meetingId })

  const observerRef = useInfiniteScroll(fetchNextPage, {
    hasNextPage,
    isFetchingNextPage,
  })

  const openConfirm = useGlobalModalStore().openConfirm

  // 댓글 작성
  const createMutation = useCreateRetrospectiveComment()

  // 댓글 삭제
  const deleteMutation = useDeleteRetrospectiveComment()

  // 댓글 총 개수
  const totalCount = commentsData?.pages[0]?.totalCount ?? 0

  // 댓글 조회 에러 처리
  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.userMessage)
    }
  }, [isError, error])

  useEffect(() => {
    if (!isMobileComposerOpen) return

    const scrollTarget = firstCommentRef.current ?? commentsHeadingRef.current
    scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    const focusTimer = window.setTimeout(() => {
      mobileTextareaRef.current?.focus()
    }, 300)

    return () => window.clearTimeout(focusTimer)
  }, [isMobileComposerOpen])

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
  const handleDelete = async (commentId: number) => {
    const confirmed = await openConfirm('댓글 삭제', '댓글을 삭제하시겠습니까?')
    if (!confirmed) return

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
    if (currentUserId == null) return false
    return currentUserId === meetingLeaderId || currentUserId === commentUserId
  }

  const handleOpenMobileComposer = () => {
    setDraggedTextareaHeight(null)
    setIsMobileComposerOpen(true)
  }

  const handleCloseMobileComposer = () => {
    mobileTextareaRef.current?.blur()
    setIsMobileComposerOpen(false)
    setDraggedTextareaHeight(null)
  }

  const handleResizeStart = (event: PointerEvent<HTMLButtonElement>) => {
    const height =
      mobileTextareaRef.current?.getBoundingClientRect().height ?? MOBILE_COMMENT_MIN_HEIGHT

    resizeStartRef.current = {
      pointerId: event.pointerId,
      clientY: event.clientY,
      height,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleResizeMove = (event: PointerEvent<HTMLButtonElement>) => {
    const resizeStart = resizeStartRef.current
    if (!resizeStart || resizeStart.pointerId !== event.pointerId) return

    const nextHeight = Math.min(
      MOBILE_COMMENT_DRAG_MAX_HEIGHT,
      Math.max(MOBILE_COMMENT_MIN_HEIGHT, resizeStart.height + resizeStart.clientY - event.clientY)
    )
    setDraggedTextareaHeight(nextHeight)
  }

  const handleResizeEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (resizeStartRef.current?.pointerId === event.pointerId) {
      resizeStartRef.current = null
    }
  }

  return (
    <div className="mt-[36px] max-lg:mt-xlarge max-lg:px-5 max-lg:pb-24">
      <p
        ref={commentsHeadingRef}
        className="mb-large flex items-center gap-tiny text-grey-600 typo-body2 max-lg:mb-0 max-lg:typo-caption1"
      >
        <MessageCircleMore size={20} />
        {totalCount}개의 의견
      </p>

      {/* 데스크톱 댓글 작성 폼 */}
      <div className="max-lg:hidden">
        <div className="flex gap-small mb-base">
          <Avatar>
            <AvatarImage
              src={currentUser?.profileImageUrl ?? ''}
              alt={currentUser?.nickname ?? ''}
            />
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
      </div>

      {/* 댓글 목록 */}
      {isError ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-grey-500 typo-body2">
            댓글을 불러오는데 문제가 생겼습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      ) : isLoading || !commentsData ? (
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
              .map((commentItem, index) => (
                <li
                  key={commentItem.commentId}
                  ref={index === 0 ? firstCommentRef : undefined}
                  className="flex gap-small border-b border-grey-300 py-large last:border-none max-lg:scroll-mt-16 max-lg:py-base"
                >
                  <Avatar className="mt-xtiny">
                    <AvatarImage src={commentItem.profileImageUrl} alt={commentItem.nickname} />
                    <AvatarFallback>{commentItem.nickname.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-base max-lg:gap-tiny">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="typo-subtitle5 text-black max-lg:typo-body5">
                          {commentItem.nickname}
                        </p>
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
                    <div className="typo-body1 text-grey-700 whitespace-pre-wrap max-lg:typo-body4">
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

      {/* 모바일 하단 고정 입력창 */}
      {!isMobileComposerOpen && (
        <div className="mobile-frame fixed inset-x-0 bottom-0 z-40 border-t border-grey-200 bg-white px-5 py-small pb-[calc(var(--spacing-small)+env(safe-area-inset-bottom))] shadow-drop lg:hidden">
          <button
            type="button"
            className="flex h-12 w-full items-center rounded-small border border-grey-300 px-base text-left typo-m-body1 text-grey-600"
            onClick={handleOpenMobileComposer}
          >
            코멘트를 남겨보세요
          </button>
        </div>
      )}

      {isMobileComposerOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default lg:hidden"
            aria-label="의견 입력 닫기"
            onClick={handleCloseMobileComposer}
          />
          <div className="mobile-frame fixed inset-x-0 bottom-0 z-50 border-t border-grey-200 bg-white px-5 pt-xtiny pb-[calc(var(--spacing-small)+env(safe-area-inset-bottom))] shadow-drop lg:hidden">
            <button
              type="button"
              className="mx-auto mb-xsmall block h-4 w-full touch-none cursor-row-resize py-xsmall"
              aria-label="의견 입력창 높이 조절"
              onPointerDown={handleResizeStart}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              onPointerCancel={handleResizeEnd}
            >
              <span className="mx-auto block h-1 w-13 rounded-full bg-grey-400" />
            </button>
            <Textarea
              ref={mobileTextareaRef}
              format="comment"
              height={draggedTextareaHeight ?? MOBILE_COMMENT_MIN_HEIGHT}
              maxHeight={
                draggedTextareaHeight
                  ? MOBILE_COMMENT_DRAG_MAX_HEIGHT
                  : MOBILE_COMMENT_AUTO_MAX_HEIGHT
              }
              maxLength={500}
              counter={false}
              placeholder="코멘트는 공백 포함 500자까지 작성할 수 있어요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="mt-xsmall flex items-center justify-between">
              <span
                className={`typo-m-body3 max-lg:typo-body6 ${comment.length >= 500 ? 'text-accent-300' : 'text-grey-600'}`}
              >
                {comment.length}/500
              </span>
              <Button
                className="h-9 w-16"
                onClick={handleSubmit}
                disabled={createMutation.isPending || !comment.trim()}
              >
                {createMutation.isPending ? '등록 중...' : '등록'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
