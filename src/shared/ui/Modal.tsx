import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Modal 컴포넌트의 루트
 *
 * @description Radix Dialog를 기반으로 한 모달 루트 컴포넌트
 *
 * @example
 * ```tsx
 * <Modal>
 *   <ModalTrigger asChild>
 *     <Button>모달 열기</Button>
 *   </ModalTrigger>
 *   <ModalContent variant="normal">
 *     <ModalHeader>
 *       <ModalTitle>모달 제목</ModalTitle>
 *     </ModalHeader>
 *     <ModalBody>모달 내용</ModalBody>
 *     <ModalFooter>
 *       <Button>확인</Button>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 * ```
 */
function Modal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="modal" {...props} />
}

/**
 * Modal을 열기 위한 트리거 컴포넌트
 */
function ModalTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="modal-trigger" {...props} />
}

/**
 * Modal을 프로그래밍 방식으로 닫기 위한 컴포넌트
 */
function ModalClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="modal-close" {...props} />
}

const modalContentVariants = cva(
  [
    'fixed left-1/2 top-1/2 z-150 -translate-x-1/2 -translate-y-1/2',
    'flex flex-col bg-white rounded-small',
    'h-[625px]',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'focus:outline-none',
  ].join(' '),
  {
    variants: {
      variant: {
        normal: 'w-[600px]',
        wide: 'w-[900px]',
      },
    },
    defaultVariants: {
      variant: 'normal',
    },
  }
)

export interface ModalContentProps
  extends
    React.ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {}

/**
 * Modal의 콘텐츠 컨테이너
 *
 * @description
 * - `normal`: 600px 너비 (기본값)
 * - `wide`: 900px 너비
 * - 높이는 625px로 고정
 *
 * @example
 * ```tsx
 * <ModalContent variant="wide">
 *   <ModalHeader>
 *     <ModalTitle>넓은 모달</ModalTitle>
 *   </ModalHeader>
 *   <ModalBody>내용</ModalBody>
 * </ModalContent>
 * ```
 */
function ModalContent({ className, variant, children, ...props }: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="modal-overlay"
        className={cn(
          'fixed inset-0 z-150 bg-black/60',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
        )}
      />
      <DialogPrimitive.Content
        data-slot="modal-content"
        className={cn(modalContentVariants({ variant, className }))}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 닫기 버튼 숨김 여부 */
  hideCloseButton?: boolean
}

/**
 * Modal의 헤더 영역
 *
 * @description 타이틀과 닫기 버튼을 포함하는 고정 높이 헤더
 *
 * @example
 * ```tsx
 * <ModalHeader>
 *   <ModalTitle>모달 제목</ModalTitle>
 * </ModalHeader>
 *
 * // 닫기 버튼 숨기기
 * <ModalHeader hideCloseButton>
 *   <ModalTitle>모달 제목</ModalTitle>
 * </ModalHeader>
 * ```
 */
function ModalHeader({ className, hideCloseButton = false, children, ...props }: ModalHeaderProps) {
  return (
    <div
      data-slot="modal-header"
      className={cn(
        'flex items-center justify-between shrink-0',
        'px-xlarge pt-[36px] pb-base',
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {!hideCloseButton && (
        <DialogPrimitive.Close
          data-slot="modal-close-button"
          className={cn('text-grey-600 cursor-pointer', 'transition-colors focus:outline-none')}
        >
          <X className="size-6" />
          <span className="sr-only">닫기</span>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/**
 * Modal의 타이틀 컴포넌트
 *
 * @example
 * ```tsx
 * <ModalTitle>모달 제목</ModalTitle>
 * ```
 */
function ModalTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="modal-title"
      className={cn('typo-heading3 text-black', className)}
      {...props}
    />
  )
}

/**
 * Modal의 설명 컴포넌트 (접근성용)
 *
 * @example
 * ```tsx
 * <ModalDescription>모달에 대한 설명</ModalDescription>
 * ```
 */
function ModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="modal-description"
      className={cn('typo-body2 text-grey-600', className)}
      {...props}
    />
  )
}

/**
 * Modal의 본문 영역
 *
 * @description
 * Header와 Footer를 제외한 나머지 공간을 차지하며,
 * 내용이 넘칠 경우 세로 스크롤이 발생합니다.
 *
 * @example
 * ```tsx
 * <ModalBody>
 *   <p>모달의 주요 내용이 들어갑니다.</p>
 * </ModalBody>
 * ```
 */
function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="modal-body"
      className={cn('flex-1 overflow-y-auto px-xlarge py-xsmall custom-scroll', className)}
      {...props}
    />
  )
}

const modalFooterVariants = cva(
  ['flex items-center shrink-0', 'px-xlarge pt-base pb-large border-t border-grey-300'],
  {
    variants: {
      variant: {
        double: 'justify-end gap-small',
        full: 'justify-stretch',
      },
    },
    defaultVariants: {
      variant: 'double',
    },
  }
)

export interface ModalFooterProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof modalFooterVariants> {}

/**
 * Modal의 푸터 영역
 *
 * @description 액션 버튼들이 위치하는 선택적 고정 영역
 *
 * - `double`: 버튼을 오른쪽 정렬 (기본값)
 * - `full`: 버튼이 전체 너비 차지
 *
 * @example
 * ```tsx
 * // 버튼 하나 오른쪽 정렬 (기본)
 * <ModalFooter>
 *   <Button>확인</Button>
 * </ModalFooter>
 *
 * // 버튼 두 개 오른쪽 정렬
 * <ModalFooter>
 *   <ModalClose asChild>
 *     <Button variant="secondary">취소</Button>
 *   </ModalClose>
 *   <Button>확인</Button>
 * </ModalFooter>
 *
 * // 버튼 하나 전체 너비
 * <ModalFooter variant="full">
 *   <Button className="w-full">확인</Button>
 * </ModalFooter>
 * ```
 */
function ModalFooter({ className, variant, ...props }: ModalFooterProps) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(modalFooterVariants({ variant, className }))}
      {...props}
    />
  )
}

export {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
}
