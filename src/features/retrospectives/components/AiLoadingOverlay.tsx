import { createPortal } from 'react-dom'

import { Button } from '../../../shared/ui/Button'
import AiGradientIcon from './AiGradientIcon'

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
      <div className="flex w-lg flex-col items-center justify-center gap-small rounded-small bg-grey-100 p-medium shadow-drop">
        <div className="flex animate-pulse flex-col items-center justify-center gap-tiny">
          <AiGradientIcon />
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
