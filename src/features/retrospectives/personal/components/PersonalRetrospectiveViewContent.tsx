import { useEffect, useMemo, useRef, useState } from 'react'

import { ExcerptBlock } from '@/features/book'
import { Division } from '@/shared/components/Division'
import { cn } from '@/shared/lib/utils'

import {
  PERSONAL_RETRO_ACTIVE_OFFSET_MOBILE,
  PERSONAL_RETRO_MOBILE_TAB_TOP_CLASS,
  PERSONAL_RETRO_SCROLL_OFFSET_MOBILE,
  PERSONAL_RETRO_SECTION_IDS,
  PERSONAL_RETRO_STICKY_OFFSET,
} from '../personalRetrospective.constants'
import type { GetPersonalRetrospectiveViewResponse } from '../personalRetrospective.types'

export interface PersonalRetrospectiveViewContentProps {
  data: GetPersonalRetrospectiveViewResponse
  /** 모바일 헤더에 부제목(책 제목 · 저자)이 표시되는지 여부: 헤더 높이에 따른 오프셋 계산에 사용 */
  hasSubtitle: boolean
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
 * <PersonalRetrospectiveViewContent data={viewData} hasSubtitle={!!headerSubtitle} />
 * ```
 */
export default function PersonalRetrospectiveViewContent({
  data,
  hasSubtitle,
}: PersonalRetrospectiveViewContentProps) {
  const { changedThoughts, othersPerspectives, freeTexts } = data.retrospective
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const suppressSpyRef = useRef(false)
  const suppressSpyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

    const getActiveOffset = () =>
      window.matchMedia('(min-width: 1024px)').matches
        ? PERSONAL_RETRO_STICKY_OFFSET
        : hasSubtitle
          ? PERSONAL_RETRO_ACTIVE_OFFSET_MOBILE.withSubtitle
          : PERSONAL_RETRO_ACTIVE_OFFSET_MOBILE.withoutSubtitle

    const computeSection = () => {
      const stickyOffset = getActiveOffset()
      let current: string | null = anchors[0]?.id ?? null
      for (let i = 1; i < anchors.length; i++) {
        const dividerId = `divider-${anchors[i].id}`
        const el = document.getElementById(dividerId)
        if (!el) continue
        if (el.getBoundingClientRect().top <= stickyOffset) {
          current = anchors[i].id
        }
      }
      setActiveSection(current)
    }

    const handleScroll = () => {
      if (suppressSpyRef.current) return
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
  }, [anchors, hasSubtitle])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const scrollOffset = window.matchMedia('(min-width: 1024px)').matches
      ? PERSONAL_RETRO_STICKY_OFFSET
      : hasSubtitle
        ? PERSONAL_RETRO_SCROLL_OFFSET_MOBILE.withSubtitle
        : PERSONAL_RETRO_SCROLL_OFFSET_MOBILE.withoutSubtitle
    const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset + 1

    // 클릭으로 이동하는 동안에는 스크롤 스파이가 다른 탭을 active로 덮어쓰지 않도록 일시 중단
    if (suppressSpyTimerRef.current !== null) {
      clearTimeout(suppressSpyTimerRef.current)
    }
    suppressSpyRef.current = true
    setActiveSection(id)
    window.scrollTo({ top, behavior: 'smooth' })
    suppressSpyTimerRef.current = window.setTimeout(() => {
      suppressSpyRef.current = false
      suppressSpyTimerRef.current = null
    }, 600)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-large lg:gap-[187.5px] lg:pt-[22.5px] pb-25">
      {/* 모바일 섹션 탭 */}
      {anchors.length > 0 && (
        <div
          className={cn(
            'sticky z-20 -mx-5 bg-white shadow-drop lg:hidden',
            hasSubtitle
              ? PERSONAL_RETRO_MOBILE_TAB_TOP_CLASS.withSubtitle
              : PERSONAL_RETRO_MOBILE_TAB_TOP_CLASS.withoutSubtitle
          )}
        >
          <div className="flex gap-large overflow-x-auto scrollbar-hide px-5">
            {anchors.map(({ id, label }) => {
              const isActive = activeSection === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    'shrink-0 whitespace-nowrap border-b-2 border-transparent py-base typo-caption2 text-grey-600 transition-colors cursor-pointer',
                    isActive && 'typo-body5 text-primary-300'
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 좌측 앵커 네비게이션 (데스크탑) */}
      {anchors.length > 0 && (
        <nav className="hidden lg:block w-[129px] shrink-0">
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
            <h3 className="text-black typo-heading3 max-lg:typo-subtitle2">바뀐 나의 생각</h3>
            <div className="flex flex-col gap-xlarge">
              {changedThoughts.map((item) => (
                <div key={item.topicId} className="flex flex-col gap-medium">
                  <div className="flex flex-col gap-base">
                    <p className="text-black typo-subtitle2 max-lg:typo-body2">{item.topicTitle}</p>
                    {item.keyIssue && (
                      <p className="text-black typo-body1 max-lg:typo-body4">{item.keyIssue}</p>
                    )}
                  </div>

                  {item.preOpinion || item.postOpinion ? (
                    <div
                      className={cn(
                        'gap-base',
                        item.preOpinion && item.postOpinion
                          ? 'grid grid-cols-1 lg:grid-cols-2'
                          : 'flex flex-col'
                      )}
                    >
                      {item.preOpinion && (
                        <div className="flex flex-col gap-tiny">
                          <span className="text-grey-700 typo-body4 max-lg:typo-body3">
                            모임 전 내 의견
                          </span>
                          <div className="rounded-small bg-grey-200 px-medium py-base">
                            <p className="text-grey-800 typo-body1 whitespace-pre-wrap max-lg:typo-body4">
                              {item.preOpinion}
                            </p>
                          </div>
                        </div>
                      )}
                      {item.postOpinion && (
                        <div className="flex flex-col gap-tiny">
                          <span className="text-grey-600 typo-body4 max-lg:typo-body3">
                            {item.preOpinion ? '모임 후 나의 생각' : '모임 후 내 의견'}
                          </span>
                          <p className="text-black typo-body1 whitespace-pre-wrap max-lg:typo-body4">
                            {item.postOpinion}
                          </p>
                        </div>
                      )}
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
          <Division
            id={`divider-${othersPerspectives.length > 0 ? PERSONAL_RETRO_SECTION_IDS.othersPerspective : PERSONAL_RETRO_SECTION_IDS.freeRecord}`}
            className="my-base"
          />
        )}

        {/* 타인의 관점 */}
        {othersPerspectives.length > 0 && (
          <section
            id={PERSONAL_RETRO_SECTION_IDS.othersPerspective}
            className="flex flex-col gap-medium"
          >
            <h3 className="text-black typo-heading3 max-lg:typo-subtitle2">타인의 관점</h3>
            <div className="flex flex-col gap-xlarge">
              {othersPerspectives.map((item) => (
                <div
                  key={`${item.topicId}-${item.meetingMemberId}`}
                  className="flex flex-col gap-medium"
                >
                  <span className="text-black typo-subtitle2 max-lg:hidden">{item.topicTitle}</span>
                  <ExcerptBlock>
                    <span className="hidden max-lg:block text-black typo-body3 pt-xsmall">
                      {item.topicTitle}
                    </span>
                    <p className="text-grey-700 typo-body3 whitespace-pre-wrap max-lg:typo-body1 max-lg:border-b max-lg:border-grey-300 max-lg:pb-xsmall max-lg:mb-tiny">
                      {item.opinionContent}
                    </p>
                    <span className="text-grey-600 typo-body5 max-lg:typo-body1">
                      {item.nickname}
                    </span>
                  </ExcerptBlock>

                  {item.impressiveReason && (
                    <p className="text-grey-700 typo-body3 whitespace-pre-wrap max-lg:typo-body1">
                      {item.impressiveReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 타인의 관점 → 자유 기록 사이 구분선 */}
        {othersPerspectives.length > 0 && freeTexts.length > 0 && (
          <Division id={`divider-${PERSONAL_RETRO_SECTION_IDS.freeRecord}`} className="my-base" />
        )}

        {/* 자유 기록 */}
        {freeTexts.length > 0 && (
          <section id={PERSONAL_RETRO_SECTION_IDS.freeRecord} className="flex flex-col gap-medium">
            <h3 className="text-black typo-heading3 max-lg:typo-subtitle2">자유 기록</h3>
            <div className="flex flex-col gap-medium">
              {freeTexts.map((item) => (
                <div
                  key={`${item.title ?? ''}-${item.content ?? ''}`}
                  className="flex flex-col gap-xsmall"
                >
                  {item.title && (
                    <p className="text-black typo-subtitle2 max-lg:typo-body2">{item.title}</p>
                  )}
                  {item.content && (
                    <p className="text-black typo-body1 whitespace-pre-wrap max-lg:typo-body1">
                      {item.content}
                    </p>
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
