import type { LucideIcon } from 'lucide-react'
import { createElement } from 'react'

interface MeetingInfoIconProps {
  icon: LucideIcon
}

export default function MeetingInfoIcon({ icon }: MeetingInfoIconProps) {
  return (
    <span className="flex items-center justify-center size-[42px] rounded-small bg-grey-100 shrink-0">
      {createElement(icon, { size: 24, className: 'text-grey-700' })}
    </span>
  )
}
