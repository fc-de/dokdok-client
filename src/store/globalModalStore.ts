/**
 * @file globalModalStore.ts
 * @description 전역 모달 상태 관리 스토어 (Zustand)
 */

import { create } from 'zustand'

import type { ButtonProps } from '@/shared/ui/Button'

/** 모달 타입 */
export type ModalType = 'alert' | 'error' | 'confirm'

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
}

/** Confirm 모달 옵션 */
export type ConfirmModalOptions = {
  /** 확인 버튼 텍스트 (기본값: '확인') */
  confirmText?: string
  /** 확인 버튼 variant (기본값: 'primary') */
  variant?: Extract<ModalButtonVariant, 'primary' | 'danger'>
}

/** 전역 모달 스토어 타입 */
type GlobalModalStore = ModalState & {
  /** Alert 모달 열기 */
  openAlert: (title: string, description: string, onClose?: () => void) => void
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
}

export const useGlobalModalStore = create<GlobalModalStore>((set, get) => ({
  ...initialState,

  openAlert: (title: string, description: string, onClose?: () => void) => {
    set({
      isOpen: true,
      type: 'alert',
      title,
      description,
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

  openError: (title: string, description: string, onClose?: () => void) => {
    set({
      isOpen: true,
      type: 'error',
      title,
      description,
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
        buttons: [
          {
            text: '취소',
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
