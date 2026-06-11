import { useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button, TextButton } from '@/shared/ui'

import type { SectionKey } from '../hooks/usePersonalRetrospectiveForm'
import type { UsePersonalRetrospectiveFormReturn } from '../hooks/usePersonalRetrospectiveForm'
import type {
  PersonalRetrospectiveMember,
  PersonalRetrospectiveTopic,
} from '../personalRetrospective.types'
import ChangedThoughtsSection from './ChangedThoughtsSection'
import FreeRecordSection from './FreeRecordSection'
import OthersPerspectiveSection from './OthersPerspectiveSection'

export interface PersonalRetrospectiveContentProps {
  topics: PersonalRetrospectiveTopic[]
  meetingMembers: PersonalRetrospectiveMember[]
  form: UsePersonalRetrospectiveFormReturn
}

const SECTION_OPTIONS: { type: SectionKey; label: string }[] = [
  { type: 'changedThoughts', label: '바뀐 나의 생각' },
  { type: 'othersPerspective', label: '타인의 관점' },
  { type: 'freeRecord', label: '자유 기록' },
]

/**
 * 개인 회고 콘텐츠
 *
 * @description
 * 개인 회고 페이지의 전체 콘텐츠를 렌더링합니다.
 * 각 섹션은 X 버튼으로 닫을 수 있으며, '문항 추가하기' 드롭다운으로 다시 열 수 있습니다.
 *
 * @example
 * ```tsx
 * <PersonalRetrospectiveContent topics={topics} meetingMembers={meetingMembers} form={form} />
 * ```
 */
export default function PersonalRetrospectiveContent({
  topics,
  meetingMembers,
  form,
}: PersonalRetrospectiveContentProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { sectionVisibility, showSection, hideSection } = form

  const availableOptions = SECTION_OPTIONS.filter(({ type }) => !sectionVisibility[type])

  const handleAddSection = (type: SectionKey) => {
    showSection(type)
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    if (form.scrollTrigger === 0) return
    const firstError = containerRef.current?.querySelector('[data-field-error]')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [form.scrollTrigger])

  return (
    <div className="flex flex-col gap-large pt-large pb-25" ref={containerRef}>
      {/* 바뀐 나의 생각 */}
      {sectionVisibility.changedThoughts && (
        <ChangedThoughtsSection
          topics={topics}
          form={form.changedThoughts}
          onClose={() => hideSection('changedThoughts')}
        />
      )}

      {/* 타인의 관점 */}
      {sectionVisibility.othersPerspective && (
        <OthersPerspectiveSection
          topics={topics}
          members={meetingMembers}
          form={form.othersPerspective}
          showErrors={form.showErrors}
          onClose={() => hideSection('othersPerspective')}
        />
      )}

      {/* 자유 기록 */}
      {sectionVisibility.freeRecord && (
        <FreeRecordSection
          form={form.freeRecord}
          showErrors={form.showErrors}
          onClose={() => hideSection('freeRecord')}
        />
      )}

      {/* 문항 추가하기 */}
      {availableOptions.length > 0 && (
        <div className="relative">
          <Button
            variant="secondary"
            outline
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full h-auto py-base typo-body2"
          >
            + 문항 추가하기
          </Button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="flex flex-col absolute top-full left-0 right-0 mt-base z-20 overflow-hidden rounded-base bg-white shadow-drop">
                {availableOptions.map(({ type, label }, index) => (
                  <TextButton
                    key={type}
                    onClick={() => handleAddSection(type)}
                    className={cn(
                      'px-medium py-base text-black hover:bg-grey-300 typo-subtitle4',
                      index > 0 && 'border-t border-grey-400',
                      index === 0 && 'rounded-t-base',
                      index === availableOptions.length - 1 && 'rounded-b-base'
                    )}
                  >
                    + {label}
                  </TextButton>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
