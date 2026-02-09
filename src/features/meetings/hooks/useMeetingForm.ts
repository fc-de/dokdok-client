import { useMemo, useRef, useState } from 'react'

import { type SearchBookItem } from '@/features/book'
import {
  combineDateAndTime,
  formatScheduleRange,
  generateTimeOptions,
  isStartBeforeEnd,
} from '@/features/meetings'

type UseMeetingFormParams = {
  gatheringMaxCount: number
}

type ValidationErrors = {
  bookId?: string | null
  schedule?: string | null
  maxParticipants?: string | null
  location?: string | null
}

export const useMeetingForm = ({ gatheringMaxCount }: UseMeetingFormParams) => {
  // 폼 상태
  const [locationName, setLocationName] = useState<string | null>(null)
  const [locationAddress, setLocationAddress] = useState<string | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [meetingName, setMeetingName] = useState<string | null>(null)
  const [bookId, setBookId] = useState<string | null>(null)
  const [bookName, setBookName] = useState<string | null>(null)
  const [bookThumbnail, setBookThumbnail] = useState<string | null>(null)
  const [bookAuthors, setBookAuthors] = useState<string | null>(null)

  const [maxParticipants, setMaxParticipants] = useState<string | null>(null)

  // 날짜/시간 상태
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<string | null>(null)

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState<ValidationErrors | null>(null)

  // 각 필드의 ref (포커스 이동용)
  const bookButtonRef = useRef<HTMLButtonElement>(null)
  const startDateRef = useRef<HTMLButtonElement>(null)
  const endDateRef = useRef<HTMLButtonElement>(null)
  const maxParticipantsRef = useRef<HTMLInputElement>(null)

  // 시간 옵션 메모이제이션 (렌더링마다 재생성 방지)
  const timeOptions = useMemo(() => generateTimeOptions(), [])

  const validateForm = (): boolean => {
    const newError: ValidationErrors = {}

    if (!bookId || !bookName || !bookThumbnail || !bookAuthors) {
      newError.bookId = '* 도서를 선택해주세요.'
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      newError.schedule = '* 일정을 선택해주세요.'
    } else {
      // 시작/종료 일시 비교 (둘 다 있을 때만)
      const startDateTime = combineDateAndTime(startDate, startTime)
      const endDateTime = combineDateAndTime(endDate, endTime)

      if (!isStartBeforeEnd(startDateTime, endDateTime)) {
        newError.schedule = '* 종료 일정은 시작 일정보다 늦어야 합니다.'
      }
    }

    if (maxParticipants) {
      const participants = Number(maxParticipants)
      if (isNaN(participants) || participants < 1 || participants > gatheringMaxCount) {
        newError.maxParticipants = `현재 모임의 전체 멤버 수는 ${gatheringMaxCount}명이에요. 최대 ${gatheringMaxCount}명까지 참가 가능해요.`
      }
    }

    // 장소 검증: 4개 필드가 모두 있거나 모두 없어야 함
    const locationFields = [
      locationName !== null,
      locationAddress !== null,
      latitude !== null,
      longitude !== null,
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
   * 에러 설정/제거 내부 함수
   */
  const setError = (field: keyof ValidationErrors, message: string | null) => {
    setErrors((prev) => {
      if (!prev) return message ? { [field]: message } : null
      const updated = { ...prev, [field]: message }
      return updated
    })
  }

  /**
   * 에러 초기화 (특정 필드 또는 전체)
   * @param field - 초기화할 필드 (undefined면 전체 초기화)
   */
  const clearError = (field?: keyof ValidationErrors) => {
    if (field === undefined) {
      // 전체 에러 초기화
      setErrors(null)
    } else {
      // 특정 필드 에러 초기화
      setError(field, null)
    }
  }

  /**
   * 종료 날짜 비활성화 조건
   * 시작 날짜보다 이전 날짜는 선택 불가
   */
  const getEndDateDisabled = () => {
    if (!startDate || !startTime) return undefined
    return { before: startDate }
  }

  /**
   * 종료 시간 옵션 필터링
   * 같은 날짜인 경우 시작 시간 이후만 선택 가능
   */
  const getEndTimeOptions = () => {
    if (!startDate || !endDate || !startTime) return timeOptions

    // 같은 날짜인 경우
    if (startDate.toDateString() === endDate.toDateString()) {
      return timeOptions.filter((option) => option.value > startTime)
    }

    return timeOptions
  }

  /**
   * 시작 날짜 비활성화 조건
   * 오늘은 불가, 내일부터 선택 가능
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
  const handleBookChange = (
    book: Pick<SearchBookItem, 'isbn' | 'title' | 'thumbnail' | 'authors'>
  ) => {
    setBookId(book.isbn)
    setBookName(book.title)
    setBookThumbnail(book.thumbnail)
    setBookAuthors(book.authors.join(', '))
    if (errors?.bookId) {
      clearError('bookId')
    }
  }

  /**
   * 시작 날짜 변경 (에러 초기화 포함)
   */
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)
    if (errors?.schedule) {
      clearError('schedule')
    }
  }

  /**
   * 시작 시간 변경 (에러 초기화 포함)
   */
  const handleStartTimeChange = (time: string) => {
    setStartTime(time)
    if (errors?.schedule) {
      clearError('schedule')
    }
  }

  /**
   * 종료 날짜 변경 (에러 초기화 포함)
   */
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)
    if (errors?.schedule) {
      clearError('schedule')
    }
  }

  /**
   * 종료 시간 변경 (에러 초기화 포함)
   */
  const handleEndTimeChange = (time: string) => {
    setEndTime(time)
    if (errors?.schedule) {
      clearError('schedule')
    }
  }

  /**
   * 참가 인원 변경 (에러 초기화 포함)
   */
  const handleMaxParticipantsChange = (value: string) => {
    setMaxParticipants(value)
    if (errors?.maxParticipants) {
      clearError('maxParticipants')
    }
  }

  /**
   * 선택된 일정 텍스트 생성
   * 시작/종료 날짜와 시간이 모두 선택된 경우 포맷된 문자열 반환
   */
  const formattedSchedule = formatScheduleRange(startDate, startTime, endDate, endTime)

  return {
    // 폼 데이터
    formData: {
      meetingName,
      bookId,
      bookName,
      bookThumbnail,
      bookAuthors,
      locationName,
      locationAddress,
      latitude,
      longitude,
      maxParticipants,
      startDate,
      startTime,
      endDate,
      endTime,
    },
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
      setMeetingName,
      setBookId,
      setBookName,
      setBookThumbnail,
      setBookAuthors,
      setBook: handleBookChange,
      setMaxParticipants: handleMaxParticipantsChange,
      setStartDate: handleStartDateChange,
      setStartTime: handleStartTimeChange,
      setEndDate: handleEndDateChange,
      setEndTime: handleEndTimeChange,
      setLocationAddress,
      setLocationName,
      setLatitude,
      setLongitude,
    },
  }
}
