import { Badge } from '@/shared/ui'

interface MeetingDetailHeaderProps {
  children: string
}

export function MeetingDetailHeader({ children }: MeetingDetailHeaderProps) {
  //스케줄 기반이 아닌 약속전 중 후 데이터로 수정해야 함
  return (
    <>
      <div className="flex items-start border-b gap-small border-b-grey-300 pb-[10px]">
        <h3 className="text-black typo-heading3">{children}</h3>
        <Badge size="small" color="yellow">
          약속 전
        </Badge>
      </div>
    </>
  )
}
