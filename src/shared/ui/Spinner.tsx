type SpinnerProps = {
  height?: 'full' | 'fit'
}

const SpinnerSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    className="animate-spin"
  >
    <path
      d="M54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27ZM5.4 27C5.4 38.9294 15.0706 48.6 27 48.6C38.9294 48.6 48.6 38.9294 48.6 27C48.6 15.0706 38.9294 5.4 27 5.4C15.0706 5.4 5.4 15.0706 5.4 27Z"
      fill="#F7F7F7"
    />
    <path
      d="M51.3 27C52.7912 27 54.014 28.2118 53.8651 29.6956C53.3893 34.4383 51.664 38.9881 48.8435 42.8702C46.0229 46.7523 42.229 49.7991 37.8654 51.7173C36.5003 52.3174 34.9699 51.5289 34.5091 50.1107C34.0483 48.6925 34.8343 47.1844 36.1839 46.5504C39.4682 45.0075 42.3249 42.6552 44.4748 39.6962C46.6246 36.7372 47.9791 33.2933 48.4315 29.6931C48.6174 28.2135 49.8088 27 51.3 27Z"
      fill="#56CDAF"
    />
  </svg>
)

export function Spinner({ height = 'fit' }: SpinnerProps) {
  if (height === 'full') {
    return (
      <div className="flex h-[calc(100vh-var(--spacing-gnb-height))] items-center justify-center">
        <SpinnerSvg />
      </div>
    )
  }

  return <SpinnerSvg />
}
