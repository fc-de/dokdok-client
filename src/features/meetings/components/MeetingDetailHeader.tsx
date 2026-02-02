import { Badge } from '@/shared/ui'

interface MeetingDetailHeaderProps {
  children: string
  statusBadgeText: string
}

export function MeetingDetailHeader({ children, statusBadgeText }: MeetingDetailHeaderProps) {
  return (
    <>
      <div className="flex items-start border-b gap-small border-b-grey-300 pb-[10px]">
        <h3 className="text-black typo-heading3">{children}</h3>
        <Badge size="small" color="yellow">
          {statusBadgeText}
        </Badge>
      </div>
    </>
  )
}
