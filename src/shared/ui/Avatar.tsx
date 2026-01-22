import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as HoverCard from '@radix-ui/react-hover-card'
import * as React from 'react'

import CrownIcon from '@/shared/assets/icon/Crown.svg'
import StarIcon from '@/shared/assets/icon/Star.svg'

import { cn } from '../lib/utils'

type AvatarVariant = 'leader' | 'host' | 'member'
type AvatarSize = 'default' | 'sm'

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  variant?: AvatarVariant
  size?: AvatarSize
  disabled?: boolean
}

const AvatarGroupContext = React.createContext(false)

/**
 * Avatar (사용자 프로필 이미지)
 *
 * - `AvatarImage`로 이미지를 표시하고, 로드 실패 시 `AvatarFallback`이 표시됩니다.
 * - 기본 크기는 32x32 (size-8)이며, className으로 커스터마이징 가능합니다.
 * - `variant`로 역할 배지를 표시합니다: "leader" (모임장), "host" (약속장), "member" (기본)
 * - `size`로 뱃지 크기를 조절합니다: "default" (16px), "sm" (12px)
 * - `disabled`로 비활성화 스타일을 적용할 수 있습니다.
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/profile.jpg" alt="사용자" />
 *   <AvatarFallback>홍</AvatarFallback>
 * </Avatar>
 *
 * <Avatar variant="leader">
 *   <AvatarImage src="/leader.jpg" alt="모임장" />
 *   <AvatarFallback>김</AvatarFallback>
 * </Avatar>
 *
 * <Avatar variant="host" size="sm" className="size-6">
 *   <AvatarImage src="/host.jpg" alt="약속장" />
 *   <AvatarFallback>이</AvatarFallback>
 * </Avatar>
 * ```
 */
function Avatar({
  className,
  variant = 'member',
  size = 'default',
  disabled,
  children,
  ...props
}: AvatarProps) {
  const isGrouped = React.useContext(AvatarGroupContext)

  const getBadgeIcon = () => {
    const isSmall = size === 'sm'
    const badgeSize = isSmall ? 'size-3' : 'size-4'
    const badgePosition = isSmall ? '-top-px -right-px' : '-top-0.5 -right-0.5'

    if (variant === 'leader') {
      return (
        <div
          className={cn(
            'absolute flex items-center justify-center rounded-full bg-white shadow-sm',
            badgePosition,
            badgeSize
          )}
        >
          <img src={CrownIcon} className={isSmall ? 'size-2' : 'size-2.5'} alt="모임장 표시" />
          {disabled && (
            <div className="absolute inset-0 rounded-full bg-white/70 pointer-events-none" />
          )}
        </div>
      )
    }
    if (variant === 'host') {
      return (
        <div
          className={cn(
            'absolute flex items-center justify-center rounded-full bg-white shadow-sm',
            badgePosition,
            badgeSize
          )}
        >
          <img src={StarIcon} className={isSmall ? 'size-1.5' : 'size-2'} alt="약속장 표시" />
          {disabled && (
            <div className="absolute inset-0 rounded-full bg-white/70 pointer-events-none" />
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="relative inline-block align-top">
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          'relative flex shrink-0 size-8 overflow-hidden rounded-full',
          isGrouped && 'ring-2 ring-white',
          className
        )}
        {...props}
      >
        {children}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-grey-600/10"
        />

        {disabled && <div className="absolute inset-0 bg-white/70 pointer-events-none" />}
      </AvatarPrimitive.Root>

      {getBadgeIcon()}
    </div>
  )
}

/**
 * AvatarImage (아바타 이미지)
 *
 * - Avatar 내부에서 사용하며, 이미지 로드 실패 시 AvatarFallback이 표시됩니다.
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/profile.jpg" alt="사용자 이름" />
 *   <AvatarFallback>홍</AvatarFallback>
 * </Avatar>
 * ```
 */
function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('block aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

/**
 * AvatarFallback (아바타 폴백)
 *
 * - 이미지 로드 실패 시 표시되는 대체 콘텐츠입니다.
 * - 보통 사용자 이름의 첫 글자를 표시합니다.
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/profile.jpg" alt="홍길동" />
 *   <AvatarFallback>홍</AvatarFallback>
 * </Avatar>
 * ```
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'block size-full rounded-full',
        'flex items-center justify-center bg-grey-100 text-grey-600 text-body2 font-medium',
        className
      )}
      {...props}
    />
  )
}

/**
 * AvatarGroup (아바타 그룹)
 *
 * - 여러 아바타를 겹쳐서 표시합니다.
 * - 아바타끼리 겹치는 부분은 ring 포함 8px입니다.
 * @example
 * ```tsx
 * <AvatarGroup>
 *   <Avatar>
 *     <AvatarImage src="/user1.jpg" alt="사용자1" />
 *     <AvatarFallback>1</AvatarFallback>
 *   </Avatar>
 *   <Avatar>
 *     <AvatarImage src="/user2.jpg" alt="사용자2" />
 *     <AvatarFallback>2</AvatarFallback>
 *   </Avatar>
 *   <AvatarGroupCount items={remainingUsers} preview={remainingUsers[0]}>
 *     +3
 *   </AvatarGroupCount>
 * </AvatarGroup>
 * ```
 */
function AvatarGroup({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <AvatarGroupContext.Provider value={true}>
      <div data-slot="avatar-group" className={cn('flex', className)} {...props}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child
          return (
            <div key={child.key} className={cn(index === 0 ? '' : '-ml-2')}>
              {child}
            </div>
          )
        })}
      </div>
    </AvatarGroupContext.Provider>
  )
}

type AvatarGroupCountItem = {
  id: string
  name: string
  src?: string
  fallbackText?: string
  variant?: AvatarVariant
}

export interface AvatarGroupCountProps extends React.ComponentProps<'div'> {
  items?: AvatarGroupCountItem[]
  preview?: Pick<AvatarGroupCountItem, 'name' | 'src' | 'fallbackText'>
  hoverCardProps?: React.ComponentProps<typeof HoverCard.Root>
}

/**
 * AvatarGroupCount (추가 인원 수 표시)
 *
 * - AvatarGroup 내에서 추가 인원 수를 표시합니다.
 * - `items`를 전달하면 hover 시 목록을 표시합니다.
 * - `preview`로 배경에 표시할 아바타를 지정합니다.
 * - 각 item의 `variant`로 역할 배지를 표시합니다 (기본값: "member").
 * @example
 * ```tsx
 * <AvatarGroup>
 *   <Avatar>
 *     <AvatarImage src="/user1.jpg" alt="사용자1" />
 *     <AvatarFallback>1</AvatarFallback>
 *   </Avatar>
 *   <AvatarGroupCount
 *     items={[
 *       { id: "1", name: "홍길동", src: "/hong.jpg", variant: "leader" },
 *       { id: "2", name: "김철수", variant: "host" },
 *       { id: "3", name: "이영희" }, // 기본값 member
 *     ]}
 *     preview={{ name: "홍길동", src: "/hong.jpg" }}
 *   >
 *     +3
 *   </AvatarGroupCount>
 * </AvatarGroup>
 * ```
 */
function AvatarGroupCount({
  className,
  children,
  items,
  preview,
  hoverCardProps,
  ...props
}: AvatarGroupCountProps) {
  const isGrouped = React.useContext(AvatarGroupContext)

  const previewName = preview?.name ?? ''
  const previewFallback = preview?.fallbackText ?? previewName?.slice(0, 1) ?? '?'
  const hasPreviewImage = Boolean(preview?.src)

  const Trigger = (
    <div
      data-slot="avatar-group-count"
      className={cn('relative inline-block align-top', className)}
      {...props}
    >
      <div
        className={cn(
          'relative flex shrink-0 size-8 overflow-hidden rounded-full',
          isGrouped && 'ring-2 ring-white'
        )}
      >
        {hasPreviewImage ? (
          <img
            src={preview!.src!}
            alt={previewName || '추가 인원'}
            className="block size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-grey-100 text-grey-600 text-body2 font-medium">
            {previewFallback}
          </div>
        )}

        <div aria-hidden className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex items-center justify-center text-white text-body2 font-medium">
          {children}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-grey-600/10"
        />
      </div>
    </div>
  )

  if (!items || items.length === 0) return Trigger

  return (
    <HoverCard.Root openDelay={150} closeDelay={100} {...hoverCardProps}>
      <HoverCard.Trigger asChild>{Trigger}</HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          align="start"
          sideOffset={8}
          className={cn(
            'z-50 min-w-40 rounded-small bg-grey-800 p-base text-white',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'max-h-32 overflow-auto custom-scroll-dark'
          )}
        >
          <ul className="flex flex-col gap-small">
            {items.map((item) => {
              const fallbackText = item.fallbackText ?? item.name?.slice(0, 1) ?? '?'
              return (
                <li key={item.id} className="flex items-center gap-xsmall">
                  <Avatar variant={item.variant} size="sm" className="size-6 ring-0">
                    <AvatarImage src={item.src} alt={item.name} />
                    <AvatarFallback>{fallbackText}</AvatarFallback>
                  </Avatar>
                  <span className="text-body3 leading-none">{item.name}</span>
                </li>
              )
            })}
          </ul>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage }
