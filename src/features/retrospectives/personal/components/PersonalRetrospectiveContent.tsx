import { Plus } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Button, FloatingButton, TextButton } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

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
  const { openConfirm } = useGlobalModalStore()

  const { sectionVisibility, showSection, hideSection } = form

  const availableOptions = SECTION_OPTIONS.filter(({ type }) => !sectionVisibility[type])

  const handleAddSection = (type: SectionKey) => {
    showSection(type)
    setIsDropdownOpen(false)
  }

  const handleCloseSection = async (type: SectionKey) => {
    const label = SECTION_OPTIONS.find((option) => option.type === type)?.label ?? ''
    const confirmed = await openConfirm(
      `${label} 문항을 삭제할까요?`,
      '문항에서 작성하던 모든 내용이 삭제돼요.\n삭제를 진행할까요?',
      { confirmText: '삭제', variant: 'danger' }
    )
    if (!confirmed) return
    hideSection(type)
  }

  useEffect(() => {
    if (form.scrollTrigger === 0) return
    const firstError = containerRef.current?.querySelector('[data-field-error]')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [form.scrollTrigger])

  const sectionOrder: SectionKey[] = ['changedThoughts', 'othersPerspective', 'freeRecord']
  const visibleSections = sectionOrder.filter((key) => sectionVisibility[key])

  return (
    <div
      className="flex flex-col gap-large max-lg:gap-medium pt-large pb-25 max-lg:pb-13"
      ref={containerRef}
    >
      {visibleSections.map((key, index) => (
        <Fragment key={key}>
          {/* 모바일: 섹션 사이 전체 폭 구분선 */}
          {index > 0 && <div className="hidden max-lg:block -mx-5 h-2.5 bg-grey-100" aria-hidden />}

          {key === 'changedThoughts' && (
            <ChangedThoughtsSection
              topics={topics}
              form={form.changedThoughts}
              showErrors={form.showErrors}
              onClose={() => handleCloseSection('changedThoughts')}
            />
          )}
          {key === 'othersPerspective' && (
            <OthersPerspectiveSection
              topics={topics}
              members={meetingMembers}
              form={form.othersPerspective}
              showErrors={form.showErrors}
              onClose={() => handleCloseSection('othersPerspective')}
            />
          )}
          {key === 'freeRecord' && (
            <FreeRecordSection
              form={form.freeRecord}
              showErrors={form.showErrors}
              onClose={() => handleCloseSection('freeRecord')}
            />
          )}
        </Fragment>
      ))}

      {/* 문항 추가하기 (PC) */}
      {availableOptions.length > 0 && (
        <div className="relative max-lg:hidden">
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

      {/* 문항 추가하기 (모바일 FAB) */}
      {availableOptions.length > 0 && (
        <div className="hidden max-lg:block">
          <div className="fixed right-5 z-40 bottom-[calc(5.375rem+env(safe-area-inset-bottom)+17px)]">
            <div className="relative">
              <FloatingButton
                variant="secondary"
                outline
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="static! bottom-auto! right-auto! border-none! typo-m-subtitle1"
              >
                <Plus className="size-4" />
                문항 추가하기
              </FloatingButton>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="flex flex-col absolute bottom-full right-0 mb-base z-20 w-40 overflow-hidden rounded-base bg-white shadow-drop">
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
          </div>
        </div>
      )}
    </div>
  )
}
