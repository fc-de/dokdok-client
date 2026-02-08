import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/shared/lib/utils'
import { TextButton } from '@/shared/ui/TextButton'

export interface SubPageHeaderProps {
  /** 표시할 텍스트 (기본값: '뒤로가기') */
  label?: string
  /** 이동할 경로. 지정하지 않으면 navigate(-1)로 뒤로가기 */
  to?: string
  /** 외부에서 전달하는 추가 클래스 */
  className?: string
}

/**
 * 서브페이지 상단 뒤로가기 내비게이션
 *
 * @description
 * GNB 아래에 sticky로 고정되는 뒤로가기 헤더입니다.
 * 기본 동작은 브라우저 히스토리 뒤로가기이며,
 * `to` prop으로 특정 경로를 지정할 수 있습니다.
 *
 * @example
 * ```tsx
 * <SubPageHeader />
 * <SubPageHeader label="내 책장" to="/books" />
 * ```
 */
export default function SubPageHeader({ label = '뒤로가기', to, className }: SubPageHeaderProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <nav
      aria-label={`${label} 페이지로 이동`}
      className={cn('sticky top-gnb-height z-40 bg-white w-screen ml-[calc(-50vw+50%)]', className)}
    >
      <div className="mx-auto max-w-layout-max px-layout-padding py-small h-[59px]">
        <TextButton size="medium" icon={ChevronLeft} onClick={handleClick}>
          {label}
        </TextButton>
      </div>
    </nav>
  )
}
