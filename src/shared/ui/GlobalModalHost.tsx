/**
 * @file GlobalModalHost.tsx
 * @description 전역 모달 호스트 컴포넌트
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
 * 전역 모달 호스트
 *
 * @description
 * Store의 모달 상태를 구독하여 alert, error, confirm 모달을 렌더링합니다.
 * App 또는 Layout 컴포넌트에서 한 번만 사용하세요.
 *
 * @example
 * ```tsx
 * // App.tsx
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <GlobalModalHost />
 *     </>
 *   )
 * }
 *
 * // 사용
 * const { openAlert, openError, openConfirm } = useGlobalModalStore()
 *
 * openAlert('제목', '메시지')
 * openError('오류 메시지')
 * const confirmed = await openConfirm('제목', '메시지')
 * ```
 */
export function GlobalModalHost() {
  const { isOpen, type, title, description, buttons, close } = useGlobalModalStore()

  if (!isOpen) {
    return null
  }

  const footerVariant = type === 'confirm' ? 'double' : 'full'

  return (
    <Modal open={isOpen} onOpenChange={close}>
      <ModalContent variant="normal">
        <ModalHeader hideCloseButton>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="typo-body2 text-grey-700">{description}</p>
        </ModalBody>
        <ModalFooter variant={footerVariant}>
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
