import { X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useKeywords } from '@/features/keywords'
import { StarRate } from '@/shared/components/StarRate'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/Modal'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/Tabs'

import { useCreateBookReview } from '../hooks'

/**
 * 책 평가하기 모달
 *
 * @description 별점과 키워드를 선택하여 책을 평가하는 모달
 *
 * @example
 * ```tsx
 * <BookReviewModal
 *   bookId={1}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export interface BookReviewModalProps {
  bookId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookReviewModal({ bookId, open, onOpenChange }: BookReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([])
  const [selectedBookCategoryId, setSelectedBookCategoryId] = useState<number | null>(null)
  const [selectedImpressionCategoryId, setSelectedImpressionCategoryId] = useState<number | null>(
    null
  )

  const { data: keywordsData, isLoading: isLoadingKeywords } = useKeywords()
  const { mutate: submitReview, isPending } = useCreateBookReview(bookId)

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

  // 저장 버튼 활성화 조건
  const isFormValid = useMemo(() => {
    return rating > 0 && selectedBookKeywords.length > 0 && selectedImpressionKeywords.length > 0
  }, [rating, selectedBookKeywords.length, selectedImpressionKeywords.length])

  const handleKeywordToggle = (keywordId: number) => {
    setSelectedKeywordIds((prev) =>
      prev.includes(keywordId) ? prev.filter((id) => id !== keywordId) : [...prev, keywordId]
    )
  }

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.')
      return
    }

    submitReview(
      { rating, keywordIds: selectedKeywordIds },
      {
        onSuccess: () => {
          onOpenChange(false)
          // 상태 초기화
          setRating(0)
          setSelectedKeywordIds([])
          setSelectedBookCategoryId(null)
          setSelectedImpressionCategoryId(null)
        },
      }
    )
  }

  if (isLoadingKeywords) {
    return (
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent variant="normal">
          <ModalHeader>
            <ModalTitle>책 평가하기</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-center justify-center py-xlarge">
              <p className="typo-body2 text-grey-600">키워드를 불러오는 중...</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="wide">
        <ModalHeader>
          <ModalTitle>책 평가하기</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-large">
            {/* 별점 */}
            <section>
              <h4 className="typo-body4 text-grey-600 mb-tiny ml-xxtiny">별점</h4>
              <div className="flex items-center gap-xsmall">
                <StarRate rating={rating} size={36} interactive onRatingChange={setRating} />
                <p className="subtitle5 text-black">{rating.toFixed(1)}</p>
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
        </ModalBody>
        <ModalFooter variant="full">
          <Button className="w-full" onClick={handleSubmit} disabled={!isFormValid || isPending}>
            {isPending ? '저장 중...' : '저장하기'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
