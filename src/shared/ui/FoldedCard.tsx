import { cn } from '../lib/utils'

export interface FoldedCardProps extends React.ComponentProps<'article'> {
  /** 접힌 부분 크기 (기본값: 40px) */
  foldSize?: number
}

/**
 * 종이 접힌 효과가 있는 카드 컴포넌트
 * - 오른쪽 하단에 종이가 접힌 것처럼 보이는 효과를 제공합니다.
 * - 접힌 부분은 grey-200 배경에 shadow-drop 효과가 적용됩니다.
 *
 * @example
 * ```tsx
 * <FoldedCard>
 *   <p>카드 내용</p>
 * </FoldedCard>
 *
 * // 접힌 크기 커스텀
 * <FoldedCard foldSize={60}>
 *   <p>더 큰 접힌 효과</p>
 * </FoldedCard>
 * ```
 */
function FoldedCard({ foldSize = 40, className, children, ...props }: FoldedCardProps) {
  return (
    <article
      className={cn('relative', className)}
      style={{ filter: 'drop-shadow(0 2px 16px rgba(17, 17, 17, 0.06))' }}
      {...props}
    >
      {/* 메인 카드 - 오른쪽 하단 모서리 잘림 */}
      <div
        className="flex flex-col gap-large p-xlarge bg-white rounded-medium"
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${foldSize}px), calc(100% - ${foldSize}px) 100%, 0 100%)`,
        }}
      >
        {children}
      </div>

      {/* 종이 접힌 삼각형 효과 */}
      <div
        className="absolute bottom-0 right-0 bg-grey-200"
        style={{
          width: foldSize,
          height: foldSize,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        }}
      />
    </article>
  )
}

export { FoldedCard }
