/**
 * @file globalModalStore.ts
 * @description 전역 모달 상태 관리 스토어 (Zustand)
 *
 * 이 스토어의 상태를 구독하여 실제 모달을 렌더링하는 컴포넌트:
 * {@link GlobalModalHost} → src/shared/ui/GlobalModalHost.tsx
 *
 * GlobalModalHost가 App.tsx에 마운트되어 있어야 모달이 화면에 표시됩니다.
 */

import { create } from 'zustand'

import type { ButtonProps } from '@/shared/ui/Button'

/** 모달 타입 */
export type ModalType = 'alert' | 'error' | 'confirm'
export type MobileModalLayout = 'fullscreen' | 'dialog'
/** 모바일 fullscreen 레이아웃에서 표시되는 아이콘 (기본값: alert) */
export type ModalIcon = 'alert' | 'check'

/** 모달 버튼 variant (Button 컴포넌트의 variant와 호환) */
export type ModalButtonVariant = Extract<ButtonProps['variant'], 'primary' | 'secondary' | 'danger'>

/** 모달 버튼 설정 */
export type ModalButton = {
  /** 버튼 텍스트 */
  text: string
  /** 버튼 variant */
  variant?: ModalButtonVariant
  /** 클릭 핸들러 */
  onClick?: () => void
}

/** 모달 상태 */
export type ModalState = {
  /** 모달 열림 여부 */
  isOpen: boolean
  /** 모달 타입 */
  type: ModalType | null
  /** 모달 제목 */
  title: string
  /** 모달 설명 */
  description: string
  /** 모달 버튼 목록 */
  buttons: ModalButton[]
  /** 모바일에서의 모달 레이아웃 */
  mobileLayout: MobileModalLayout
  /** 모바일 fullscreen 레이아웃에서 표시되는 아이콘 */
  icon: ModalIcon
}

/** Alert 모달 옵션 */
export type AlertModalOptions = {
  /** 모바일 모달 레이아웃 (기본값: fullscreen) */
  mobileLayout?: MobileModalLayout
  /** 보조 액션 버튼 (예: '내 책장 보기') */
  secondaryAction?: {
    /** 버튼 텍스트 */
    text: string
    /** 클릭 핸들러 */
    onClick: () => void
  }
}

/** Confirm 모달 옵션 */
export type ConfirmModalOptions = {
  /** 확인 버튼 텍스트 (기본값: '확인') */
  confirmText?: string
  /** 취소 버튼 텍스트 (기본값: '취소') */
  cancelText?: string
  /** 확인 버튼 variant (기본값: 'primary') */
  variant?: Extract<ModalButtonVariant, 'primary' | 'danger'>
  /** 모바일 fullscreen 레이아웃에서 표시되는 아이콘 (기본값: 'alert') */
  icon?: ModalIcon
}

/** 전역 모달 스토어 타입 */
type GlobalModalStore = ModalState & {
  /** Alert 모달 열기 */
  openAlert: (
    title: string,
    description: string,
    onClose?: () => void,
    options?: AlertModalOptions
  ) => void
  /** Error 모달 열기 */
  openError: (title: string, description: string, onClose?: () => void) => void
  /** Confirm 모달 열기 (Promise 반환) */
  openConfirm: (
    title: string,
    description: string,
    options?: ConfirmModalOptions
  ) => Promise<boolean>
  /** 모달 닫기 */
  close: () => void
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  title: '',
  description: '',
  buttons: [],
  mobileLayout: 'fullscreen',
  icon: 'alert',
}

export const useGlobalModalStore = create<GlobalModalStore>((set, get) => ({
  ...initialState,

  openAlert: (
    title: string,
    description: string,
    onClose?: () => void,
    options?: AlertModalOptions
  ) => {
    const buttons: ModalButton[] = []

    if (options?.secondaryAction) {
      buttons.push({
        text: options.secondaryAction.text,
        variant: 'secondary',
        onClick: () => {
          get().close()
          options.secondaryAction!.onClick()
        },
      })
    }

    buttons.push({
      text: '확인',
      variant: 'primary',
      onClick: () => {
        get().close()
        onClose?.()
      },
    })

    set({
      isOpen: true,
      type: 'alert',
      title,
      description,
      buttons,
      mobileLayout: options?.mobileLayout ?? 'fullscreen',
      icon: 'alert',
    })
  },

  openError: (title: string, description: string, onClose?: () => void) => {
    set({
      isOpen: true,
      type: 'error',
      title,
      description,
      mobileLayout: 'fullscreen',
      icon: 'alert',
      buttons: [
        {
          text: '확인',
          variant: 'primary',
          onClick: () => {
            get().close()
            onClose?.()
          },
        },
      ],
    })
  },

  openConfirm: (title: string, description: string, options: ConfirmModalOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      const handleConfirm = () => {
        resolve(true)
        get().close()
      }

      const handleCancel = () => {
        resolve(false)
        get().close()
      }

      set({
        isOpen: true,
        type: 'confirm',
        title,
        description,
        mobileLayout: 'fullscreen',
        icon: options?.icon ?? 'alert',
        buttons: [
          {
            text: options?.cancelText || '취소',
            variant: 'secondary',
            onClick: handleCancel,
          },
          {
            text: options?.confirmText || '확인',
            variant: options?.variant || 'primary',
            onClick: handleConfirm,
          },
        ],
      })
    })
  },

  close: () => {
    set(initialState)
  },
}))
