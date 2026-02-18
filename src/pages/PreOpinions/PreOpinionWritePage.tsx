import { useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import type { BookReviewFormValues } from '@/features/book/components/BookReviewForm'
import BookReviewSection from '@/features/pre-opinion/components/BookReviewSection'
import PreOpinionQuestionSection from '@/features/pre-opinion/components/PreOpinionQuestionSection'
import PreOpinionWriteHeader from '@/features/pre-opinion/components/PreOpinionWriteHeader'
import { usePreOpinion, useSavePreOpinion, useSubmitPreOpinion } from '@/features/pre-opinion/hooks'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { Card, Spinner } from '@/shared/ui'

export default function PreOpinionWritePage() {
  const { gatheringId, meetingId } = useParams<{ gatheringId: string; meetingId: string }>()
  const numGatheringId = Number(gatheringId)
  const numMeetingId = Number(meetingId)

  const { data: preOpinion, isLoading } = usePreOpinion({
    gatheringId: numGatheringId,
    meetingId: numMeetingId,
  })

  const reviewRef = useRef<BookReviewFormValues>({ rating: 0, keywordIds: [], isValid: false })
  const answersRef = useRef<Map<number, string>>(new Map())

  useEffect(() => {
    if (!preOpinion?.review) return
    reviewRef.current = {
      rating: preOpinion.review.rating,
      keywordIds: preOpinion.review.keywords.map((k) => k.id),
      isValid: true,
    }
  }, [preOpinion?.review])

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
  })

  const handleReviewChange = useCallback((values: BookReviewFormValues) => {
    reviewRef.current = values
  }, [])

  const handleTopicChange = useCallback((topicId: number, content: string) => {
    answersRef.current.set(topicId, content)
  }, [])

  const buildSaveBody = useCallback(() => {
    if (!preOpinion) return null

    const answers = preOpinion.preOpinion.topics.map((topic) => {
      const raw = answersRef.current.has(topic.topicId)
        ? answersRef.current.get(topic.topicId)!
        : (topic.content ?? '')
      const trimmed = raw.trim()
      return {
        topicId: topic.topicId,
        content: trimmed || null,
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
    save(body)
  }, [buildSaveBody, save])

  const handleSubmit = useCallback(async () => {
    const submitBody = buildSubmitBody()
    if (!submitBody) return

    try {
      if (isFirstSave) {
        const saveBody = buildSaveBody()
        if (!saveBody) return
        await saveAsync(saveBody)
      }

      await submitAsync(submitBody)
    } catch {
      // 에러는 useSubmitPreOpinion/useSavePreOpinion의 onError에서 처리
    }
  }, [isFirstSave, buildSaveBody, buildSubmitBody, saveAsync, submitAsync])

  if (isLoading || !preOpinion) {
    return (
      <>
        <SubPageHeader />
        <div className="flex items-center justify-center py-xlarge">
          <Spinner />
        </div>
      </>
    )
  }

  return (
    <>
      <SubPageHeader />
      <PreOpinionWriteHeader
        book={preOpinion.book}
        updatedAt={preOpinion.preOpinion.updatedAt}
        onSave={handleSave}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
      />

      <div className="w-screen relative left-1/2 -translate-x-1/2 bg-grey-100">
        <section className="max-w-[1200px] mx-auto py-large flex flex-col gap-base">
          <Card className="border-primary-200 bg-primary-100 text-primary-400 px-small py-[10px] rounded-small">
            <p className="typo-caption1">
              작성하신 사전 의견은 약속 당일이 되면 멤버들에게 자동으로 공개돼요.
            </p>
          </Card>
          <BookReviewSection review={preOpinion.review} onChange={handleReviewChange} />
          <PreOpinionQuestionSection
            topics={preOpinion.preOpinion.topics}
            onChange={handleTopicChange}
          />
        </section>
      </div>
    </>
  )
}
