import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Tabs (탭 네비게이션)
 * - `size`로 탭 크기를 지정합니다: small, medium, large
 * - `badge`를 사용하면 탭 옆에 숫자 배지가 표시됩니다 (medium, large만 지원)
 * - `value`, `onValueChange`로 controlled 모드로 사용할 수 있습니다.
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList size="medium">
 *     <TabsTrigger value="tab1" size="medium" badge={12}>전체</TabsTrigger>
 *     <TabsTrigger value="tab2" size="medium" badge={5}>진행중</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">전체 목록</TabsContent>
 *   <TabsContent value="tab2">진행중 목록</TabsContent>
 * </Tabs>
 * ```
 */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  size?: 'small' | 'medium' | 'large'
}

function TabsList({ className, size = 'small', ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-size={size}
      className={cn('inline-flex items-center gap-4', className)}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  size?: 'small' | 'medium' | 'large'
  badge?: React.ReactNode
}

function TabsTrigger({ className, size = 'small', badge, children, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-size={size}
      className={cn(
        'group inline-flex items-center gap-tiny cursor-pointer transition-colors whitespace-nowrap disabled:pointer-events-none disabled:opacity-50',
        // Small
        size === 'small' && [
          'typo-body3 text-grey-600',
          'data-[state=active]:typo-body2 data-[state=active]:text-black',
        ],
        // Medium
        size === 'medium' && [
          'typo-subtitle3 text-grey-700 pb-[12px]',
          'data-[state=active]:typo-subtitle2 data-[state=active]:text-black',
          'data-[state=active]:border-b-2 data-[state=active]:border-black',
        ],
        // Large
        size === 'large' && ['typo-subtitle1 text-grey-600', 'data-[state=active]:text-black'],
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {badge !== undefined && size !== 'small' && (
        <span
          data-slot="tabs-badge"
          className={cn(
            'inline-flex items-center justify-center rounded-tiny',
            // Medium badge
            size === 'medium' && [
              'typo-body3 text-grey-700 bg-grey-200 size-6',
              'group-data-[state=active]:text-black',
            ],
            // Large badge
            size === 'large' && [
              'typo-caption2 text-white bg-grey-500 px-2 py-0.5',
              'group-data-[state=active]:bg-black group-data-[state=active]:text-white',
            ]
          )}
        >
          {badge}
        </span>
      )}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
