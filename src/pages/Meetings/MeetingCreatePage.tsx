import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { BookSearchModal } from '@/features/book'
import { useGatheringDetail } from '@/features/gatherings'
import {
  combineDateAndTime,
  type CreateMeetingRequest,
  PlaceSearchModal,
  type UpdateMeetingRequest,
  useCreateMeeting,
  useMeetingDetail,
  useMeetingForm,
  useUpdateMeeting,
} from '@/features/meetings'
import FormPageHeader from '@/shared/components/FormPageHeader'
import { ROUTES } from '@/shared/constants'
import { MobileLayoutFrame } from '@/shared/layout'
import { Button, Card, Container, DatePicker, Input, TimePicker } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function MeetingCreatePage() {
  const navigate = useNavigate()
  const openError = useGlobalModalStore((state) => state.openError)
  const openAlert = useGlobalModalStore((state) => state.openAlert)
  const openConfirm = useGlobalModalStore((state) => state.openConfirm)
  const createMutation = useCreateMeeting()
  const updateMutation = useUpdateMeeting()
  const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false)
  const [isBookSearchOpen, setIsBookSearchOpen] = useState(false)

  const { gatheringId: gatheringIdParam, meetingId: meetingIdParam } = useParams<{
    gatheringId: string
    meetingId?: string
  }>()
  const parsedId = gatheringIdParam ? Number(gatheringIdParam) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0

  // 수정 모드 판별
  const parsedMeetingId = meetingIdParam ? Number(meetingIdParam) : NaN
  const meetingId = Number.isFinite(parsedMeetingId) ? parsedMeetingId : null
  const isEditMode = !!meetingId

  // 수정 모드일 때 약속 상세 조회
  const {
    data: meetingDetail,
    error: meetingError,
    isLoading: isMeetingLoading,
  } = useMeetingDetail(meetingId ?? 0)

  // 모임 상세 조회
  const {
    data: gathering,
    error: gatheringError,
    isLoading: isGatheringLoading,
  } = useGatheringDetail(gatheringId)

  // 유효하지 않은 ID 처리
  useEffect(() => {
    if (gatheringId === 0) {
      openError('오류', '잘못된 모임 ID입니다.', () => {
        navigate(ROUTES.GATHERINGS, { replace: true })
      })
    }
  }, [gatheringId, navigate, openError])

  // API 에러 처리 (gatheringError 우선)
  useEffect(() => {
    if (gatheringId === 0) return
    if (!gatheringError && !meetingError) return

    const message = gatheringError
      ? '모임 정보를 불러오는데 실패했습니다.'
      : '약속 정보를 불러오는데 실패했습니다.'

    openError('오류', message, () => {
      // 브라우저 히스토리가 없으면 홈으로 이동
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate(ROUTES.HOME, { replace: true })
      }
    })
  }, [gatheringId, gatheringError, meetingError, navigate, openError])

  const gatheringMaxCount = gathering?.totalMembers || 1
  const isLeader = gathering?.currentUserRole === 'LEADER'

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
  } = useMeetingForm({ gatheringMaxCount, initialData: meetingDetail })

  const {
    meetingName,
    bookId,
    bookName,
    bookThumbnail,
    bookAuthors,
    bookPublisher,
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
    setBook,
  } = handlers

  const { bookButtonRef, startDateRef, endDateRef, maxParticipantsRef } = refs

  // 수정 처리
  const handleUpdate = (id: number) => {
    if (!startDate || !startTime || !endDate || !endTime || !bookName) {
      return
    }

    const updateData: UpdateMeetingRequest = {
      meetingName: (meetingName?.trim() || bookName).slice(0, 24),
      startDate: combineDateAndTime(startDate, startTime),
      endDate: combineDateAndTime(endDate, endTime),
      maxParticipants: maxParticipants ? Number(maxParticipants) : gatheringMaxCount,
      location:
        locationName && locationAddress && latitude !== null && longitude !== null
          ? { name: locationName, address: locationAddress, latitude, longitude }
          : null,
    }

    updateMutation.mutate(
      { meetingId: id, data: updateData },
      {
        onSuccess: () => {
          openAlert('약속 수정 완료', '약속이 성공적으로 수정되었습니다.', () => {
            navigate(ROUTES.MEETING_DETAIL(gatheringId, id), { replace: true })
          })
        },
        onError: (error) => {
          openError('약속 수정 실패', error.userMessage)
        },
      }
    )
  }

  // 생성 처리
  const handleCreate = () => {
    if (
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      !bookId ||
      !bookName ||
      !bookThumbnail ||
      !bookAuthors ||
      !bookPublisher
    ) {
      return
    }

    const createData: CreateMeetingRequest = {
      gatheringId,
      book: {
        title: bookName,
        authors: bookAuthors,
        publisher: bookPublisher,
        isbn: bookId,
        thumbnail: bookThumbnail,
      },
      meetingName: (meetingName?.trim() || bookName).slice(0, 24),
      meetingStartDate: combineDateAndTime(startDate, startTime),
      meetingEndDate: combineDateAndTime(endDate, endTime),
      maxParticipants: maxParticipants ? Number(maxParticipants) : gatheringMaxCount,
      location:
        locationName && locationAddress && latitude !== null && longitude !== null
          ? { name: locationName, address: locationAddress, latitude, longitude }
          : null,
    }

    createMutation.mutate(createData, {
      onSuccess: () => {
        const title = isLeader ? '약속 생성 완료' : '약속 신청 완료'
        const message = isLeader
          ? '약속이 성공적으로 생성되었습니다.'
          : '약속이 신청됐어요. 모임장이 승인하면 약속이 만들어져요.'
        openAlert(title, message, () => {
          navigate(ROUTES.GATHERING_DETAIL(gatheringId), { replace: true })
        })
      },
      onError: (error) => {
        openError('약속 생성 실패', error.userMessage)
      },
    })
  }

  // 제출 핸들러: 유효성 검사 → confirm 모달 → 생성/수정 처리
  const handleSubmit = async () => {
    if (!validateForm()) return

    const confirmTitle = isEditMode ? '약속 수정' : isLeader ? '약속 생성' : '약속 신청'
    const confirmMessage = isEditMode
      ? '약속을 수정하시겠습니까?'
      : isLeader
        ? '약속을 생성하시겠습니까?'
        : '모임장이 승인하면 약속이 만들어질 거예요.'
    const confirmed = await openConfirm(confirmTitle, confirmMessage)
    if (!confirmed) return

    if (isEditMode && meetingId) {
      handleUpdate(meetingId)
    } else {
      handleCreate()
    }
  }

  const isSubmitting = isEditMode ? updateMutation.isPending : createMutation.isPending
  const isLoading = isGatheringLoading || isMeetingLoading
  const pageTitle = isEditMode ? '약속 수정하기' : '약속 만들기'
  const actionLabel = isSubmitting ? '...' : isEditMode ? '수정하기' : '만들기'

  return (
    <>
      <MobileLayoutFrame
        variant="header"
        title={pageTitle}
        leftAction={{ type: 'close', onClick: () => navigate(-1) }}
        bottomCTA={{
          label: isEditMode ? '수정하기' : '만들기',
          loadingLabel: '처리 중...',
          onClick: handleSubmit,
          disabled: isSubmitting || isLoading,
          loading: isSubmitting,
        }}
        className="min-h-dvh lg:min-h-0"
      >
        <FormPageHeader
          title={pageTitle}
          actionLabel={actionLabel}
          onAction={handleSubmit}
          isActionDisabled={isSubmitting || isLoading}
          className="max-lg:hidden"
        />
        <div className="bg-grey-100 max-lg:min-h-dvh">
          <div className="mx-auto max-w-layout-max px-layout-padding max-lg:px-5">
            <div className="flex flex-col gap-base py-xlarge max-lg:py-5">
              {!isEditMode && (
                <Card className="border-primary-200 bg-primary-100 text-primary-400 px-small py-[10px] rounded-small">
                  <p className="typo-caption1">작성한 내용은 모임장의 승인 후 약속으로 등록돼요.</p>
                </Card>
              )}

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
                <Container.Title
                  required
                  className="typo-subtitle3"
                  errorMessage={isEditMode ? '도서는 수정이 불가합니다.' : undefined}
                >
                  도서
                </Container.Title>
                <Container.Content>
                  <div className="flex flex-col gap-medium">
                    {bookThumbnail && bookName && bookAuthors && (
                      <Card className="rounded-small py-base px-medium max-lg:px-base max-lg:py-[14px] bg-gray-100 border-none flex gap-small items-center">
                        <div className="w-[70px] h-[100px] overflow-hidden rounded">
                          <img
                            src={bookThumbnail}
                            alt={bookName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col gap-xtiny">
                          <p className="typo-subtitle5 text-black">{bookName}</p>
                          <p className="typo-body4 text-grey-800">{bookAuthors}</p>
                        </div>
                      </Card>
                    )}
                    {!isEditMode && (
                      <Button
                        ref={bookButtonRef}
                        outline
                        variant="secondary"
                        className="w-full text-black bg-white px-[14px] h-[44px] border-grey-300"
                        onClick={() => setIsBookSearchOpen(true)}
                      >
                        <Search size={18} className="text-grey-600 mr-tiny" />
                        <span className="typo-subtitle5">도서 검색</span>
                      </Button>
                    )}
                  </div>
                  {errors?.bookId && (
                    <p className="mt-tiny text-accent-300 typo-body3">{errors.bookId}</p>
                  )}
                </Container.Content>
              </Container>

              <Container>
                <Container.Title className="typo-subtitle3">장소</Container.Title>
                <Container.Content>
                  {locationAddress && locationName && (
                    <Card className="border-none p-base bg-grey-100 rounded-small text-grey-700 typo-body1 mb-xsmall max-lg:px-base max-lg:py-[14px]">
                      <p className="text-black typo-subtitle3 mb-xtiny">{locationName}</p>
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

                  {errors?.location && (
                    <p className="text-accent-300 typo-body3 mt-xtiny">{errors.location}</p>
                  )}
                </Container.Content>
              </Container>

              <Container>
                <Container.Title required className="typo-subtitle3">
                  날짜 및 시간
                </Container.Title>
                <Container.Content>
                  <div className="flex flex-col gap-xtiny max-lg:gap-tiny">
                    <div className="flex items-center max-lg:flex-col max-lg:items-start">
                      <div className="flex-1">
                        <span className="text-grey-600 typo-body4">시작 일정</span>
                      </div>
                      <div className="w-[calc(1rem+2*var(--spacing-xsmall))] shrink-0 max-lg:hidden" />
                      <div className="flex-1 max-lg:hidden">
                        <span className="text-grey-600 typo-body4">종료 일정</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-xsmall max-lg:flex-col max-lg:items-stretch">
                      <div className="flex flex-1 gap-xsmall max-lg:flex-col max-lg:gap-tiny">
                        <DatePicker
                          ref={startDateRef}
                          value={startDate}
                          onChange={setStartDate}
                          placeholder="날짜 선택"
                          className="md:max-w-none"
                          disabled={getStartDateDisabled()}
                        />
                        <TimePicker
                          placeholder="시간 선택"
                          className="md:max-w-none"
                          value={startTime ?? ''}
                          onValueChange={setStartTime}
                        >
                          {timeOptions.map((option) => (
                            <TimePicker.Time key={option.value} value={option.value}>
                              {option.label}
                            </TimePicker.Time>
                          ))}
                        </TimePicker>
                      </div>
                      <span className="px-xsmall shrink-0 max-lg:hidden">~</span>
                      <span className="hidden max-lg:block text-grey-600 typo-body4">
                        종료 일정
                      </span>
                      <div className="flex flex-1 gap-xsmall max-lg:flex-col max-lg:gap-tiny">
                        <DatePicker
                          ref={endDateRef}
                          value={endDate}
                          onChange={setEndDate}
                          placeholder="날짜 선택"
                          className="md:max-w-none"
                          disabled={getEndDateDisabled()}
                          isDisabled={!startDate || !startTime}
                        />
                        <TimePicker
                          placeholder="시간 선택"
                          className="md:max-w-none"
                          value={endTime ?? ''}
                          onValueChange={setEndTime}
                          disabled={!endDate || !startDate || !startTime}
                        >
                          {getEndTimeOptions().map((option) => (
                            <TimePicker.Time key={option.value} value={option.value}>
                              {option.label}
                            </TimePicker.Time>
                          ))}
                        </TimePicker>
                      </div>
                    </div>
                  </div>
                  {/* 시작일정, 종료일정 선택 완료되면 노출*/}
                  {formattedSchedule && (
                    <Card className="flex border-none p-base bg-grey-100 rounded-small mt-medium gap-small max-lg:hidden">
                      <p className="text-grey-600 typo-body4">선택된 일정</p>
                      <p className="text-black typo-body4">{formattedSchedule}</p>
                    </Card>
                  )}
                  {errors?.schedule && (
                    <p className="text-accent-300 typo-body3 mt-xtiny">{errors.schedule}</p>
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
                    onWheel={(e) => e.currentTarget.blur()}
                    min={1}
                    max={gatheringMaxCount}
                  />
                </Container.Content>
              </Container>

              {!isEditMode && isBookSearchOpen && (
                <BookSearchModal
                  open={isBookSearchOpen}
                  onOpenChange={setIsBookSearchOpen}
                  onSelectBook={(book) => setBook(book)}
                />
              )}
            </div>
          </div>
        </div>
      </MobileLayoutFrame>
      {isPlaceSearchOpen && (
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
      )}
    </>
  )
}
