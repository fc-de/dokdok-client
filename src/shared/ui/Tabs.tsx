import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/shared/lib/utils'

// Tabs Root
function Tabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn('flex flex-col gap-2', className)}
            {...props}
        />
    )
}

// Tabs List
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

// Tabs Trigger
interface TabsTriggerProps
    extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
    size?: 'small' | 'medium' | 'large'
    badge?: React.ReactNode
}

function TabsTrigger({
    className,
    size = 'small',
    badge,
    children,
    ...props
}: TabsTriggerProps) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            data-size={size}
            className={cn(
                'group inline-flex items-center gap-tiny cursor-pointer transition-colors whitespace-nowrap disabled:pointer-events-none disabled:opacity-50',
                // Small
                size === 'small' && [
                    'text-body3 text-grey-600',
                    'data-[state=active]:text-body2 data-[state=active]:text-black',
                ],
                // Medium
                size === 'medium' && [
                    'text-subtitle3 text-grey-700 pb-[12px]',
                    'data-[state=active]:text-subtitle2 data-[state=active]:text-black',
                    'data-[state=active]:border-b-2 data-[state=active]:border-black',
                ],
                // Large
                size === 'large' && [
                    'text-subtitle1 text-grey-600',
                    'data-[state=active]:text-black',
                ],
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
                            'text-body3 text-grey-700 bg-grey-200 size-6',
                            'group-data-[state=active]:text-black',
                        ],
                        // Large badge
                        size === 'large' && [
                            'text-caption2 text-white bg-grey-500 px-2 py-0.5',
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

// Tabs Content
function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn('flex-1 outline-none', className)}
            {...props}
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

/*
 * 사용 예시:
 *
 * import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs'
 *
 * // Small 사이즈 (기본)
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">탭 1</TabsTrigger>
 *     <TabsTrigger value="tab2">탭 2</TabsTrigger>
 *     <TabsTrigger value="tab3">탭 3</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">탭 1 내용</TabsContent>
 *   <TabsContent value="tab2">탭 2 내용</TabsContent>
 *   <TabsContent value="tab3">탭 3 내용</TabsContent>
 * </Tabs>
 *
 * // Medium 사이즈 (badge 포함, 밑줄 있음)
 * <Tabs defaultValue="tab1">
 *   <TabsList size="medium">
 *     <TabsTrigger value="tab1" size="medium" badge={12}>전체</TabsTrigger>
 *     <TabsTrigger value="tab2" size="medium" badge={5}>진행중</TabsTrigger>
 *     <TabsTrigger value="tab3" size="medium" badge={3}>완료</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">전체 목록</TabsContent>
 *   <TabsContent value="tab2">진행중 목록</TabsContent>
 *   <TabsContent value="tab3">완료 목록</TabsContent>
 * </Tabs>
 *
 * // Large 사이즈 (badge 포함)
 * <Tabs defaultValue="tab1">
 *   <TabsList size="large">
 *     <TabsTrigger value="tab1" size="large" badge={99}>인기</TabsTrigger>
 *     <TabsTrigger value="tab2" size="large" badge={24}>최신</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">인기 콘텐츠</TabsContent>
 *   <TabsContent value="tab2">최신 콘텐츠</TabsContent>
 * </Tabs>
 *
 * // badge 없이 사용
 * <TabsTrigger value="tab1" size="medium">텍스트만</TabsTrigger>
 *
 * // Controlled
 * const [activeTab, setActiveTab] = useState('tab1')
 * <Tabs value={activeTab} onValueChange={setActiveTab}>
 *   ...
 * </Tabs>
 */
