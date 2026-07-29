import { ChevronDownIcon } from 'lucide-react'
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
} from '@/shared/ui'

import type { RecordType } from '../book.types'

type Gathering = {
  gatheringId: number
  gatheringName: string
}

const RECORD_TYPE_OPTIONS: { value: RecordType; label: string }[] = [
  { value: 'MEMO', label: '메모' },
  { value: 'QUOTE', label: '발췌' },
]

type RecordFilterBottomSheetProps = {
  className?: string
  /** 모임 목록 */
  gatherings: Gathering[]
  /** 선택된 모임 ID (문자열, '' = 전체) */
  selectedGathering: string
  onGatheringChange: (value: string) => void
  /** 선택된 기록 유형 */
  selectedRecordType: RecordType | ''
  onRecordTypeChange: (value: RecordType | '') => void
  /** 로딩 등으로 비활성화 */
  disabled?: boolean
}

/**
 * 모바일 통합 필터 BottomSheet
 *
 * 독서모임 · 기록 유형 필터를 하나의 시트에서 선택합니다.
 * 트리거 칩(독서모임/기록 유형) 중 아무거나 누르면 동일한 시트가 열립니다.
 *
 * @example
 * ```tsx
 * <RecordFilterBottomSheet
 *   className="lg:hidden"
 *   gatherings={gatherings}
 *   selectedGathering={selectedGathering}
 *   onGatheringChange={setSelectedGathering}
 *   selectedRecordType={recordType}
 *   onRecordTypeChange={setRecordType}
 * />
 * ```
 */
function RecordFilterBottomSheet({
  className,
  gatherings,
  selectedGathering,
  onGatheringChange,
  selectedRecordType,
  onRecordTypeChange,
  disabled = false,
}: RecordFilterBottomSheetProps) {
  const [open, setOpen] = useState(false)
  const [tempGathering, setTempGathering] = useState<string>(selectedGathering)
  const [tempRecordType, setTempRecordType] = useState<RecordType | ''>(selectedRecordType)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    // 열 때마다 현재 적용값으로 임시 상태 동기화
    if (nextOpen) {
      setTempGathering(selectedGathering)
      setTempRecordType(selectedRecordType)
    }
  }

  const handleReset = () => {
    setTempGathering('')
    setTempRecordType('')
  }

  const handleApply = () => {
    onGatheringChange(tempGathering)
    onRecordTypeChange(tempRecordType)
    setOpen(false)
  }

  const handleGatheringSelect = (value: string) => {
    const nextGathering = tempGathering === value ? '' : value
    setTempGathering(nextGathering)
    if (nextGathering) setTempRecordType('')
  }

  const handleRecordTypeSelect = (value: RecordType) => {
    const nextRecordType = tempRecordType === value ? '' : value
    setTempRecordType(nextRecordType)
    if (nextRecordType) setTempGathering('')
  }

  const selectedGatheringName = gatherings.find(
    (g) => String(g.gatheringId) === selectedGathering
  )?.gatheringName

  const selectedRecordTypeName = RECORD_TYPE_OPTIONS.find(
    (option) => option.value === selectedRecordType
  )?.label

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange}>
      <div className={cn('flex flex-wrap gap-xsmall', className)}>
        <BottomSheetTrigger asChild>
          <FilterTriggerChip
            label={selectedGatheringName ?? '독서모임'}
            active={!!selectedGathering}
            color="yellow"
            disabled={disabled}
          />
        </BottomSheetTrigger>
        <BottomSheetTrigger asChild>
          <FilterTriggerChip
            label={selectedRecordTypeName ?? '기록 유형'}
            active={!!selectedRecordType}
            color={selectedRecordType === 'QUOTE' ? 'purple' : 'primary'}
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
                    onClick={() => handleGatheringSelect(value)}
                    className="cursor-pointer"
                  >
                    {gathering.gatheringName}
                  </Chip>
                )
              })}
            </div>
          </section>

          {/* 기록 유형 */}
          <section className="flex flex-col gap-small">
            <p className="typo-m-body3 text-grey-600">기록 유형</p>
            <div className="flex flex-wrap gap-xsmall">
              {RECORD_TYPE_OPTIONS.map((option) => {
                const selected = tempRecordType === option.value
                return (
                  <Chip
                    key={option.value}
                    variant={selected ? 'selected' : 'default'}
                    onClick={() => handleRecordTypeSelect(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Chip>
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
  purple: 'bg-purple-100 text-purple-200 border border-purple-300',
} as const

const iconColorStyles = {
  primary: 'text-primary-300',
  yellow: 'text-yellow-200',
  purple: 'text-purple-200',
} as const

type FilterTriggerChipProps = {
  label: React.ReactNode
  active: boolean
  color: 'primary' | 'yellow' | 'purple'
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

export default RecordFilterBottomSheet
