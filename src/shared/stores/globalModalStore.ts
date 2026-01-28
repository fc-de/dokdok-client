/**
 * @file globalModalStore.ts
 * @description 전역 Confirm 모달 상태 관리 스토어 (Zustand)
 */

import { create } from 'zustand'

type ModalButton = {
  text: string
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
}

type ModalState = {
  isOpen: boolean
  title: string
  description: string
  buttons: ModalButton[]
}

type GlobalModalStore = ModalState & {
  /** 확인 모달 열기 (Promise 반환) */
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
  title: '',
  description: '',
  buttons: [],
}

export const useGlobalModalStore = create<GlobalModalStore>((set, get) => ({
  ...initialState,

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
