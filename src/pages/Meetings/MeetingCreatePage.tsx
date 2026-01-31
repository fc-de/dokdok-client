import { Search } from 'lucide-react'
import { useState } from 'react'

import { Button, Card, Container, DatePicker, Input, Select } from '@/shared/ui'

export default function MeetingCreatePage() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  return (
    <div className="flex flex-col gap-base">
      <Card className="border-primary-200 bg-primary-100 text-primary-400 px-small py-[10px] rounded-small">
        <p className="typo-caption1">작성한 내용은 모임장의 승인 후 약속으로 등록돼요.</p>
      </Card>
      <Container>
        <Container.Title className="typo-subtitle3">약속명</Container.Title>
        <Container.Content>
          <Input
            maxLength={24}
            placeholder="약속명을 입력해 주세요. 미입력 시 책 제목으로 자동 등록돼요."
          />
        </Container.Content>
      </Container>

      <Container>
        <Container.Title required className="typo-subtitle3">
          도서
        </Container.Title>
        <Container.Content>
          <Button
            outline
            variant="secondary"
            className="w-full text-black bg-white px-[14px] h-[44px] border-grey-300"
          >
            <Search size={18} className="text-grey-600 mr-tiny" />
            <span className="typo-subtitle5">도서 검색</span>
          </Button>
        </Container.Content>
      </Container>

      <Container>
        <Container.Title className="typo-subtitle3">장소</Container.Title>
        <Container.Content>
          <Button
            outline
            variant="secondary"
            className="w-full text-black bg-white px-[14px] h-[44px] border-grey-300"
          >
            <Search size={18} className="text-grey-600 mr-tiny" />
            <span className="typo-subtitle5">장소 검색</span>
          </Button>
        </Container.Content>
      </Container>

      <Container>
        <Container.Title required className="typo-subtitle3">
          날짜 및 시간
        </Container.Title>
        <Container.Content>
          <div className="flex flex-col gap-xtiny">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-1">
                <span className="text-grey-600 typo-body4">시작 일정</span>
              </div>
              <div className="hidden md:block md:w-[calc(1rem+2*var(--spacing-xsmall))] md:shrink-0" />
              <div className="flex-1 hidden md:block">
                <span className="text-grey-600 typo-body4">종료 일정</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-xsmall">
              <div className="flex gap-xsmall md:flex-1">
                <DatePicker
                  value={startDate}
                  onChange={() => setStartDate}
                  className="md:max-w-none"
                />
                <Select placeholder="시간 선택" className="md:max-w-none">
                  <Select.SelectItem value={'00:00'}>00:00</Select.SelectItem>
                </Select>
              </div>
              <span className="hidden md:block md:px-xsmall md:shrink-0">~</span>
              <span className="md:hidden text-grey-600 typo-body4">종료 일정</span>
              <div className="flex gap-xsmall md:flex-1">
                <DatePicker value={endDate} onChange={() => setEndDate} className="md:max-w-none" />
                <Select placeholder="시간 선택" className="md:max-w-none">
                  <Select.SelectItem value={'00:00'}>00:00</Select.SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </Container.Content>
      </Container>

      <Container>
        <Container.Title className="typo-subtitle3">참가 인원</Container.Title>
        <Container.Content>
          <Input
            placeholder="참가 인원을 작성해주세요"
            helperText="현재 모임의 전체 멤버 수는 16명이에요. 최대 16명까지 참가 가능해요."
          />
        </Container.Content>
      </Container>
    </div>
  )
}
