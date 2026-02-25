import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex flex-col gap-xsmall', className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={className} {...props} />
}

type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  showIcon?: boolean
}

function AccordionTrigger({
  className,
  children,
  showIcon = true,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md p-base text-left typo-subtitle5 text-black transition-all outline-hidden focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 border-grey-300 [&[data-state=open]>svg]:rotate-180 border data-[state=open]:border-primary-300 bg-white data-[state=open]:shadow-drop',
          className
        )}
        {...props}
      >
        {children}
        {showIcon && (
          <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden typo-body4 text-black',
        className
      )}
      {...props}
    >
      <div className="py-base px-xsmall">{children}</div>
    </AccordionPrimitive.Content>
  )
}

/**
 * 아코디언 컴포넌트
 * - `Accordion.Item`, `Accordion.Trigger`, `Accordion.Content`를 children으로 넣어 사용합니다.
 *
 * @example
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
 *     <Accordion.Content>
 *       Yes. It adheres to the WAI-ARIA design pattern.
 *     </Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
const AccordionNamespace = Object.assign(Accordion, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})

export { AccordionNamespace as Accordion }
