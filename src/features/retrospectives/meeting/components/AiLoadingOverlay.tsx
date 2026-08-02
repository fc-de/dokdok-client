import { createPortal } from 'react-dom'

import aiGradientIcon from '@/shared/assets/icon/ai-gradient.svg'
import { Button } from '@/shared/ui'

type AiLoadingOverlayProps = {
  isOpen: boolean
  message?: string
  onCancel?: () => void
}

export default function AiLoadingOverlay({
  isOpen,
  message = 'AI가 사전 의견을 요약 중이에요',
  onCancel,
}: AiLoadingOverlayProps) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex w-lg flex-col items-center justify-center gap-small rounded-small bg-grey-100 p-medium shadow-drop max-lg:w-[calc(100%-40px)] max-lg:max-w-75 max-lg:gap-3 max-lg:rounded-small max-lg:bg-white max-lg:p-5">
        <div className="flex animate-pulse flex-col items-center justify-center gap-tiny max-lg:gap-1.5">
          <img src={aiGradientIcon} alt="요약중 아이콘" className="size-6" />
          <p className="text-blue-200 typo-subtitle2">{message}</p>
        </div>
        {onCancel && (
          <Button variant="secondary" outline size="small" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </div>,
    document.body
  )
}
