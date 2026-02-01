import { useState } from 'react'

import type { RecordSortType, RecordType } from '@/features/book/book.types'
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

const BookLogList = ({ bookId, isRecording }: BookLogListProps) => {
  const [selectedGathering, setSelectedGathering] = useState('')
  const [recordType, setRecordType] = useState<RecordType | ''>('')
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null)
  const [sortType, setSortType] = useState<RecordSortType>('LATEST')

  const { data: gatheringsData, isLoading: isGatheringsLoading } = useMyGatherings()
  const { data: recordsData } = useBookRecords(bookId, {
    gatheringId: selectedGathering ? Number(selectedGathering) : undefined,
    recordType: recordType || undefined,
    sort: sortType,
  })

  const handleGatheringChange = (value: string) => {
    setSelectedGathering(value)
    if (value) setRecordType('')
  }

  const handleRecordTypeChange = (value: string) => {
    setRecordType(value as RecordType | '')
    if (value) setSelectedGathering('')
  }

  return (
    <section>
      {/* 감상 기록 헤더 - sticky */}
      <div className="sticky top-[108px] z-30 bg-white [box-shadow:0_6px_6px_-4px_rgba(17,17,17,0.08)] w-screen ml-[calc(-50vw+50%)]">
        <div className="mx-auto max-w-layout-max px-layout-padding py-base">
        <div className="flex justify-between mb-base">
          <h2 className="typo-heading2 text-grey-800">감상 기록</h2>
          <Button onClick={() => console.log('기록 추가', bookId)}>기록 추가하기</Button>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-xsmall">
            <FilterDropdown
              placeholder="독서모임"
              value={selectedGathering}
              onChange={handleGatheringChange}
              color="yellow"
              disabled={isGatheringsLoading}
              open={openDropdown === 'gathering'}
              onOpenChange={(open) => setOpenDropdown(open ? 'gathering' : null)}
            >
              {gatheringsData?.gatherings.map((gathering) => (
                <FilterDropdown.Option
                  key={gathering.gatheringId}
                  value={String(gathering.gatheringId)}
                >
                  {gathering.name}
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
          {!recordsData?.personalRecords.length &&
          !recordsData?.meetingGroupRecords.length &&
          !recordsData?.meetingPersonalRecords.length &&
          !recordsData?.meetingPreOpinions?.length ? (
            <div className="flex flex-col items-center justify-center py-base text-center">
              <p className="typo-subtitle2 text-grey-600">
                아직 감상 기록이 없어요.
                <br />
                독서하는 순간에 떠오르는 생각을 기록해보세요!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-xlarge">
              {recordsData?.personalRecords.map((record) => (
                <PersonalRecordItem
                  key={record.recordId}
                  record={record}
                  onEdit={isRecording ? () => console.log('edit', record.recordId) : undefined}
                />
              ))}
              {recordsData?.meetingGroupRecords.map((record) => (
                <MeetingGroupRecordItem
                  key={record.meetingId}
                  record={record}
                  onEdit={
                    isRecording ? () => console.log('edit group', record.meetingId) : undefined
                  }
                />
              ))}
              {recordsData?.meetingPersonalRecords.map((record) => (
                <MeetingRetrospectiveItem
                  key={`retrospective-${record.retrospectiveId}`}
                  record={record}
                  onEdit={
                    isRecording
                      ? () => console.log('edit retrospective', record.retrospectiveId)
                      : undefined
                  }
                />
              ))}
              {recordsData?.meetingPreOpinions?.map((record, idx) => (
                <MeetingPreOpinionItem
                  key={`pre-opinion-${idx}`}
                  record={record}
                  onEdit={isRecording ? () => console.log('edit pre-opinion', idx) : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default BookLogList
