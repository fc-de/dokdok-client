import { ChevronDownIcon, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'

type StarRatingFilterProps = {
  placeholder: string
  value?: StarRatingRange | null
  onChange?: (value: StarRatingRange | null) => void
  disabled?: boolean
}

export type StarRatingRange = {
  min: number
  max: number
}

/**
 * 별점 범위 선택 필터 컴포넌트
 *
 * @example
 * <StarRatingFilter placeholder="별점" value={rating} onChange={setRating} />
 */
function StarRatingFilter({
  placeholder,
  value,
  onChange,
  disabled = false,
}: StarRatingFilterProps) {
  const [open, setOpen] = useState(false)
  const [tempRange, setTempRange] = useState<StarRatingRange | null>(value ?? null)

  const getTriggerText = (): ReactNode => {
    if (!value) return placeholder

    const { min, max } = value

    if (min === max) {
      return (
        <span className="flex items-center gap-1">
          <Star className="text-yellow-200 size-4 fill-yellow-200" />
          {min}
        </span>
      )
    }

    return (
      <span className="flex items-center gap-1">
        <Star className="text-yellow-200 size-4 fill-yellow-200" />
        {min} ~ <Star className="text-yellow-200 size-4 fill-yellow-200" />
        {max}
      </span>
    )
  }

  const handleStarClick = (rating: number) => {
    if (!tempRange) {
      setTempRange({ min: rating, max: rating })
    } else if (tempRange.min === rating && tempRange.max === rating) {
      setTempRange(null)
    } else if (rating < tempRange.min) {
      setTempRange({ min: rating, max: tempRange.max })
    } else if (rating > tempRange.max) {
      setTempRange({ min: tempRange.min, max: rating })
    } else {
      setTempRange({ min: rating, max: rating })
    }
  }

  const handleReset = () => {
    setTempRange(null)
  }

  const handleApply = () => {
    onChange?.(tempRange)
    setOpen(false)
  }

  const isStarSelected = (rating: number): boolean => {
    if (!tempRange) return false
    return rating >= tempRange.min && rating <= tempRange.max
  }

  const hasValue = !!value

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) {
          setTempRange(value ?? null)
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          disabled={disabled}
          className={cn(
            'flex gap-1 rounded-tiny typo-body3 px-tiny py-[5px] text-grey-700 [&_.chevron-icon]:transition-transform data-[state=open]:[&_.chevron-icon]:rotate-180',
            disabled && 'bg-grey-200 text-grey-500 ',
            hasValue &&
              !disabled &&
              'bg-yellow-100 text-yellow-200 border border-yellow-200 hover:bg-yellow-100'
          )}
        >
          {getTriggerText()}
          <ChevronDownIcon
            className={cn(
              'chevron-icon size-4',
              disabled ? 'text-grey-500' : hasValue ? 'text-yellow-200' : 'text-grey-700'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex flex-col bg-white border p-small border-grey-300 rounded-tiny gap-small w-[264px]"
        sideOffset={8}
      >
        <p className="typo-body3 text-grey-600">{placeholder}</p>

        <div className="flex gap-xsmall">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleStarClick(rating)}
              className={cn(
                'flex items-center justify-center rounded-tiny border px-tiny py-[5px] typo-body3 transition-colors',
                'hover:bg-grey-100',
                isStarSelected(rating)
                  ? 'bg-yellow-100 border-yellow-200'
                  : 'bg-white border-grey-300'
              )}
            >
              <Star
                className={cn(
                  'size-4',
                  isStarSelected(rating)
                    ? 'fill-yellow-200 text-yellow-200'
                    : 'fill-grey-600 text-grey-600'
                )}
              />
              <span className="ml-1">{rating}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-xsmall">
          <Button
            outline
            onClick={handleReset}
            variant="secondary"
            className="text-grey-700 hover:bg-white hover:border-grey-400"
            size="small"
          >
            초기화
          </Button>
          <Button onClick={handleApply} className="text-white bg-primary-300" size="small">
            적용
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { StarRatingFilter }
