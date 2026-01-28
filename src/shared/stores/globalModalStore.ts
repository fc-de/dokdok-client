/**
 * @file globalModalStore.ts
 * @description 전역 모달 상태 관리 스토어 (Zustand)
 */

import { create } from 'zustand'

type ModalType = 'alert' | 'error' | 'confirm'

type ModalButton = {
  text: string
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
}

type ModalState = {
  isOpen: boolean
  type: ModalType | null
  title: string
  description: string
  buttons: ModalButton[]
}

type GlobalModalStore = ModalState & {
  /** Alert 모달 열기 */
  openAlert: (title: string, description: string) => void
  /** Error 모달 열기 */
  openError: (title: string, description: string, onClose?: () => void) => void
  /** Confirm 모달 열기 (Promise 반환) */
  openConfirm: (
    title: string,
    description: string,
    options?: {
      confirmText?: string
      variant?: 'primary' | 'danger'
    }
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

  openAlert: (title: string, description: string) => {
    set({
      isOpen: true,
      type: 'alert',
      title,
      description,
      buttons: [
        {
          text: '확인',
          variant: 'primary',
          onClick: () => get().close(),
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

  openConfirm: (
    title: string,
    description: string,
    options: { confirmText?: string; variant?: 'primary' | 'danger' } = {}
  ) => {
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
