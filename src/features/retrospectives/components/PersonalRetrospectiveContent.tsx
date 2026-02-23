import { useState } from 'react'

import { Button, TextButton } from '@/shared/ui'

import type { UsePersonalRetrospectiveFormReturn } from '../hooks/usePersonalRetrospectiveForm'
import type { GetPersonalRetrospectiveResponse } from '../personalRetrospective.types'
import ChangedThoughtsSection from './ChangedThoughtsSection'
import FreeRecordSection from './FreeRecordSection'
import OthersPerspectiveSection from './OthersPerspectiveSection'

export interface PersonalRetrospectiveContentProps {
  data: GetPersonalRetrospectiveResponse
  form: UsePersonalRetrospectiveFormReturn
}

type SectionType = 'othersPerspective' | 'freeRecord'

const SECTION_OPTIONS: { type: SectionType; label: string }[] = [
  { type: 'othersPerspective', label: '타인의 관점' },
  { type: 'freeRecord', label: '자유 기록' },
]

/**
 * 개인 회고 콘텐츠
 *
 * @description
 * 개인 회고 페이지의 전체 콘텐츠를 렌더링합니다.
 * 바뀐 나의 생각 섹션은 항상 표시되며, 타인의 관점·자유 기록은
 * '문항 추가하기' 버튼의 드롭다운을 통해 선택적으로 추가할 수 있습니다.
 *
 * @example
 * ```tsx
 * <PersonalRetrospectiveContent data={personalRetrospectiveData} form={form} />
 * ```
 */
export default function PersonalRetrospectiveContent({
  data,
  form,
}: PersonalRetrospectiveContentProps) {
  const { topics, meetingMembers } = data
  const [visibleSections, setVisibleSections] = useState<Record<SectionType, boolean>>({
    othersPerspective: false,
    freeRecord: false,
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const othersPerspectiveVisible =
    visibleSections.othersPerspective && form.othersPerspective.items.length > 0

  const freeRecordVisible =
    visibleSections.freeRecord && form.freeRecord.entries.length > 0

  const availableOptions = SECTION_OPTIONS.filter(({ type }) => {
    if (type === 'othersPerspective') return !othersPerspectiveVisible
    if (type === 'freeRecord') return !freeRecordVisible
    return !visibleSections[type]
  })

  const handleAddSection = (type: SectionType) => {
    if (type === 'othersPerspective') {
      form.othersPerspective.addItem()
    } else if (type === 'freeRecord' && form.freeRecord.entries.length === 0) {
      form.freeRecord.addEntry()
    }
    setVisibleSections((prev) => ({ ...prev, [type]: true }))
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex flex-col gap-large pt-large pb-25">
      {/* 바뀐 나의 생각 */}
      <ChangedThoughtsSection topics={topics} form={form.changedThoughts} />

      {/* 타인의 관점 */}
      {othersPerspectiveVisible && (
        <OthersPerspectiveSection
          topics={topics}
          members={meetingMembers}
          form={form.othersPerspective}
        />
      )}

      {/* 자유 기록 */}
      {freeRecordVisible && <FreeRecordSection form={form.freeRecord} />}

      {/* 문항 추가하기 */}
      {availableOptions.length > 0 && (
        <div className="relative">
          <Button
            variant="secondary"
            outline
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full"
          >
            + 문항 추가하기
          </Button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="flex flex-col py-tiny absolute top-full left-0 right-0 mt-base z-20 overflow-hidden rounded-base border border-grey-300 bg-white shadow-drop">
                {availableOptions.map(({ type, label }) => (
                  <TextButton
                    key={type}
                    onClick={() => handleAddSection(type)}
                    className="px-base py-xsmall text-black"
                  >
                    {label}
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
