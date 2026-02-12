import { X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useKeywords } from '@/features/keywords'
import { StarRate } from '@/shared/components/StarRate'
import { TextButton } from '@/shared/ui'
import { Chip } from '@/shared/ui/Chip'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/Tabs'

/** BookReviewForm의 현재 폼 상태 */
export interface BookReviewFormValues {
  rating: number
  keywordIds: number[]
  isValid: boolean
}

/**
 * 책 평가 폼 컴포넌트
 *
 * @description 별점과 키워드를 선택하는 입력 UI만 담당합니다.
 * 제출 버튼은 포함하지 않으며, onChange 콜백으로 현재 폼 상태를 전달합니다.
 *
 * @example
 * ```tsx
 * // 빈 폼
 * <BookReviewForm onChange={(values) => setFormValues(values)} />
 *
 * // 기존 데이터가 있는 경우
 * <BookReviewForm
 *   initialRating={3.5}
 *   initialKeywordIds={[3, 7]}
 *   onChange={(values) => setFormValues(values)}
 * />
 * ```
 */
export interface BookReviewFormProps {
  /** 초기 별점 값 */
  initialRating?: number
  /** 초기 선택된 키워드 ID 목록 */
  initialKeywordIds?: number[]
  /** 폼 상태 변경 콜백 */
  onChange?: (values: BookReviewFormValues) => void
}

export function BookReviewForm({
  initialRating = 0,
  initialKeywordIds = [],
  onChange,
}: BookReviewFormProps) {
  const [rating, setRating] = useState(initialRating)
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>(initialKeywordIds)
  const [selectedBookCategoryId, setSelectedBookCategoryId] = useState<number | null>(null)
  const [selectedImpressionCategoryId, setSelectedImpressionCategoryId] = useState<number | null>(
    null
  )

  const {
    data: keywordsData,
    isLoading: isLoadingKeywords,
    isError: isKeywordsError,
  } = useKeywords()

  // 책 키워드 카테고리 (level 1)
  const bookCategories = useMemo(
    () =>
      keywordsData?.keywords.filter((k) => k.type === 'BOOK' && k.level === 1 && !k.isSelectable) ||
      [],
    [keywordsData]
  )

  // 감정 키워드 카테고리 (level 1)
  const impressionCategories = useMemo(
    () =>
      keywordsData?.keywords.filter(
        (k) => k.type === 'IMPRESSION' && k.level === 1 && !k.isSelectable
      ) || [],
    [keywordsData]
  )

  // 선택 가능한 책 키워드 (level 2)
  const bookKeywords = useMemo(() => {
    const allKeywords =
      keywordsData?.keywords.filter((k) => k.type === 'BOOK' && k.isSelectable) || []

    if (selectedBookCategoryId === null) {
      return allKeywords
    }

    return allKeywords.filter((k) => k.parentId === selectedBookCategoryId)
  }, [keywordsData, selectedBookCategoryId])

  // 선택 가능한 감정 키워드 (level 2)
  const impressionKeywords = useMemo(() => {
    const allKeywords =
      keywordsData?.keywords.filter((k) => k.type === 'IMPRESSION' && k.isSelectable) || []

    if (selectedImpressionCategoryId === null) {
      return allKeywords
    }

    return allKeywords.filter((k) => k.parentId === selectedImpressionCategoryId)
  }, [keywordsData, selectedImpressionCategoryId])

  // 선택된 책 키워드
  const selectedBookKeywords = useMemo(() => {
    return (
      keywordsData?.keywords.filter(
        (k) => k.type === 'BOOK' && selectedKeywordIds.includes(k.id)
      ) || []
    )
  }, [keywordsData, selectedKeywordIds])

  // 선택된 감정 키워드
  const selectedImpressionKeywords = useMemo(() => {
    return (
      keywordsData?.keywords.filter(
        (k) => k.type === 'IMPRESSION' && selectedKeywordIds.includes(k.id)
      ) || []
    )
  }, [keywordsData, selectedKeywordIds])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    onChange?.({
      rating: newRating,
      keywordIds: selectedKeywordIds,
      isValid: selectedBookKeywords.length > 0 && selectedImpressionKeywords.length > 0,
    })
  }

  const handleKeywordToggle = (keywordId: number) => {
    const nextIds = selectedKeywordIds.includes(keywordId)
      ? selectedKeywordIds.filter((id) => id !== keywordId)
      : [...selectedKeywordIds, keywordId]
    setSelectedKeywordIds(nextIds)

    const nextBookCount =
      keywordsData?.keywords.filter((k) => k.type === 'BOOK' && nextIds.includes(k.id)).length ?? 0
    const nextImpressionCount =
      keywordsData?.keywords.filter((k) => k.type === 'IMPRESSION' && nextIds.includes(k.id))
        .length ?? 0

    onChange?.({
      rating,
      keywordIds: nextIds,
      isValid: nextBookCount > 0 && nextImpressionCount > 0,
    })
  }

  if (isKeywordsError) {
    return (
      <div className="flex items-center justify-center py-xlarge">
        <p className="typo-body2 text-grey-600">키워드를 불러오지 못했습니다. 다시 시도해주세요.</p>
      </div>
    )
  }

  if (isLoadingKeywords) {
    return (
      <div className="flex items-center justify-center py-xlarge">
        <p className="typo-body2 text-grey-600">키워드를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-large">
        {/* 별점 */}
        <section>
          <h4 className="typo-body4 text-grey-600 mb-tiny ml-xxtiny">별점</h4>
          <div className="flex items-center gap-xsmall">
            <StarRate rating={rating} size={36} interactive onRatingChange={handleRatingChange} />
            <p className="subtitle5 text-black">{rating.toFixed(1)}</p>
            {rating >= 0.5 && (
              <TextButton onClick={() => handleRatingChange(0)}>별점 초기화</TextButton>
            )}
          </div>
        </section>

        {/* 책 키워드 */}
        <section>
          <h4 className="typo-body4 text-grey-600 mb-tiny ml-xxtiny">책 키워드</h4>

          {/* 카테고리 탭 */}
          <Tabs
            value={selectedBookCategoryId?.toString() ?? 'all'}
            onValueChange={(value) =>
              setSelectedBookCategoryId(value === 'all' ? null : Number(value))
            }
            className="mb-tiny ml-xtiny"
          >
            <TabsList size="small">
              <TabsTrigger value="all">전체</TabsTrigger>
              {bookCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* 키워드 목록 */}
          <div className="flex gap-xsmall flex-wrap">
            {bookKeywords.map((keyword) => {
              const isSelected = selectedKeywordIds.includes(keyword.id)
              return (
                <Chip
                  key={keyword.id}
                  variant={isSelected ? 'selected' : 'default'}
                  onClick={() => handleKeywordToggle(keyword.id)}
                  className="cursor-pointer"
                >
                  {keyword.name}
                </Chip>
              )
            })}
          </div>

          {/* 선택한 키워드 */}
          {selectedBookKeywords.length > 0 && (
            <div className="flex flex-col gap-tiny flex-wrap bg-grey-100 py-2.5 px-small mt-small">
              <p className="typo-body4 text-grey-600">선택한 키워드</p>
              <div className="flex gap-tiny flex-wrap">
                {selectedBookKeywords.map((keyword) => (
                  <Chip
                    key={keyword.id}
                    onClick={() => handleKeywordToggle(keyword.id)}
                    className="cursor-pointer bg-white text-black"
                  >
                    {keyword.name} <X className="ml-tiny" size={12} />
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 감정 키워드 */}
        <section>
          <h4 className="typo-body4 text-grey-600 mb-tiny">감상 키워드</h4>

          {/* 카테고리 탭 */}
          <Tabs
            value={selectedImpressionCategoryId?.toString() ?? 'all'}
            onValueChange={(value) =>
              setSelectedImpressionCategoryId(value === 'all' ? null : Number(value))
            }
            className="mb-tiny ml-xtiny"
          >
            <TabsList size="small">
              <TabsTrigger value="all">전체</TabsTrigger>
              {impressionCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* 키워드 목록 */}
          <div className="flex gap-xsmall flex-wrap">
            {impressionKeywords.map((keyword) => {
              const isSelected = selectedKeywordIds.includes(keyword.id)
              return (
                <Chip
                  key={keyword.id}
                  variant={isSelected ? 'selected' : 'default'}
                  onClick={() => handleKeywordToggle(keyword.id)}
                  className="cursor-pointer"
                >
                  {keyword.name}
                </Chip>
              )
            })}
          </div>

          {/* 선택한 키워드 */}
          {selectedImpressionKeywords.length > 0 && (
            <div className="flex flex-col gap-tiny flex-wrap bg-grey-100 py-2.5 px-small mt-small">
              <p className="typo-body4 text-grey-600">선택한 키워드</p>
              <div className="flex gap-tiny flex-wrap">
                {selectedImpressionKeywords.map((keyword) => (
                  <Chip
                    key={keyword.id}
                    onClick={() => handleKeywordToggle(keyword.id)}
                    className="cursor-pointer bg-white text-black"
                  >
                    {keyword.name} <X className="ml-tiny" size={12} />
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
