import { ChevronLeft, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  combineDateAndTime,
  type CreateMeetingRequest,
  PlaceSearchModal,
  useCreateMeeting,
  useMeetingForm,
} from '@/features/meetings'
import { Button, Card, Container, DatePicker, Input, Select } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function MeetingCreatePage() {
  const navigate = useNavigate()
  const { openError, openAlert } = useGlobalModalStore()
  const createMutation = useCreateMeeting()
  const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false)

  // 임시: 모임 정보 (실제로는 API에서 가져와야 함)
  const gatheringId = 1 // TODO: 실제 모임 ID로 교체
  const gatheringMaxCount = 16 // TODO: API에서 가져오기

  // 폼 로직 및 유효성 검사 (커스텀 훅으로 분리)
  const {
    formData,
    timeOptions,
    validateForm,
    errors,
    getStartDateDisabled,
    getEndDateDisabled,
    getEndTimeOptions,
    formattedSchedule,
    refs,
    handlers,
  } = useMeetingForm({ gatheringMaxCount })

  const {
    meetingName,
    bookId,
    bookName,
    maxParticipants,
    startDate,
    startTime,
    endDate,
    endTime,
    locationName,
    locationAddress,
    latitude,
    longitude,
  } = formData

  //setBookId, setBookName
  const {
    setMeetingName,
    setMaxParticipants,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setLocationAddress,
    setLocationName,
    setLatitude,
    setLongitude,
  } = handlers

  const { bookButtonRef, startDateRef, endDateRef, maxParticipantsRef } = refs

  // 제출 핸들러
  const handleSubmit = async () => {
    //유효성 검사
    const isValid = validateForm()
    if (!isValid) {
      return
    }

    // validation 통과 후 필수 값 타입 가드
    if (!bookId || !bookName || !startDate || !startTime || !endDate || !endTime) {
      return
    }

    const startDateTime = combineDateAndTime(startDate, startTime)
    const endDateTime = combineDateAndTime(endDate, endTime)

    const trimmedMeetingName = meetingName?.trim() || null

    const requestData: CreateMeetingRequest = {
      gatheringId,
      bookId,
      meetingName: trimmedMeetingName || bookName, // 약속명이 없으면 책 이름 사용
      meetingStartDate: startDateTime,
      meetingEndDate: endDateTime,
      maxParticipants: maxParticipants ? Number(maxParticipants) : gatheringMaxCount,
      location:
        locationName && locationAddress && latitude !== null && longitude !== null
          ? { name: locationName, address: locationAddress, latitude, longitude }
          : null,
    }

    createMutation.mutate(requestData, {
      onSuccess: async () => {
        await openAlert('약속 생성 완료', '약속이 성공적으로 생성되었습니다.')
        navigate('/') //이동경로 수정해야 함
      },
      onError: (error) => {
        openError('약속 생성 실패', error.userMessage)
      },
    })
  }

  return (
    <>
      {/* 공통컴포넌트로 교체 예정 */}
      <div className="sticky top-0 bg-white -mt-xlarge">
        <p className="flex typo-body3 text-grey-600 gap-xtiny py-medium">
          <ChevronLeft size={16} /> 뒤로가기
        </p>
        <div className="flex justify-between py-large">
          <p className="text-black typo-heading3">약속 만들기</p>
          <Button
            className="w-fit"
            size="small"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? '...' : '만들기'}
          </Button>
        </div>
      </div>
      {/* 공통컴포넌트로 교체 예정 */}
      <div className="flex flex-col gap-base pb-xlarge">
        <Card className="border-primary-200 bg-primary-100 text-primary-400 px-small py-[10px] rounded-small">
          <p className="typo-caption1">작성한 내용은 모임장의 승인 후 약속으로 등록돼요.</p>
        </Card>

        <Container>
          <Container.Title className="typo-subtitle3">약속명</Container.Title>
          <Container.Content>
            <Input
              maxLength={24}
              placeholder="약속명을 입력해 주세요. 미입력 시 책 제목으로 자동 등록돼요."
              value={meetingName ?? ''}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </Container.Content>
        </Container>

        <Container>
          <Container.Title required className="typo-subtitle3">
            도서
          </Container.Title>
          <Container.Content>
            <Button
              ref={bookButtonRef}
              outline
              variant="secondary"
              className="w-full text-black bg-white px-[14px] h-[44px] border-grey-300"
            >
              <Search size={18} className="text-grey-600 mr-tiny" />
              <span className="typo-subtitle5">도서 검색</span>
            </Button>
            {errors?.bookId && (
              <p className="mt-tiny text-accent-300 text-body3">{errors.bookId}</p>
            )}
          </Container.Content>
        </Container>

        <Container>
          <Container.Title className="typo-subtitle3">장소</Container.Title>
          <Container.Content>
            {locationAddress && (
              <Card className="border-none p-base bg-grey-100 rounded-small text-grey-700 typo-body1 mb-xsmall">
                <p className="text-black typo-subtitle5 mb-xtiny">{locationName}</p>
                <p className="typo-body3 text-grey-600">{locationAddress}</p>
              </Card>
            )}
            <Button
              outline
              variant="secondary"
              className="w-full text-black bg-white px-[14px] h-[44px] border-grey-300"
              onClick={() => setIsPlaceSearchOpen(true)}
            >
              <Search size={18} className="text-grey-600 mr-tiny" />
              <span className="typo-subtitle5">장소 검색</span>
            </Button>
          </Container.Content>
        </Container>

        <PlaceSearchModal
          open={isPlaceSearchOpen}
          onOpenChange={setIsPlaceSearchOpen}
          onSelectPlace={(place) => {
            setLocationName(place.name)
            setLocationAddress(place.address)
            setLatitude(place.latitude)
            setLongitude(place.longitude)
          }}
        />

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
                    ref={startDateRef}
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="날짜 선택"
                    className="md:max-w-none"
                    disabled={getStartDateDisabled()}
                  />
                  <Select
                    placeholder="시간 선택"
                    className="md:max-w-none"
                    value={startTime ?? ''}
                    onValueChange={setStartTime}
                  >
                    {timeOptions.map((option) => (
                      <Select.SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </Select.SelectItem>
                    ))}
                  </Select>
                </div>
                <span className="hidden md:block md:px-xsmall md:shrink-0">~</span>
                <span className="md:hidden text-grey-600 typo-body4">종료 일정</span>
                <div className="flex gap-xsmall md:flex-1">
                  <DatePicker
                    ref={endDateRef}
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="날짜 선택"
                    className="md:max-w-none"
                    disabled={getEndDateDisabled()}
                    isDisabled={!startDate || !startTime}
                  />
                  <Select
                    placeholder="시간 선택"
                    className="md:max-w-none"
                    value={endTime ?? ''}
                    onValueChange={setEndTime}
                    disabled={!endDate || !startDate || !startTime}
                  >
                    {getEndTimeOptions().map((option) => (
                      <Select.SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </Select.SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            {/* 시작일정, 종료일정 선택 완료되면 노출*/}
            {formattedSchedule && (
              <Card className="flex border-none p-base bg-grey-100 rounded-small mt-medium gap-small">
                <p className="text-grey-600 typo-body4">선택된 일정</p>
                <p className="text-black typo-body4">{formattedSchedule}</p>
              </Card>
            )}
            {errors?.schedule && (
              <p className="text-accent-300 text-body3 mt-xtiny">{errors.schedule}</p>
            )}
          </Container.Content>
        </Container>

        <Container>
          <Container.Title className="typo-subtitle3">참가 인원</Container.Title>
          <Container.Content>
            <Input
              ref={maxParticipantsRef}
              type="number"
              placeholder="참가 인원을 작성해주세요"
              helperText={
                errors?.maxParticipants
                  ? undefined
                  : `현재 모임의 전체 멤버 수는 ${gatheringMaxCount}명이에요. 최대 ${gatheringMaxCount}명까지 참가 가능해요.`
              }
              error={!!errors?.maxParticipants}
              errorMessage={errors?.maxParticipants ?? undefined}
              value={maxParticipants ?? ''}
              onChange={(e) => setMaxParticipants(e.target.value)}
              min={1}
              max={gatheringMaxCount}
            />
          </Container.Content>
        </Container>
      </div>
    </>
  )
}
