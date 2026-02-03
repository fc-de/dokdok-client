import { useMemo, useState } from 'react'

import type {
  MeetingGroupRecord,
  MeetingPersonalRecord,
  MeetingPreOpinion,
  PersonalRecord,
  RecordSortType,
  RecordType,
} from '@/features/book/book.types'
import BookLogModal from '@/features/book/components/BookLogModal'
import MeetingGroupRecordItem from '@/features/book/components/MeetingGroupRecordItem'
import MeetingPreOpinionItem from '@/features/book/components/MeetingPreOpinionItem'
import MeetingRetrospectiveItem from '@/features/book/components/MeetingRetrospectiveItem'
import PersonalRecordItem from '@/features/book/components/PersonalRecordItem'
import { useBookRecords, useMyGatherings } from '@/features/book/hooks'
import { Button } from '@/shared/ui/Button'
import { FilterDropdown } from '@/shared/ui/FilterDropdown'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/Tabs'

type BookLogListProps = {
  bookId: number
  isRecording: boolean
}

type OpenDropdown = 'gathering' | 'recordType' | null

type RecordItem =
  | { type: 'personal'; date: Date; data: PersonalRecord }
  | { type: 'meetingGroup'; date: Date; data: MeetingGroupRecord }
  | { type: 'meetingPersonal'; date: Date; data: MeetingPersonalRecord }
  | { type: 'meetingPreOpinion'; date: Date; data: MeetingPreOpinion }

const BookLogList = ({ bookId, isRecording }: BookLogListProps) => {
  const [selectedGathering, setSelectedGathering] = useState('')
  const [recordType, setRecordType] = useState<RecordType | ''>('')
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null)
  const [sortType, setSortType] = useState<RecordSortType>('LATEST')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingRecord, setEditingRecord] = useState<PersonalRecord | null>(null)

  const {
    data: gatheringsData,
    isLoading: isGatheringsLoading,
    fetchNextPage: fetchNextGatherings,
    hasNextPage: hasNextGatherings,
  } = useMyGatherings()

  const gatherings = gatheringsData?.pages.flatMap((page) => page.items) ?? []
  const { data: recordsData } = useBookRecords(bookId, {
    gatheringId: selectedGathering ? Number(selectedGathering) : undefined,
    recordType: recordType || undefined,
    sort: sortType,
  })

  // 모든 레코드를 통합하여 날짜순으로 정렬
  const allRecords = useMemo((): RecordItem[] => {
    if (!recordsData) return []

    const records: RecordItem[] = []

    recordsData.personalRecords.forEach((record) => {
      records.push({ type: 'personal', date: new Date(record.createdAt), data: record })
    })

    recordsData.meetingGroupRecords.forEach((record) => {
      records.push({ type: 'meetingGroup', date: new Date(record.meetingDate), data: record })
    })

    recordsData.meetingPersonalRecords.forEach((record) => {
      records.push({ type: 'meetingPersonal', date: new Date(record.createdAt), data: record })
    })

    recordsData.meetingPreOpinions?.forEach((record) => {
      records.push({ type: 'meetingPreOpinion', date: new Date(record.sharedAt), data: record })
    })

    // 정렬: LATEST면 최신순(내림차순), OLDEST면 오래된순(오름차순)
    records.sort((a, b) => {
      return sortType === 'LATEST'
        ? b.date.getTime() - a.date.getTime()
        : a.date.getTime() - b.date.getTime()
    })

    return records
  }, [recordsData, sortType])

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

  return (
    <section>
      {/* 감상 기록 헤더 - sticky */}
      <div className="sticky top-[108px] z-30 bg-white [box-shadow:0_6px_6px_-4px_rgba(17,17,17,0.08)] w-screen ml-[calc(-50vw+50%)]">
        <div className="mx-auto max-w-layout-max px-layout-padding py-base">
          <div className="flex justify-between mb-base">
            <h2 className="typo-heading2 text-grey-800">감상 기록</h2>
            <Button onClick={handleCreateRecord}>기록 추가하기</Button>
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
                {hasNextGatherings && (
                  <button
                    type="button"
                    className="w-full py-xsmall typo-caption1 text-grey-500 hover:text-grey-700"
                    onClick={() => fetchNextGatherings()}
                  >
                    더 보기
                  </button>
                )}
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
                <TabsTrigger value="LATEST" size="small">
                  최신순
                </TabsTrigger>
                <span className="typo-caption1 text-grey-600 px-xsmall">·</span>
                <TabsTrigger value="OLDEST" size="small">
                  오래된순
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 기록 목록 - full-bleed 배경 */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 bg-grey-100">
        <section className="max-w-[1200px] mx-auto py-xlarge">
          {allRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-base text-center">
              <p className="typo-subtitle2 text-grey-600">
                아직 감상 기록이 없어요.
                <br />
                독서하는 순간에 떠오르는 생각을 기록해보세요!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-xlarge">
              {allRecords.map((item, idx) => {
                switch (item.type) {
                  case 'personal':
                    return (
                      <PersonalRecordItem
                        key={`personal-${item.data.recordId}`}
                        record={item.data}
                        onEdit={isRecording ? () => handleEditRecord(item.data) : undefined}
                      />
                    )
                  case 'meetingGroup':
                    return (
                      <MeetingGroupRecordItem
                        key={`group-${item.data.meetingId}`}
                        record={item.data}
                        onEdit={
                          isRecording
                            ? () => console.log('edit group', item.data.meetingId)
                            : undefined
                        }
                      />
                    )
                  case 'meetingPersonal':
                    return (
                      <MeetingRetrospectiveItem
                        key={`retrospective-${item.data.retrospectiveId}`}
                        record={item.data}
                        onEdit={
                          isRecording
                            ? () => console.log('edit retrospective', item.data.retrospectiveId)
                            : undefined
                        }
                      />
                    )
                  case 'meetingPreOpinion':
                    return (
                      <MeetingPreOpinionItem
                        key={`pre-opinion-${item.data.gatheringName}-${item.data.sharedAt}`}
                        record={item.data}
                        onEdit={
                          isRecording ? () => console.log('edit pre-opinion', idx) : undefined
                        }
                      />
                    )
                  default:
                    return null
                }
              })}
            </div>
          )}
        </section>
      </div>
      <BookLogModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        bookId={bookId}
        mode={modalMode}
        record={editingRecord ?? undefined}
      />
    </section>
  )
}

export default BookLogList
