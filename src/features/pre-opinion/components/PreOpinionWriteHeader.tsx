import { useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'

const PreOpinionWriteHeader = () => {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="h-0" aria-hidden />
      <div
        className={cn(
          'sticky top-[108px] z-30 bg-white w-screen ml-[calc(-50vw+50%)] transition-shadow duration-200',
          isStuck && '[box-shadow:0_6px_6px_-4px_rgba(17,17,17,0.08)]'
        )}
      >
        <div className="mx-auto max-w-layout-max px-layout-padding h-[65px] pb-tiny">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-xtiny">
              <h3 className="typo-heading3 text-black">사전 의견 작성하기</h3>
              <p className="text-grey-600">
                {'데미안'} · {'헤르만 헤세'}
              </p>
            </div>
            <div className="flex items-center">
              <p className="typo-body6 text-grey-600">{'2025. 12.31 18:36 마지막 저장'}</p>
              <Button className="ml-large mr-xsmall" variant={'secondary'} outline>
                저장하기
              </Button>
              <Button>공유하기</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PreOpinionWriteHeader
