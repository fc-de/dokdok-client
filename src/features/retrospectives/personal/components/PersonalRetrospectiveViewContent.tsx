import { useEffect, useMemo, useState } from 'react'

import { ExcerptBlock } from '@/features/book'
import { Division } from '@/shared/components/Division'
import { cn } from '@/shared/lib/utils'

import {
  PERSONAL_RETRO_SECTION_IDS,
  PERSONAL_RETRO_STICKY_OFFSET,
} from '../personalRetrospective.constants'
import type { GetPersonalRetrospectiveViewResponse } from '../personalRetrospective.types'

export interface PersonalRetrospectiveViewContentProps {
  data: GetPersonalRetrospectiveViewResponse
}

/**
 * 개인 회고 뷰 콘텐츠
 *
 * @description
 * 작성 완료된 개인 회고를 읽기 전용으로 표시합니다.
 * 좌측 앵커 네비게이션을 통해 각 섹션으로 이동할 수 있습니다.
 *
 * @example
 * ```tsx
 * <PersonalRetrospectiveViewContent data={viewData} />
 * ```
 */
export default function PersonalRetrospectiveViewContent({
  data,
}: PersonalRetrospectiveViewContentProps) {
  const { changedThoughts, othersPerspectives, freeTexts } = data.retrospective
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const anchors = useMemo(
    () =>
      [
        changedThoughts.length > 0 && {
          id: PERSONAL_RETRO_SECTION_IDS.changedThoughts,
          label: '바뀐 나의 생각',
        },
        othersPerspectives.length > 0 && {
          id: PERSONAL_RETRO_SECTION_IDS.othersPerspective,
          label: '타인의 관점',
        },
        freeTexts.length > 0 && { id: PERSONAL_RETRO_SECTION_IDS.freeRecord, label: '자유 기록' },
      ].filter(Boolean) as { id: string; label: string }[],
    [changedThoughts.length, othersPerspectives.length, freeTexts.length]
  )

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null

    const computeSection = () => {
      let current: string | null = null
      for (const { id } of anchors) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= PERSONAL_RETRO_STICKY_OFFSET) {
          current = id
        }
      }
      setActiveSection(current)
    }

    const handleScroll = () => {
      if (timerId !== null) return
      timerId = setTimeout(() => {
        timerId = null
        computeSection()
      }, 100)
    }

    computeSection()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timerId !== null) clearTimeout(timerId)
    }
  }, [anchors])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - PERSONAL_RETRO_STICKY_OFFSET + 1
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="flex gap-[187.5px] pt-[22.5px] pb-25">
      {/* 좌측 앵커 네비게이션 */}
      {anchors.length > 0 && (
        <nav className="hidden md:block w-[129px] shrink-0">
          <div className="sticky sticky-retro-view-nav flex flex-col gap-large">
            {anchors.map(({ id, label }) => {
              const isActive = activeSection === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    'pl-medium py-small text-left border-l-2 transition-colors cursor-pointer',
                    isActive ? 'border-black' : 'border-transparent'
                  )}
                >
                  <span
                    className={cn(
                      'transition-colors typo-subtitle2',
                      isActive ? 'text-black' : 'text-grey-700'
                    )}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {/* 우측 섹션 콘텐츠 */}
      <div className="flex-1 flex flex-col gap-large min-w-0">
        {/* 바뀐 나의 생각 */}
        {changedThoughts.length > 0 && (
          <section
            id={PERSONAL_RETRO_SECTION_IDS.changedThoughts}
            className="flex flex-col gap-medium"
          >
            <h3 className="text-black typo-heading3">바뀐 나의 생각</h3>
            <div className="flex flex-col gap-xlarge">
              {changedThoughts.map((item) => (
                <div key={item.topicId} className="flex flex-col gap-medium">
                  <div className="flex flex-col gap-base">
                    <p className="text-black typo-subtitle2">{item.topicTitle}</p>
                    {item.keyIssue && <p className="text-black typo-body1">{item.keyIssue}</p>}
                  </div>

                  {item.preOpinion && item.postOpinion ? (
                    <div className="grid grid-cols-2 gap-base">
                      <div className="flex flex-col gap-[14px]">
                        <span className="text-grey-700 typo-body4">모임 전 내 의견</span>
                        <div className="rounded-small bg-grey-200 px-medium py-base">
                          <p className="text-grey-800 typo-body1 whitespace-pre-wrap">
                            {item.preOpinion}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-tiny">
                        <span className="text-grey-600 typo-body4">모임 후 나의 생각</span>
                        <div className="rounded-small px-medium py-base">
                          <p className="text-black typo-body1 whitespace-pre-wrap">
                            {item.postOpinion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : item.preOpinion ? (
                    <div className="flex flex-col gap-tiny">
                      <span className="text-grey-600 typo-body4">모임 전 내 의견</span>
                      <div className="rounded-small bg-grey-200 border border-grey-300 p-medium">
                        <p className="text-black typo-body3 whitespace-pre-wrap">
                          {item.preOpinion}
                        </p>
                      </div>
                    </div>
                  ) : item.postOpinion ? (
                    <div className="flex flex-col gap-xsmall">
                      <span className="text-grey-600 typo-body4">모임 후 내 의견</span>
                      <p className="text-black typo-body1 whitespace-pre-wrap">
                        {item.postOpinion}
                      </p>
                    </div>
                  ) : !item.keyIssue ? (
                    <p className="text-grey-500 typo-body3">해당 기록이 없어요</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 바뀐 나의 생각 → 타인의 관점/자유 기록 사이 구분선 */}
        {changedThoughts.length > 0 && (othersPerspectives.length > 0 || freeTexts.length > 0) && (
          <Division className="my-base" />
        )}

        {/* 타인의 관점 */}
        {othersPerspectives.length > 0 && (
          <section
            id={PERSONAL_RETRO_SECTION_IDS.othersPerspective}
            className="flex flex-col gap-medium"
          >
            <h3 className="text-black typo-heading3">타인의 관점</h3>
            <div className="flex flex-col gap-xlarge">
              {othersPerspectives.map((item) => (
                <div
                  key={`${item.topicId}-${item.meetingMemberId}`}
                  className="flex flex-col gap-medium"
                >
                  <span className="text-black typo-subtitle2">{item.topicTitle}</span>
                  <ExcerptBlock>
                    <p className="text-grey-700 typo-body3 whitespace-pre-wrap">
                      {item.opinionContent}
                    </p>
                    <span className="text-grey-600 typo-body5">{item.nickname}</span>
                  </ExcerptBlock>

                  {item.impressiveReason && (
                    <p className="text-grey-700 typo-body3 whitespace-pre-wrap">
                      {item.impressiveReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 타인의 관점 → 자유 기록 사이 구분선 */}
        {othersPerspectives.length > 0 && freeTexts.length > 0 && <Division className="my-base" />}

        {/* 자유 기록 */}
        {freeTexts.length > 0 && (
          <section id={PERSONAL_RETRO_SECTION_IDS.freeRecord} className="flex flex-col gap-medium">
            <h3 className="text-black typo-heading3">자유 기록</h3>
            <div className="flex flex-col gap-medium">
              {freeTexts.map((item) => (
                <div
                  key={`${item.title ?? ''}-${item.content ?? ''}`}
                  className="flex flex-col gap-xsmall"
                >
                  {item.title && <p className="text-black typo-subtitle2">{item.title}</p>}
                  {item.content && (
                    <p className="text-black typo-body1 whitespace-pre-wrap">{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
