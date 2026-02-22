import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useScrollShadow } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/Button'
import { TextButton } from '@/shared/ui/TextButton'

export interface FormPageHeaderProps {
  /** 페이지 제목 */
  title: string
  /** 액션 버튼 텍스트 */
  actionLabel: string
  /** 액션 버튼 클릭 핸들러 */
  onAction: () => void
  /** 액션 버튼 비활성화 여부 */
  isActionDisabled?: boolean
  /** 이동할 경로. 지정하지 않으면 navigate(-1)로 뒤로가기 */
  to?: string
  /** 외부에서 전달하는 추가 클래스 */
  className?: string
}

/**
 * 폼 페이지 상단 헤더 (뒤로가기 + 제목 + 액션 버튼)
 *
 * @description
 * GNB 아래에 sticky로 고정되는 폼 페이지 헤더입니다.
 * 뒤로가기, 페이지 제목, 제출/저장 버튼으로 구성됩니다.
 * 스크롤 시 하단에 shadow가 자동으로 표시됩니다.
 *
 * FullWidthLayout에서 사용하며, 전체 너비를 자연스럽게 차지합니다.
 *
 * @example
 * ```tsx
 * <FormPageHeader
 *   title="약속 만들기"
 *   actionLabel="만들기"
 *   onAction={handleSubmit}
 *   isActionDisabled={isSubmitting}
 * />
 * ```
 */
export default function FormPageHeader({
  title,
  actionLabel,
  onAction,
  isActionDisabled = false,
  to,
  className,
}: FormPageHeaderProps) {
  const navigate = useNavigate()
  const isScrolled = useScrollShadow()

  const handleBack = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <header
      className={cn(
        'sticky top-gnb-height z-40 bg-white transition-shadow',
        isScrolled && 'shadow-drop-bottom',
        className
      )}
    >
      <div className="mx-auto max-w-layout-max px-layout-padding">
        <TextButton size="medium" icon={ChevronLeft} onClick={handleBack} className="py-small">
          뒤로가기
        </TextButton>
        <div className="flex items-center justify-between py-large">
          <h2 className="text-black typo-heading3">{title}</h2>
          <Button className="w-fit" size="small" onClick={onAction} disabled={isActionDisabled}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </header>
  )
}
