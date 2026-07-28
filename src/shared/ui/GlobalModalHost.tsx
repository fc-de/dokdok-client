/**
 * @file GlobalModalHost.tsx
 * @description 전역 모달 호스트 컴포넌트
 *
 * useGlobalModalStore의 상태를 구독하여 모달을 렌더링합니다.
 * {@link useGlobalModalStore} → src/store/globalModalStore.ts
 *
 * 반드시 App.tsx 최상단에 한 번만 마운트하세요.
 */

import CircleAlertIcon from '@/shared/assets/icon/circle-alert.svg'
import { useDevice } from '@/shared/hooks/useDevice'
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetTitle,
} from '@/shared/ui/BottomSheet'
import { Button } from '@/shared/ui/Button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/Modal'
import { useGlobalModalStore } from '@/store'

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
  const { isOpen, title, description, buttons, close } = useGlobalModalStore()
  const { isMobile } = useDevice()

  if (!isOpen) {
    return null
  }

  const footerVariant = buttons.length >= 2 ? 'double' : 'full'
  //에러, 얼럿일 경우 디자인 맞춰서 수정해야 함

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) close()
  }

  if (isMobile) {
    return (
      <BottomSheet open={isOpen} onOpenChange={handleOpenChange}>
        <BottomSheetContent>
          <BottomSheetBody className="flex flex-col items-center text-center py-large">
            <img src={CircleAlertIcon} alt="" />
            <BottomSheetTitle className="mb-xsmall typo-m-subtitle1 text-black">
              {title}
            </BottomSheetTitle>
            <BottomSheetDescription className="whitespace-pre-line typo-m-body3 text-grey-700">
              {description}
            </BottomSheetDescription>
          </BottomSheetBody>
          <BottomSheetFooter>
            {buttons.map((button, index) => (
              <Button
                key={index}
                size="medium"
                variant={button.variant || 'primary'}
                outline={button.variant === 'secondary'}
                onClick={button.onClick}
                className="flex-1"
              >
                {button.text}
              </Button>
            ))}
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    )
  }

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent variant="normal" className="h-auto w-fit min-w-md">
        <ModalHeader hideCloseButton>
          <ModalTitle className="text-black typo-subtitle2">{title}</ModalTitle>
          <ModalDescription className="sr-only">{description}</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="whitespace-pre-line typo-body4 text-grey-700">{description}</p>
        </ModalBody>
        <ModalFooter variant={footerVariant} className="border-none">
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || 'primary'}
              outline={button.variant === 'secondary'}
              onClick={button.onClick}
            >
              {button.text}
            </Button>
          ))}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
