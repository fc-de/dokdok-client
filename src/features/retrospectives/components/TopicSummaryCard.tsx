import { Plus, X } from 'lucide-react'

import { Card, Textarea } from '@/shared/ui'

import type { KeyPoint, SummaryTopic } from '../retrospectives.types'

type TopicSummaryCardProps = {
  topic: SummaryTopic
  isEditing: boolean
  editedSummary?: string
  editedKeyPoints?: KeyPoint[]
  onSummaryChange?: (value: string) => void
  onKeyPointsChange?: (keyPoints: KeyPoint[]) => void
}

export default function TopicSummaryCard({
  topic,
  isEditing,
  editedSummary,
  editedKeyPoints,
  onSummaryChange,
  onKeyPointsChange,
}: TopicSummaryCardProps) {
  const { topicTitle, topicDescription, summary, keyPoints } = topic
  const displaySummary = isEditing ? (editedSummary ?? summary) : summary
  const displayKeyPoints = isEditing ? (editedKeyPoints ?? keyPoints) : keyPoints

  // ─── keyPoints 수정 핸들러 ───

  const handleTitleChange = (kpIndex: number, value: string) => {
    onKeyPointsChange?.(
      displayKeyPoints.map((kp, i) => (i === kpIndex ? { ...kp, title: value } : kp))
    )
  }

  const handleDetailChange = (kpIndex: number, detailIndex: number, value: string) => {
    onKeyPointsChange?.(
      displayKeyPoints.map((kp, i) =>
        i === kpIndex
          ? { ...kp, details: kp.details.map((d, j) => (j === detailIndex ? value : d)) }
          : kp
      )
    )
  }

  const handleAddKeyPoint = () => {
    onKeyPointsChange?.([...displayKeyPoints, { title: '', details: [''] }])
  }

  const handleRemoveKeyPoint = (kpIndex: number) => {
    onKeyPointsChange?.(displayKeyPoints.filter((_, i) => i !== kpIndex))
  }

  const handleAddDetail = (kpIndex: number) => {
    onKeyPointsChange?.(
      displayKeyPoints.map((kp, i) =>
        i === kpIndex ? { ...kp, details: [...kp.details, ''] } : kp
      )
    )
  }

  const handleRemoveDetail = (kpIndex: number, detailIndex: number) => {
    onKeyPointsChange?.(
      displayKeyPoints.map((kp, i) =>
        i === kpIndex ? { ...kp, details: kp.details.filter((_, j) => j !== detailIndex) } : kp
      )
    )
  }

  return (
    <Card className="border-0 p-large shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col gap-base">
        {/* 토픽 헤더 */}
        <div className="flex flex-col gap-xxtiny">
          <h3 className="typo-heading3 text-black">{topicTitle}</h3>
          <p className="typo-body4 text-grey-700">{topicDescription}</p>
        </div>

        {/* 핵심요약 + 주요포인트 */}
        <div className="flex flex-col gap-medium">
          {/* 핵심요약 */}
          <div className="flex flex-col gap-small">
            <h5 className="typo-subtitle2 text-black">핵심요약</h5>
            {isEditing ? (
              <Textarea
                value={displaySummary}
                onChange={(e) => onSummaryChange?.(e.target.value)}
                height={80}
              />
            ) : (
              <p className="typo-body3 text-grey-800 whitespace-pre-wrap">{displaySummary}</p>
            )}
          </div>

          {/* 주요포인트 */}
          <div className="flex flex-col gap-small">
            <h5 className="typo-subtitle2 text-black">주요포인트</h5>
            {isEditing ? (
              <div className="rounded-small border border-grey-400 px-medium py-base transition-colors focus-within:border-primary-200">
                {displayKeyPoints.map((kp, kpIndex) => (
                  <div key={kpIndex} className={kpIndex > 0 ? 'mt-base' : ''}>
                    {/* 포인트 제목 */}
                    <div className="flex items-center gap-xsmall">
                      <span className="shrink-0 typo-subtitle2 text-black">{kpIndex + 1}.</span>
                      <input
                        type="text"
                        value={kp.title}
                        onChange={(e) => handleTitleChange(kpIndex, e.target.value)}
                        placeholder="포인트 제목"
                        className="min-w-0 flex-1 bg-transparent leading-5.5 typo-subtitle2 text-black outline-none placeholder:text-grey-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyPoint(kpIndex)}
                        className="shrink-0 p-xtiny text-grey-500 hover:text-accent-300"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* 상세 내용 */}
                    {kp.details.map((detail, detailIndex) => (
                      <div
                        key={detailIndex}
                        className="mt-xtiny flex items-center gap-xsmall pl-base"
                      >
                        <span className="shrink-0 typo-body1 text-black">•</span>
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => handleDetailChange(kpIndex, detailIndex, e.target.value)}
                          placeholder="상세 내용"
                          className="min-w-0 flex-1 bg-transparent leading-[24px] typo-body1 text-black outline-none placeholder:text-grey-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDetail(kpIndex, detailIndex)}
                          className="shrink-0 p-xtiny text-grey-500 hover:text-accent-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {/* 상세 추가 */}
                    <button
                      type="button"
                      onClick={() => handleAddDetail(kpIndex)}
                      className="mt-xtiny flex items-center gap-xtiny pl-base typo-body4 text-grey-500 hover:text-primary-400"
                    >
                      <Plus size={12} />
                      상세 추가
                    </button>
                  </div>
                ))}

                {/* 포인트 추가 */}
                <button
                  type="button"
                  onClick={handleAddKeyPoint}
                  className={`flex items-center gap-xtiny typo-body4 text-grey-500 hover:text-primary-400 ${displayKeyPoints.length > 0 ? 'mt-small' : ''}`}
                >
                  <Plus size={12} />
                  포인트 추가
                </button>
              </div>
            ) : (
              displayKeyPoints.map((kp, kpIndex) => (
                <div key={kpIndex} className="flex flex-col gap-xtiny">
                  <p className="typo-subtitle5 text-black">
                    {kpIndex + 1}. {kp.title}
                  </p>
                  <ul className="list-disc pl-base">
                    {kp.details.map((detail, i) => (
                      <li key={i} className="typo-body3 text-grey-700">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
