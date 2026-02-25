export default function AlertIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  // className에서 text-* 또는 bg-* 색상 클래스 추출
  // 예: text-purple-200 → purple-200, bg-accent-300 → accent-300
  const colorMatch = className.match(/(?:text-|bg-)([a-z]+-\d+)(?:\s|$)/)
  const fillColor = colorMatch ? `var(--color-${colorMatch[1]})` : 'var(--color-purple-200)'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      {...props}
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
