import { useParams } from 'react-router-dom'

import { useMeetingDetail } from '@/features/meetings'
import BookReviewSection from '@/features/pre-opinion/components/BookReviewSection'
import PreOpinionQuestionSection from '@/features/pre-opinion/components/PreOpinionQuestionSection'
import PreOpinionWriteHeader from '@/features/pre-opinion/components/PreOpinionWriteHeader'
import SubPageHeader from '@/shared/components/SubPageHeader'
import { Card } from '@/shared/ui'

export default function PreOpinionWritePage() {
  const { meetingId } = useParams<{ gatheringId: string; meetingId: string }>()
  const { data: meeting, isLoading } = useMeetingDetail(Number(meetingId))

  if (isLoading || !meeting) {
    return (
      <>
        <SubPageHeader />
        <div className="flex items-center justify-center py-xlarge">
          <p className="typo-body2 text-grey-600">로딩 중...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <SubPageHeader />
      <PreOpinionWriteHeader />

      <div className="w-screen relative left-1/2 -translate-x-1/2 bg-grey-100">
        <section className="max-w-[1200px] mx-auto py-large flex flex-col gap-base">
          <Card className="border-primary-200 bg-primary-100 text-primary-400 px-small py-[10px] rounded-small">
            <p className="typo-caption1">
              작성하신 사전 의견은 약속 당일이 되면 멤버들에게 자동으로 공개돼요.
            </p>
          </Card>
          <BookReviewSection bookId={meeting.book.bookId} />
          <PreOpinionQuestionSection />
        </section>
      </div>
    </>
  )
}
