import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

type BookLogActionMenuProps = {
  /** 수정하기 클릭 핸들러. 미전달 시 수정하기 옵션이 숨겨집니다. */
  onEdit?: () => void
  /** 삭제 확인 후 실행될 핸들러. 미전달 시 삭제하기 옵션이 숨겨집니다. */
  onDelete?: () => void
}

/**
 * 감상 기록 액션 메뉴 (수정/삭제)
 *
 * @description 더보기(⋮) 버튼을 클릭하면 수정하기, 삭제하기 옵션이 포함된 팝오버를 표시합니다.
 * 삭제하기 클릭 시 확인 모달을 먼저 띄운 뒤 onDelete를 호출합니다.
 *
 * @example
 * ```tsx
 * // 수정 + 삭제 모두 가능
 * <BookLogActionMenu onEdit={handleEdit} onDelete={handleDelete} />
 *
 * // 삭제만 가능
 * <BookLogActionMenu onDelete={handleDelete} />
 * ```
 */
function BookLogActionMenu({ onEdit, onDelete }: BookLogActionMenuProps) {
  const [open, setOpen] = useState(false)
  const openConfirm = useGlobalModalStore((s) => s.openConfirm)

  const handleEdit = () => {
    setOpen(false)
    onEdit?.()
  }

  const handleDelete = async () => {
    setOpen(false)
    const confirmed = await openConfirm('감상 기록 삭제하기', '정말로 이 감상 기록을 삭제할까요?', {
      confirmText: '삭제',
      variant: 'danger',
    })
    if (confirmed) {
      onDelete?.()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="cursor-pointer p-xsmall text-grey-600 hover:text-grey-800">
          <EllipsisVertical className="size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto py-tiny px-0 flex flex-col">
        {onEdit && (
          <TextButton onClick={handleEdit} className="typo-subtitle5 text-black">
            <div className="flex items-center gap-xsmall px-large py-[10px]">
              <SquarePen size={18} className="text-grey-700" />
              수정하기
            </div>
          </TextButton>
        )}
        {onDelete && (
          <TextButton onClick={handleDelete} className="typo-subtitle5 text-accent-300">
            <div className="flex items-center gap-xsmall px-large py-[10px]">
              <Trash2 size={18} />
              삭제하기
            </div>
          </TextButton>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default BookLogActionMenu
