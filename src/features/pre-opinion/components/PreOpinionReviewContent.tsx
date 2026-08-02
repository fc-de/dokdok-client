import { StarRate } from '@/shared/components/StarRate'
import { Badge } from '@/shared/ui'
import { Chip } from '@/shared/ui/Chip'

export type ReviewKeywordItem = {
  id: number
  name: string
}

export type ReviewTopicItem = {
  topicId: number
  title: string
  description: string
  topicTypeLabel: string
  confirmOrder: number
  content: string | null
}

type PreOpinionReviewContentProps = {
  rating: number
  bookKeywords: ReviewKeywordItem[]
  impressionKeywords: ReviewKeywordItem[]
  topics: ReviewTopicItem[]
}

/**
 * 사전 의견 콘텐츠 (별점, 키워드, 주제별 의견)
 *
 * @description
 * PreOpinionDetail과 PreOpinionSharePreviewModal에서 공통으로 사용하는
 * 사전 의견 내용 표시 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <PreOpinionReviewContent
 *   rating={4.5}
 *   bookKeywords={[{ id: 1, name: '흥미로운' }]}
 *   impressionKeywords={[{ id: 2, name: '감동적인' }]}
 *   topics={topics}
 * />
 * ```
 */
function PreOpinionReviewContent({
  rating,
  bookKeywords,
  impressionKeywords,
  topics,
}: PreOpinionReviewContentProps) {
  return (
    <div className="flex flex-col gap-xlarge max-lg:gap-0">
      {/* 책 평가 섹션 (별점 + 키워드) */}
      <section className="flex flex-col gap-small">
        {/* 별점 */}
        <div>
          <p className="typo-body4 text-grey-600 mb-tiny">별점</p>
          <div className="flex gap-small items-center">
            <StarRate rating={rating} size={36} />
            <span className="typo-subtitle5 text-black">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* 책 키워드 */}
        {bookKeywords.length > 0 && (
          <div>
            <p className="typo-body4 text-grey-600 mb-tiny">책 키워드</p>
            <div className="flex gap-tiny flex-wrap">
              {bookKeywords.map((k) => (
                <Chip key={k.id} variant="success">
                  {k.name}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* 감상 키워드 */}
        {impressionKeywords.length > 0 && (
          <div>
            <p className="typo-body4 text-grey-600 mb-tiny">감상 키워드</p>
            <div className="flex gap-tiny flex-wrap">
              {impressionKeywords.map((k) => (
                <Chip key={k.id} className="bg-blue-100 text-blue-200">
                  {k.name}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 모바일: 책 평가 - 주제별 의견 구분 바 */}
      {topics.length > 0 && (
        <div className="hidden h-2.5 bg-grey-100 max-lg:my-large max-lg:-mx-5 max-lg:block" />
      )}

      {/* 주제별 의견 섹션 */}
      {topics.length > 0 && (
        <section className="flex flex-col gap-[32px] max-lg:gap-0 max-lg:divide-y max-lg:divide-grey-300">
          {topics.map((topic) => (
            <div
              key={topic.topicId}
              className="flex flex-col max-lg:pt-large max-lg:pb-large max-lg:first:pt-0 max-lg:last:pb-0"
            >
              <div className="flex flex-col gap-small">
                <div className="flex gap-xsmall items-center">
                  <h4 className="typo-subtitle3 text-black break-all min-w-0">
                    주제 {topic.confirmOrder}. {topic.title}
                  </h4>
                  <Badge className="shrink-0">{topic.topicTypeLabel}</Badge>
                </div>
                <p className="typo-body4 text-grey-600 whitespace-pre-line break-all">
                  {topic.description}
                </p>
              </div>
              {topic.content && (
                <p className="typo-body1 text-black mt-base whitespace-pre-line break-all">
                  {topic.content}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export { PreOpinionReviewContent }
