interface AlertIconProps {
  className?: string
  size?: number
}

/**
 * 알림 아이콘 컴포넌트
 * @param className - Tailwind 색상 클래스 (text-* 또는 bg-*)로 색상 커스텀 (기본: purple-200)
 * @param size - 아이콘 크기 (기본: 18)
 * @example
 * ```tsx
 * <AlertIcon />
 * <AlertIcon size={24} className="text-red-500" />
 * ```
 */
export default function AlertIcon({ className = '', size = 18 }: AlertIconProps) {
  // className에서 text-* 또는 bg-* 색상 클래스 추출
  // 예: text-purple-200 → purple-200, bg-accent-300 → accent-300
  const colorMatch = className.match(/(?:text-|bg-)([a-z]+-\d+)(?:\s|$)/)
  const fillColor = colorMatch ? `var(--color-${colorMatch[1]})` : 'var(--color-purple-200)'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
        fill={fillColor}
      />
      <path
        d="M9 12V9M9 6H9.0075"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
