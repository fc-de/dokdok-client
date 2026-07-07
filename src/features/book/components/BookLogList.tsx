import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type {
  MeetingPersonalRecord,
  PersonalRecord,
  RecordSortType,
  RecordType,
} from '@/features/book/book.types'
import BookLogListSkeleton from '@/features/book/components/BookLogListSkeleton'
import MeetingGroupRecordItem from '@/features/book/components/MeetingGroupRecordItem'
import MeetingPreOpinionItem from '@/features/book/components/MeetingPreOpinionItem'
import MeetingRetrospectiveItem from '@/features/book/components/MeetingRetrospectiveItem'
import PersonalRecordItem from '@/features/book/components/PersonalRecordItem'
import PersonalRecordModal from '@/features/book/components/PersonalRecordModal'
import { useBookGatherings, useBookLogDeleteActions, useBookRecords } from '@/features/book/hooks'
import { ROUTES } from '@/shared/constants/routes'
import { useInfiniteScroll, useScrollCollapse } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/Button'
import { FilterDropdown } from '@/shared/ui/FilterDropdown'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/Tabs'

type BookLogListProps = {
  personalBookId: number
  isRecording: boolean
}

type OpenDropdown = 'gathering' | 'recordType' | null

const BookLogList = ({ personalBookId, isRecording }: BookLogListProps) => {
  const isSticky = useScrollCollapse({ collapseThreshold: 500, expandThreshold: 100 })
  const [selectedGathering, setSelectedGathering] = useState('')
  const [recordType, setRecordType] = useState<RecordType | ''>('')
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null)
  const [sortType, setSortType] = useState<RecordSortType>('DESC')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingRecord, setEditingRecord] = useState<PersonalRecord | null>(null)

  const navigate = useNavigate()
  const { deletePersonalRecord, deletePreOpinion, deleteRetrospective } =
    useBookLogDeleteActions(personalBookId)

  const { data: gatherings = [], isLoading: isGatheringsLoading } =
    useBookGatherings(personalBookId)

  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookRecords(personalBookId, {
    gatheringId: selectedGathering ? Number(selectedGathering) : undefined,
    recordType: recordType || undefined,
    sort: sortType,
  })

  const allRecords = recordsData?.pages.flatMap((page) => page.items) ?? []

  const observerRef = useInfiniteScroll(fetchNextPage, {
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRecordsLoading,
  })

  const handleGatheringChange = (value: string) => {
    setSelectedGathering(value)
    if (value) setRecordType('')
  }

  const handleRecordTypeChange = (value: string) => {
    setRecordType(value as RecordType | '')
    if (value) setSelectedGathering('')
  }

  const handleCreateRecord = () => {
    setModalMode('create')
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  const handleEditRecord = (record: PersonalRecord) => {
    setModalMode('edit')
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const handleEditPersonalRetrospective = (record: MeetingPersonalRecord) => {
    navigate(`${ROUTES.PERSONAL_RETROSPECTIVE(record.gatheringId, record.meetingId)}?mode=edit`)
  }

  return (
    <section>
      {/* 감상 기록 헤더 - sticky */}
      <div
        className={cn(
          'sticky top-[calc(var(--spacing-gnb-height)+44px)] z-30 bg-white transition-shadow max-lg:top-12.25',
          isSticky && 'shadow-drop-bottom'
        )}
      >
        <div className="mx-auto max-w-layout-max px-layout-padding py-base max-lg:px-5">
          <div className="flex justify-between mb-base">
            <h2 className="typo-heading2 text-grey-800">감상 기록</h2>
            {isRecording && <Button onClick={handleCreateRecord}>기록 추가하기</Button>}
          </div>
          <div className="flex justify-between">
            <div className="flex flex-wrap gap-xsmall">
              <FilterDropdown
                placeholder="독서모임"
                value={selectedGathering}
                onChange={handleGatheringChange}
                color="yellow"
                disabled={isGatheringsLoading || gatherings.length === 0}
                open={openDropdown === 'gathering'}
                onOpenChange={(open) => setOpenDropdown(open ? 'gathering' : null)}
              >
                {gatherings.map((gathering) => (
                  <FilterDropdown.Option
                    key={gathering.gatheringId}
                    value={String(gathering.gatheringId)}
                  >
                    {gathering.gatheringName}
                  </FilterDropdown.Option>
                ))}
              </FilterDropdown>
              <FilterDropdown
                placeholder="기록 유형"
                value={recordType}
                onChange={handleRecordTypeChange}
                color={recordType === 'QUOTE' ? 'purple' : 'primary'}
                open={openDropdown === 'recordType'}
                onOpenChange={(open) => setOpenDropdown(open ? 'recordType' : null)}
              >
                <FilterDropdown.Option value="MEMO">메모</FilterDropdown.Option>
                <FilterDropdown.Option value="QUOTE">발췌</FilterDropdown.Option>
              </FilterDropdown>
            </div>
            <Tabs value={sortType} onValueChange={(v) => setSortType(v as RecordSortType)}>
              <TabsList size="small" className="gap-0">
                <TabsTrigger value="DESC" size="small">
                  최신순
                </TabsTrigger>
                <span className="typo-caption1 text-grey-600 px-xsmall">·</span>
                <TabsTrigger value="ASC" size="small">
                  오래된순
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 기록 목록 - full-bleed 배경 */}
      <div className="bg-grey-100">
        <div className="mx-auto max-w-layout-max px-layout-padding py-xlarge max-lg:px-5">
          {isRecordsLoading ? (
            <BookLogListSkeleton />
          ) : allRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-base text-center">
              <p className="typo-subtitle2 text-grey-600">
                아직 감상 기록이 없어요.
                <br />
                독서하는 순간에 떠오르는 생각을 기록해보세요!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-xlarge">
              {allRecords.map((item) => {
                switch (item.type) {
                  case 'READING_RECORD':
                    return (
                      <PersonalRecordItem
                        key={`personal-${item.readingRecord.recordId}`}
                        record={item.readingRecord}
                        onEdit={
                          isRecording ? () => handleEditRecord(item.readingRecord) : undefined
                        }
                        onDelete={
                          isRecording
                            ? () => deletePersonalRecord(item.readingRecord.recordId)
                            : undefined
                        }
                      />
                    )
                  case 'GROUP_RETROSPECTIVE':
                    return (
                      <MeetingGroupRecordItem
                        key={`group-${item.retrospective.retrospectiveId}`}
                        record={item.retrospective}
                      />
                    )
                  case 'PERSONAL_RETROSPECTIVE':
                    return (
                      <MeetingRetrospectiveItem
                        key={`retrospective-${item.retrospective.retrospectiveId}`}
                        record={item.retrospective}
                        onEdit={
                          isRecording
                            ? () => handleEditPersonalRetrospective(item.retrospective)
                            : undefined
                        }
                        onDelete={
                          isRecording
                            ? () => deleteRetrospective(item.retrospective.meetingId)
                            : undefined
                        }
                      />
                    )
                  case 'PRE_OPINION':
                    return (
                      <MeetingPreOpinionItem
                        key={`pre-opinion-${item.preOpinion.meetingId}`}
                        record={item.preOpinion}
                        onDelete={
                          isRecording
                            ? () =>
                                deletePreOpinion({
                                  gatheringId: item.preOpinion.gatheringId,
                                  meetingId: item.preOpinion.meetingId,
                                })
                            : undefined
                        }
                      />
                    )
                  default:
                    return null
                }
              })}
              {isFetchingNextPage && <BookLogListSkeleton count={2} />}
              {hasNextPage && <div ref={observerRef} className="h-10" />}
            </div>
          )}
        </div>
      </div>
      <PersonalRecordModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        personalBookId={personalBookId}
        mode={modalMode}
        record={editingRecord ?? undefined}
      />
    </section>
  )
}

export default BookLogList
