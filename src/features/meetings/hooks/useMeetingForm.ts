import { useEffect, useMemo, useRef, useState } from 'react'

import { type SearchBookItem } from '@/features/book'
import {
  combineDateAndTime,
  extractTime,
  formatScheduleRange,
  generateTimeOptions,
  type GetMeetingDetailResponse,
  isStartBeforeEnd,
} from '@/features/meetings'

type UseMeetingFormParams = {
  gatheringMaxCount: number
  /** 수정 모드일 때 초기값 */
  initialData?: GetMeetingDetailResponse | null
}

type ValidationErrors = {
  bookId?: string | null
  schedule?: string | null
  maxParticipants?: string | null
  location?: string | null
}

/**
 * 폼 데이터 타입
 */
type FormData = {
  locationName: string | null
  locationAddress: string | null
  latitude: number | null
  longitude: number | null
  meetingName: string | null
  bookId: string | null
  bookName: string | null
  bookThumbnail: string | null
  bookAuthors: string | null
  bookPublisher: string | null
  maxParticipants: string | null
  startDate: Date | null
  startTime: string | null
  endDate: Date | null
  endTime: string | null
}

/**
 * 초기 폼 데이터 생성
 */
const getInitialFormData = (initialData?: GetMeetingDetailResponse | null): FormData => {
  if (!initialData) {
    return {
      locationName: null,
      locationAddress: null,
      latitude: null,
      longitude: null,
      meetingName: null,
      bookId: null,
      bookName: null,
      bookThumbnail: null,
      bookAuthors: null,
      bookPublisher: null,
      maxParticipants: null,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
    }
  }

  return {
    locationName: initialData.location?.name ?? null,
    locationAddress: initialData.location?.address ?? null,
    latitude: initialData.location?.latitude ?? null,
    longitude: initialData.location?.longitude ?? null,
    meetingName: initialData.meetingName ?? null,
    bookId: initialData.book?.bookId?.toString() ?? null,
    bookName: initialData.book?.bookName ?? null,
    bookThumbnail: initialData.book?.thumbnail ?? null,
    bookAuthors: initialData.book?.authors ?? null,
    bookPublisher: initialData.book?.publisher ?? null,
    maxParticipants: initialData.participants?.maxCount?.toString() ?? null,
    startDate: initialData.schedule?.startDateTime
      ? new Date(initialData.schedule.startDateTime)
      : null,
    startTime: initialData.schedule?.startDateTime
      ? extractTime(initialData.schedule.startDateTime)
      : null,
    endDate: initialData.schedule?.endDateTime ? new Date(initialData.schedule.endDateTime) : null,
    endTime: initialData.schedule?.endDateTime
      ? extractTime(initialData.schedule.endDateTime)
      : null,
  }
}

export const useMeetingForm = ({ gatheringMaxCount, initialData }: UseMeetingFormParams) => {
  // 수정 모드 여부
  const isEditMode = !!initialData

  // 폼 상태를 단일 객체로 관리
  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(initialData))

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState<ValidationErrors | null>(null)

  // 각 필드의 ref (포커스 이동용)
  const bookButtonRef = useRef<HTMLButtonElement>(null)
  const startDateRef = useRef<HTMLButtonElement>(null)
  const endDateRef = useRef<HTMLButtonElement>(null)
  const maxParticipantsRef = useRef<HTMLInputElement>(null)

  // 시간 옵션 메모이제이션 (렌더링마다 재생성 방지)
  const timeOptions = useMemo(() => generateTimeOptions(), [])

  // initialData가 로드되면 상태 업데이트 (수정 모드)
  useEffect(() => {
    if (initialData) {
      setFormData(getInitialFormData(initialData))
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newError: ValidationErrors = {}

    if (
      !isEditMode &&
      (!formData.bookId ||
        !formData.bookName ||
        !formData.bookThumbnail ||
        !formData.bookAuthors ||
        !formData.bookPublisher)
    ) {
      newError.bookId = '* 도서를 선택해주세요.'
    }

    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      newError.schedule = '* 일정을 선택해주세요.'
    } else {
      // 시작/종료 일시 비교 (둘 다 있을 때만)
      const startDateTime = combineDateAndTime(formData.startDate, formData.startTime)
      const endDateTime = combineDateAndTime(formData.endDate, formData.endTime)

      if (!isStartBeforeEnd(startDateTime, endDateTime)) {
        newError.schedule = '* 종료 일정은 시작 일정보다 늦어야 합니다.'
      }
    }

    if (formData.maxParticipants) {
      const participants = Number(formData.maxParticipants)
      if (isNaN(participants) || participants < 1 || participants > gatheringMaxCount) {
        newError.maxParticipants = `현재 모임의 전체 멤버 수는 ${gatheringMaxCount}명이에요. 최대 ${gatheringMaxCount}명까지 참가 가능해요.`
      }
    }

    // 장소 검증: 4개 필드가 모두 있거나 모두 없어야 함
    const locationFields = [
      formData.locationName !== null,
      formData.locationAddress !== null,
      formData.latitude !== null,
      formData.longitude !== null,
    ]
    const filledCount = locationFields.filter(Boolean).length

    if (filledCount > 0 && filledCount < 4) {
      newError.location = '장소를 재등록 해주세요'
    }

    setErrors(newError)

    // 첫 번째 에러 필드로 이동
    if (Object.keys(newError).length > 0) {
      if (newError.bookId) {
        bookButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (newError.schedule) {
        startDateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (newError.maxParticipants) {
        maxParticipantsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }

    return true
  }

  /**
   * 에러 초기화 (특정 필드 또는 전체)
   */
  const clearError = (field?: keyof ValidationErrors) => {
    if (field === undefined) {
      setErrors(null)
    } else {
      setErrors((prev) => {
        if (!prev) return null
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [field]: _, ...rest } = prev
        return Object.keys(rest).length > 0 ? rest : null
      })
    }
  }

  /**
   * 폼 필드 업데이트 헬퍼
   */
  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
    errorField?: keyof ValidationErrors
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errorField && errors?.[errorField]) {
      clearError(errorField)
    }
  }

  /**
   * 종료 날짜 비활성화 조건
   */
  const getEndDateDisabled = () => {
    if (!formData.startDate || !formData.startTime) return undefined
    return { before: formData.startDate }
  }

  /**
   * 종료 시간 옵션 필터링
   */
  const getEndTimeOptions = () => {
    if (!formData.startDate || !formData.endDate || !formData.startTime) return timeOptions

    // 같은 날짜인 경우
    if (formData.startDate.toDateString() === formData.endDate.toDateString()) {
      return timeOptions.filter((option) => option.value > formData.startTime!)
    }

    return timeOptions
  }

  /**
   * 시작 날짜 비활성화 조건
   */
  const getStartDateDisabled = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    return { before: tomorrow }
  }

  /**
   * 도서 정보 변경 (에러 초기화 포함)
   */
  const handleBookChange = (book: Omit<SearchBookItem, 'contents'>) => {
    setFormData((prev) => ({
      ...prev,
      bookId: book.isbn,
      bookName: book.title,
      bookThumbnail: book.thumbnail,
      bookAuthors: book.authors.join(', '),
      bookPublisher: book.publisher,
    }))
    if (errors?.bookId) {
      clearError('bookId')
    }
  }

  /**
   * 선택된 일정 텍스트 생성
   */
  const formattedSchedule = formatScheduleRange(
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime
  )

  return {
    // 모드
    isEditMode,
    // 폼 데이터
    formData,
    // 시간 옵션
    timeOptions,
    // 유효성 검사
    validateForm,
    errors,
    // 날짜/시간 제약
    getStartDateDisabled,
    getEndDateDisabled,
    getEndTimeOptions,
    // 포맷된 일정
    formattedSchedule,
    // Ref
    refs: {
      bookButtonRef,
      startDateRef,
      endDateRef,
      maxParticipantsRef,
    },
    // 상태 업데이트 핸들러
    handlers: {
      setMeetingName: (value: string) => updateField('meetingName', value),
      setBook: handleBookChange,
      setMaxParticipants: (value: string) =>
        updateField('maxParticipants', value, 'maxParticipants'),
      setStartDate: (date: Date | null) => updateField('startDate', date, 'schedule'),
      setStartTime: (time: string) => updateField('startTime', time, 'schedule'),
      setEndDate: (date: Date | null) => updateField('endDate', date, 'schedule'),
      setEndTime: (time: string) => updateField('endTime', time, 'schedule'),
      setLocationAddress: (address: string | null) => updateField('locationAddress', address),
      setLocationName: (name: string | null) => updateField('locationName', name),
      setLatitude: (lat: number | null) => updateField('latitude', lat),
      setLongitude: (lng: number | null) => updateField('longitude', lng),
    },
  }
}
