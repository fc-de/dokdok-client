/**
 * @file ConfirmModalHost.tsx
 * @description 전역 Confirm 모달 호스트 컴포넌트
 */

import { useGlobalModalStore } from '@/shared/stores/globalModalStore'
import { Button } from '@/shared/ui/Button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/Modal'

/**
 * Confirm 모달 호스트
 *
 * @description
 * Store의 confirm 상태를 구독하여 확인 모달을 렌더링합니다.
 * App 또는 Layout 컴포넌트에서 한 번만 사용하세요.
 *
 * @example
 * ```tsx
 * // App.tsx
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <ConfirmModalHost />
 *     </>
 *   )
 * }
 *
 * // 사용
 * const { openConfirm } = useGlobalModalStore()
 * const confirmed = await openConfirm('제목', '메시지')
 * ```
 */
export function ConfirmModalHost() {
  const { isOpen, title, description, buttons, close } = useGlobalModalStore()

  if (!isOpen) {
    return null
  }

  return (
    <Modal open={isOpen} onOpenChange={close}>
      <ModalContent variant="normal">
        <ModalHeader hideCloseButton>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="typo-body2 text-grey-700">{description}</p>
        </ModalBody>
        <ModalFooter variant="double">
          {buttons.map(
            (
              button: {
                text: string
                variant?: 'primary' | 'secondary' | 'danger'
                onClick?: () => void
              },
              index: number
            ) => (
              <Button
                key={index}
                variant={button.variant === 'secondary' ? 'secondary' : button.variant || 'primary'}
                outline={button.variant === 'secondary'}
                onClick={button.onClick}
              >
                {button.text}
              </Button>
            )
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
