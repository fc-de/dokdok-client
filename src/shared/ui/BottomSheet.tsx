import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * BottomSheet 루트 컴포넌트
 *
 * @description Radix Dialog 기반의 모바일용 하단 시트 컴포넌트
 *
 * @example
 * ```tsx
 * <BottomSheet>
 *   <BottomSheetTrigger asChild>
 *     <Button>열기</Button>
 *   </BottomSheetTrigger>
 *   <BottomSheetContent>
 *     <BottomSheetHeader>
 *       <BottomSheetTitle>제목</BottomSheetTitle>
 *     </BottomSheetHeader>
 *     <BottomSheetBody>내용</BottomSheetBody>
 *     <BottomSheetFooter>
 *       <Button className="w-full">확인</Button>
 *     </BottomSheetFooter>
 *   </BottomSheetContent>
 * </BottomSheet>
 * ```
 */
function BottomSheet({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="bottom-sheet" {...props} />
}

/**
 * BottomSheet를 열기 위한 트리거 컴포넌트
 */
function BottomSheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="bottom-sheet-trigger" {...props} />
}

/**
 * BottomSheet를 프로그래밍 방식으로 닫기 위한 컴포넌트
 */
function BottomSheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="bottom-sheet-close" {...props} />
}

/**
 * BottomSheet의 콘텐츠 컨테이너
 *
 * @description
 * 화면 하단에서 슬라이드 업/다운 애니메이션으로 열리고 닫힙니다.
 * 콘텐츠 높이에 맞게 자동으로 크기가 조정되며, 최대 85vh를 초과하지 않습니다.
 *
 * 세 가지 패턴으로 사용합니다:
 * - **Default**: `BottomSheetHeader` (타이틀 + X 버튼) + Body + Footer
 * - **타이틀만**: `BottomSheetHeader hideCloseButton` (X 버튼 없음) + Body + Footer
 * - **Alert**: Header 생략, Body에 아이콘 + 타이틀 + 설명 중앙 정렬 + Footer
 *
 * @example
 * ```tsx
 * // Default 패턴
 * <BottomSheetContent>
 *   <BottomSheetHeader>
 *     <BottomSheetTitle>제목</BottomSheetTitle>
 *   </BottomSheetHeader>
 *   <BottomSheetBody>내용</BottomSheetBody>
 *   <BottomSheetFooter>
 *     <Button className="w-full">확인</Button>
 *   </BottomSheetFooter>
 * </BottomSheetContent>
 * ```
 */
function BottomSheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="bottom-sheet-overlay"
        className={cn(
          'fixed inset-0 z-50 bg-black/60',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
        )}
      />
      <DialogPrimitive.Content
        data-slot="bottom-sheet-content"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50',
          'flex flex-col bg-white',
          'rounded-t-[20px] pt-large',
          'max-h-[85vh]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
          'data-[state=open]:duration-300 data-[state=closed]:duration-200',
          'focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export interface BottomSheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** X 닫기 버튼 숨김 여부 */
  hideCloseButton?: boolean
}

/**
 * BottomSheet의 헤더 영역
 *
 * @description
 * 타이틀과 X 닫기 버튼을 포함합니다.
 * Alert 패턴처럼 헤더가 불필요한 경우 생략하세요.
 *
 * @example
 * ```tsx
 * // X 버튼 포함 (기본)
 * <BottomSheetHeader>
 *   <BottomSheetTitle>시트 제목</BottomSheetTitle>
 * </BottomSheetHeader>
 *
 * // X 버튼 없이 타이틀만
 * <BottomSheetHeader hideCloseButton>
 *   <BottomSheetTitle>시트 제목</BottomSheetTitle>
 * </BottomSheetHeader>
 * ```
 */
function BottomSheetHeader({
  className,
  hideCloseButton = false,
  children,
  ...props
}: BottomSheetHeaderProps) {
  return (
    <div
      data-slot="bottom-sheet-header"
      className={cn(
        'flex items-center justify-between shrink-0',
        '-mt-large px-large pt-large',
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {!hideCloseButton && (
        <DialogPrimitive.Close
          data-slot="bottom-sheet-close-button"
          className={cn('text-grey-600 cursor-pointer', 'transition-colors focus:outline-none')}
        >
          <X className="size-5 text-grey-700" />
          <span className="sr-only">닫기</span>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/**
 * BottomSheet의 타이틀 컴포넌트
 *
 * @example
 * ```tsx
 * <BottomSheetTitle>시트 제목</BottomSheetTitle>
 * ```
 */
function BottomSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="bottom-sheet-title"
      className={cn('typo-m-heading3 text-grey-700', className)}
      {...props}
    />
  )
}

/**
 * BottomSheet의 설명 컴포넌트 (접근성용)
 *
 * @example
 * ```tsx
 * <BottomSheetDescription>시트 설명</BottomSheetDescription>
 * ```
 */
function BottomSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="bottom-sheet-description"
      className={cn('typo-body2 text-grey-600', className)}
      {...props}
    />
  )
}

/**
 * BottomSheet의 본문 영역
 *
 * @description 내용이 넘칠 경우 세로 스크롤이 발생합니다.
 *
 * @example
 * ```tsx
 * <BottomSheetBody>
 *   <p>시트의 주요 내용이 들어갑니다.</p>
 * </BottomSheetBody>
 * ```
 */
function BottomSheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="bottom-sheet-body"
      className={cn('flex-1 overflow-y-auto px-large pt-medium pb-base custom-scroll', className)}
      {...props}
    />
  )
}

/**
 * BottomSheet의 푸터 영역
 *
 * @description 액션 버튼들이 위치하는 고정 하단 영역. safe-area-inset-bottom을 고려한 패딩 적용
 *
 * @example
 * ```tsx
 * <BottomSheetFooter>
 *   <Button className="w-full">확인</Button>
 * </BottomSheetFooter>
 *
 * // 버튼 두 개
 * <BottomSheetFooter>
 *   <BottomSheetClose asChild>
 *     <Button variant="secondary" className="flex-1">취소</Button>
 *   </BottomSheetClose>
 *   <Button className="flex-1">확인</Button>
 * </BottomSheetFooter>
 * ```
 */
function BottomSheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="bottom-sheet-footer"
      className={cn(
        'flex items-center gap-small shrink-0',
        'px-large pt-small pb-large',
        className
      )}
      {...props}
    />
  )
}

export {
  BottomSheet,
  BottomSheetBody,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
}
