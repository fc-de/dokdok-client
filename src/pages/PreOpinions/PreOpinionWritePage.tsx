import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { BookReviewFormValues } from '@/features/book/components/BookReviewForm'
import BookReviewSection from '@/features/pre-opinion/components/BookReviewSection'
import PreOpinionSharePreviewModal, {
  type SharePreviewTopic,
} from '@/features/pre-opinion/components/PreOpinionSharePreviewModal'
import PreOpinionWriteHeader from '@/features/pre-opinion/components/PreOpinionWriteHeader'
import TopicItem from '@/features/pre-opinion/components/TopicItem'
import { usePreOpinion, useSavePreOpinion, useSubmitPreOpinion } from '@/features/pre-opinion/hooks'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants/routes'
import { MobileLayoutFrame } from '@/shared/layout'
import { Card, Spinner } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

function normalizeAnswer(raw: string): string | null {
  const trimmed = raw.trim()
  return trimmed || null
}

export default function PreOpinionWritePage() {
  const { gatheringId, meetingId } = useParams<{ gatheringId: string; meetingId: string }>()
  const numGatheringId = Number(gatheringId)
  const numMeetingId = Number(meetingId)

  const { openError } = useGlobalModalStore()

  const navigate = useNavigate()

  const {
    data: preOpinion,
    isLoading,
    isError,
    error,
  } = usePreOpinion({
    gatheringId: numGatheringId,
    meetingId: numMeetingId,
  })

  const reviewRef = useRef<BookReviewFormValues>({ rating: 0, keywordIds: [], isValid: false })
  const [reviewValidFor, setReviewValidFor] = useState<{
    gatheringId: number
    meetingId: number
    isValid: boolean
  } | null>(null)
  const formReviewValid =
    reviewValidFor?.gatheringId === numGatheringId && reviewValidFor?.meetingId === numMeetingId
      ? reviewValidFor.isValid
      : null
  const isReviewValid = formReviewValid ?? !!preOpinion?.review
  const answersRef = useRef<Map<number, string>>(new Map())

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewSnapshot, setPreviewSnapshot] = useState<{
    rating: number
    keywordIds: number[]
    topics: SharePreviewTopic[]
  } | null>(null)

  useEffect(() => {
    reviewRef.current = { rating: 0, keywordIds: [], isValid: false }
    answersRef.current = new Map()
  }, [numGatheringId, numMeetingId])

  useEffect(() => {
    if (!preOpinion?.review) return
    reviewRef.current = {
      rating: preOpinion.review.rating,
      keywordIds: preOpinion.review.keywords.map((k) => k.id),
      isValid: true,
    }
  }, [preOpinion?.review])

  useEffect(() => {
    if (isError) {
      openError('에러', error.userMessage, () => {
        navigate(-1)
      })
    }
  }, [isError, error, openError, navigate])

  const isFirstSave = preOpinion ? preOpinion.preOpinion.updatedAt === null : true

  const {
    mutate: save,
    mutateAsync: saveAsync,
    isPending: isSaving,
  } = useSavePreOpinion({
    gatheringId: numGatheringId,
    meetingId: numMeetingId,
    isFirstSave,
  })

  const { mutateAsync: submitAsync, isPending: isSubmitting } = useSubmitPreOpinion({
    gatheringId: numGatheringId,
    meetingId: numMeetingId,
    bookId: preOpinion?.book.bookId,
  })

  const handleReviewChange = useCallback(
    (values: BookReviewFormValues) => {
      reviewRef.current = values
      setReviewValidFor({
        gatheringId: numGatheringId,
        meetingId: numMeetingId,
        isValid: values.isValid,
      })
    },
    [numGatheringId, numMeetingId]
  )

  const handleTopicChange = useCallback((topicId: number, content: string) => {
    answersRef.current.set(topicId, content)
  }, [])

  const buildSaveBody = useCallback(() => {
    if (!preOpinion) return null

    const answers = preOpinion.preOpinion.topics.map((topic) => {
      const raw = answersRef.current.has(topic.topicId)
        ? answersRef.current.get(topic.topicId)!
        : (topic.content ?? '')
      return {
        topicId: topic.topicId,
        content: normalizeAnswer(raw),
      }
    })

    return {
      review: {
        rating: reviewRef.current.rating,
        keywordIds: reviewRef.current.keywordIds,
      },
      answers,
    }
  }, [preOpinion])

  const buildSubmitBody = useCallback(() => {
    if (!preOpinion) return null

    return {
      review: {
        rating: reviewRef.current.rating,
        keywordIds: reviewRef.current.keywordIds,
      },
      topicIds: preOpinion.preOpinion.topics.map((t) => t.topicId),
    }
  }, [preOpinion])

  const handleSave = useCallback(() => {
    const body = buildSaveBody()
    if (!body) return
    save(body, {
      onError: () => {
        openError('오류', '사전 의견 저장 중 오류가 발생했습니다.')
      },
    })
  }, [buildSaveBody, save, openError])

  const handleOpenPreview = useCallback(() => {
    if (!preOpinion) return

    const topics: SharePreviewTopic[] = preOpinion.preOpinion.topics.map((t) => ({
      topicId: t.topicId,
      title: t.topicTitle,
      description: t.topicDescription,
      topicTypeLabel: t.topicTypeLabel,
      confirmOrder: t.confirmOrder,
      content: normalizeAnswer(
        answersRef.current.has(t.topicId) ? answersRef.current.get(t.topicId)! : (t.content ?? '')
      ),
    }))

    setPreviewSnapshot({
      rating: reviewRef.current.rating,
      keywordIds: reviewRef.current.keywordIds,
      topics,
    })
    setIsPreviewOpen(true)
  }, [preOpinion])

  const handleConfirmShare = useCallback(async () => {
    const saveBody = buildSaveBody()
    if (!saveBody) return
    const submitBody = buildSubmitBody()
    if (!submitBody) return

    try {
      await saveAsync(saveBody)
    } catch {
      openError('오류', '사전 의견 저장 중 오류가 발생했습니다.')
      throw new Error('save failed')
    }

    await submitAsync(submitBody).catch(() => {
      openError('오류', '사전 의견 제출 중 오류가 발생했습니다.')
      throw new Error('submit failed')
    })
  }, [buildSaveBody, buildSubmitBody, saveAsync, submitAsync, openError])

  const isMobileSaveDisabled = isLoading || isSaving || !isReviewValid
  const mobileHeaderAction = {
    label: isSaving ? '저장 중...' : '저장하기',
    onClick: handleSave,
    disabled: isMobileSaveDisabled,
  }

  if (isLoading || !preOpinion) {
    return (
      <MobileLayoutFrame
        variant="independent"
        title="사전 의견 작성하기"
        onBack={() => navigate(-1)}
        headerAction={mobileHeaderAction}
        className="min-h-dvh lg:min-h-0"
      >
        <SubPageHeader disableShadow className="max-lg:hidden" />
        <div className="flex items-center justify-center py-xlarge">
          <Spinner />
        </div>
      </MobileLayoutFrame>
    )
  }

  return (
    <MobileLayoutFrame
      variant="independent"
      title="사전 의견 작성하기"
      onBack={() => navigate(-1)}
      headerAction={mobileHeaderAction}
      className="min-h-dvh lg:min-h-0"
    >
      <SubPageHeader disableShadow className="max-lg:hidden" />
      <div className="max-lg:hidden">
        <PreOpinionWriteHeader
          book={preOpinion.book}
          updatedAt={preOpinion.preOpinion.updatedAt}
          onSave={handleSave}
          onSubmit={handleOpenPreview}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
          isReviewValid={isReviewValid}
        />
      </div>

      <div className="bg-grey-100 max-lg:min-h-dvh">
        <section className="max-w-300 mx-auto py-large flex flex-col gap-base max-lg:px-5 max-lg:py-5">
          <Card className="border-primary-200 bg-primary-100 text-primary-400 px-small py-2.5 rounded-small">
            <p className="typo-caption1">
              작성하신 사전 의견은 약속 당일이 되면 멤버들에게 자동으로 공개돼요.
            </p>
          </Card>
          <BookReviewSection review={preOpinion.review} onChange={handleReviewChange} />
          {preOpinion.preOpinion.topics.map((topic) => (
            <TopicItem key={topic.topicId} topic={topic} onChange={handleTopicChange} />
          ))}
        </section>
      </div>

      {previewSnapshot && (
        <PreOpinionSharePreviewModal
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          rating={previewSnapshot.rating}
          keywordIds={previewSnapshot.keywordIds}
          topics={previewSnapshot.topics}
          isPending={isSaving || isSubmitting}
          onConfirmShare={handleConfirmShare}
          onGoToPreOpinions={() => navigate(ROUTES.PRE_OPINIONS(numGatheringId, numMeetingId))}
          onGoToBook={() => navigate(ROUTES.BOOK_DETAIL(preOpinion.book.bookId))}
        />
      )}
    </MobileLayoutFrame>
  )
}
