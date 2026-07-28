import { ChevronDownIcon, Star } from 'lucide-react'
import { forwardRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
  Button,
  Chip,
  getNextStarRange,
  isStarInRange,
  type StarRatingRange,
} from '@/shared/ui'

type Gathering = {
  gatheringId: number
  gatheringName: string
}

type BookFilterBottomSheetProps = {
  className?: string
  /** 모임 목록 */
  gatherings: Gathering[]
  /** 선택된 모임 ID (문자열, '' = 전체) */
  selectedGathering: string
  onGatheringChange: (value: string) => void
  /** 선택된 별점 범위 */
  selectedRating: StarRatingRange | null
  onRatingChange: (value: StarRatingRange | null) => void
  /** 모임 다음 페이지 존재 여부 */
  hasNextGatherings?: boolean
  /** 모임 다음 페이지 조회 */
  fetchNextGatherings?: () => void
  /** 로딩 등으로 비활성화 */
  disabled?: boolean
}

/**
 * 모바일 통합 필터 BottomSheet
 *
 * 독서모임 · 별점 필터를 하나의 시트에서 선택합니다.
 * 트리거 칩(독서모임/별점) 중 아무거나 누르면 동일한 시트가 열립니다.
 *
 * @example
 * ```tsx
 * <BookFilterBottomSheet
 *   className="lg:hidden"
 *   gatherings={gatherings}
 *   selectedGathering={selectedGathering}
 *   onGatheringChange={setSelectedGathering}
 *   selectedRating={selectedRating}
 *   onRatingChange={setSelectedRating}
 * />
 * ```
 */
function BookFilterBottomSheet({
  className,
  gatherings,
  selectedGathering,
  onGatheringChange,
  selectedRating,
  onRatingChange,
  hasNextGatherings,
  fetchNextGatherings,
  disabled = false,
}: BookFilterBottomSheetProps) {
  const [open, setOpen] = useState(false)
  const [tempGathering, setTempGathering] = useState<string>(selectedGathering)
  const [tempRating, setTempRating] = useState<StarRatingRange | null>(selectedRating ?? null)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    // 열 때마다 현재 적용값으로 임시 상태 동기화
    if (nextOpen) {
      setTempGathering(selectedGathering)
      setTempRating(selectedRating ?? null)
    }
  }

  const handleReset = () => {
    setTempGathering('')
    setTempRating(null)
  }

  const handleApply = () => {
    onGatheringChange(tempGathering)
    onRatingChange(tempRating)
    setOpen(false)
  }

  const selectedGatheringName = gatherings.find(
    (g) => String(g.gatheringId) === selectedGathering
  )?.gatheringName

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange}>
      <div className={cn('flex flex-wrap gap-xsmall', className)}>
        <BottomSheetTrigger asChild>
          <FilterTriggerChip
            label={selectedGatheringName ?? '독서모임'}
            active={!!selectedGathering}
            color="primary"
            disabled={disabled}
          />
        </BottomSheetTrigger>
        <BottomSheetTrigger asChild>
          <FilterTriggerChip
            label={selectedRating ? <StarRangeLabel range={selectedRating} /> : '별점'}
            active={!!selectedRating}
            color="yellow"
            disabled={disabled}
          />
        </BottomSheetTrigger>
      </div>

      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle className="typo-m-subtitle1 text-black">필터</BottomSheetTitle>
        </BottomSheetHeader>

        <BottomSheetBody className="flex flex-col gap-large">
          {/* 독서모임 */}
          <section className="flex flex-col gap-small">
            <p className="typo-m-body3 text-grey-600">독서모임</p>
            <div className="flex flex-wrap gap-xsmall">
              {gatherings.length === 0 && (
                <p className="typo-m-body4 text-grey-500">참여 중인 독서모임이 없어요.</p>
              )}
              {gatherings.map((gathering) => {
                const value = String(gathering.gatheringId)
                const selected = tempGathering === value
                return (
                  <Chip
                    key={gathering.gatheringId}
                    variant={selected ? 'selected' : 'default'}
                    onClick={() => setTempGathering(selected ? '' : value)}
                    className="cursor-pointer"
                  >
                    {gathering.gatheringName}
                  </Chip>
                )
              })}
              {hasNextGatherings && (
                <button
                  type="button"
                  className="py-xsmall typo-m-caption1 text-grey-500"
                  onClick={() => fetchNextGatherings?.()}
                >
                  더 보기
                </button>
              )}
            </div>
          </section>

          {/* 별점 */}
          <section className="flex flex-col gap-small">
            <p className="typo-m-body3 text-grey-600">별점</p>
            <div className="flex flex-wrap gap-xsmall">
              {[0, 1, 2, 3, 4, 5].map((rating) => {
                const selected = isStarInRange(tempRating, rating)
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setTempRating(getNextStarRange(tempRating, rating))}
                    className={cn(
                      'flex items-center justify-center rounded-tiny border px-tiny py-[5px] typo-m-body3 transition-colors',
                      selected ? 'bg-yellow-100 border-yellow-200' : 'bg-white border-grey-300'
                    )}
                  >
                    <Star
                      className={cn(
                        'size-4',
                        selected ? 'fill-yellow-200 text-yellow-200' : 'fill-grey-600 text-grey-600'
                      )}
                    />
                    <span className="ml-1">{rating}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </BottomSheetBody>

        <BottomSheetFooter>
          <Button
            variant="secondary"
            outline
            size="medium"
            className="flex-1"
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button size="medium" className="flex-1 bg-primary-300 text-white" onClick={handleApply}>
            확인
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  )
}

const triggerColorStyles = {
  primary: 'bg-primary-100 text-primary-300 border border-primary-300',
  yellow: 'bg-yellow-100 text-yellow-200 border border-yellow-200',
} as const

const iconColorStyles = {
  primary: 'text-primary-300',
  yellow: 'text-yellow-200',
} as const

type FilterTriggerChipProps = {
  label: React.ReactNode
  active: boolean
  color: 'primary' | 'yellow'
} & React.ComponentProps<typeof Button>

const FilterTriggerChip = forwardRef<HTMLButtonElement, FilterTriggerChipProps>(
  ({ label, active, color, disabled, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="secondary"
      disabled={disabled}
      className={cn(
        'flex gap-1 rounded-tiny typo-m-body3 px-tiny py-[5px] text-grey-700',
        disabled && 'bg-grey-200 text-grey-500',
        active && !disabled && triggerColorStyles[color],
        className
      )}
      {...props}
    >
      {label}
      <ChevronDownIcon
        className={cn(
          'size-4',
          disabled ? 'text-grey-500' : active ? iconColorStyles[color] : 'text-grey-700'
        )}
      />
    </Button>
  )
)
FilterTriggerChip.displayName = 'FilterTriggerChip'

function StarRangeLabel({ range }: { range: StarRatingRange }) {
  const { min, max } = range
  if (min === max) {
    return (
      <span className="flex items-center gap-1">
        <Star className="size-4 fill-yellow-200 text-yellow-200" />
        {min}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1">
      <Star className="size-4 fill-yellow-200 text-yellow-200" />
      {min} ~ <Star className="size-4 fill-yellow-200 text-yellow-200" />
      {max}
    </span>
  )
}

export default BookFilterBottomSheet
