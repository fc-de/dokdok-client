/**
 * @file meetings.mock.ts
 * @description Meeting API 목데이터
 */

import type { PaginatedResponse } from '@/api/types'
import type { MeetingApprovalItem } from '@/features/meetings/meetings.types'

/**
 * 약속 승인 리스트 목데이터 (확정 대기)
 */
const mockPendingMeetings: MeetingApprovalItem[] = [
  {
    meetingId: 1,
    meetingName: '1차 독서모임',
    bookName: '클린 코드',
    nickname: '독서왕김민수',
    startDateTime: '2026-02-01T14:00:00',
    endDateTime: '2026-02-01T16:00:00',
    meetingStatus: 'PENDING',
  },
  {
    meetingId: 2,
    meetingName: '2차 독서모임',
    bookName: '리팩터링',
    nickname: '코드리뷰어',
    startDateTime: '2026-02-08T14:00:00',
    endDateTime: '2026-02-08T16:00:00',
    meetingStatus: 'PENDING',
  },
  {
    meetingId: 3,
    meetingName: '3차 독서모임',
    bookName: '오브젝트',
    nickname: '객체지향전문가',
    startDateTime: '2026-02-15T14:00:00',
    endDateTime: '2026-02-15T16:00:00',
    meetingStatus: 'PENDING',
  },
  {
    meetingId: 4,
    meetingName: '4차 독서모임',
    bookName: '테스트 주도 개발',
    nickname: 'TDD실천가',
    startDateTime: '2026-02-22T14:00:00',
    endDateTime: '2026-02-22T16:00:00',
    meetingStatus: 'PENDING',
  },
  {
    meetingId: 5,
    meetingName: '5차 독서모임',
    bookName: '도메인 주도 설계',
    nickname: 'DDD마스터',
    startDateTime: '2026-03-01T14:00:00',
    endDateTime: '2026-03-01T16:00:00',
    meetingStatus: 'PENDING',
  },
]

/**
 * 약속 승인 리스트 목데이터 (확정 완료)
 */
const mockConfirmedMeetings: MeetingApprovalItem[] = [
  {
    meetingId: 11,
    meetingName: '킥오프 모임',
    bookName: '실용주의 프로그래머',
    nickname: '프로그래머박지성',
    startDateTime: '2026-01-11T14:00:00',
    endDateTime: '2026-01-11T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 12,
    meetingName: '정기 모임',
    bookName: '함께 자라기',
    nickname: '성장하는개발자',
    startDateTime: '2026-01-18T14:00:00',
    endDateTime: '2026-01-18T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 13,
    meetingName: '심화 토론',
    bookName: '이펙티브 타입스크립트',
    nickname: '타입스크립트러버',
    startDateTime: '2026-01-25T14:00:00',
    endDateTime: '2026-01-25T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 14,
    meetingName: '독서 토론 모임',
    bookName: '클린 아키텍처',
    nickname: '아키텍트김철수',
    startDateTime: '2026-02-01T14:00:00',
    endDateTime: '2026-02-01T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 15,
    meetingName: '주말 특강',
    bookName: '소프트웨어 장인',
    nickname: '장인정신실천가',
    startDateTime: '2026-02-08T10:00:00',
    endDateTime: '2026-02-08T12:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 16,
    meetingName: '코드 리뷰 세션',
    bookName: '리팩터링 2판',
    nickname: '리팩터링마스터',
    startDateTime: '2026-02-15T14:00:00',
    endDateTime: '2026-02-15T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 17,
    meetingName: '알고리즘 스터디',
    bookName: '알고리즘 문제 해결 전략',
    nickname: '알고리즘천재',
    startDateTime: '2026-02-22T14:00:00',
    endDateTime: '2026-02-22T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 18,
    meetingName: '디자인 패턴 스터디',
    bookName: 'GoF의 디자인 패턴',
    nickname: '패턴연구가',
    startDateTime: '2026-03-01T14:00:00',
    endDateTime: '2026-03-01T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 19,
    meetingName: 'TDD 실습',
    bookName: '테스트 주도 개발',
    nickname: 'TDD전도사',
    startDateTime: '2026-03-08T14:00:00',
    endDateTime: '2026-03-08T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 20,
    meetingName: '함수형 프로그래밍',
    bookName: '함수형 자바스크립트',
    nickname: 'FP러버',
    startDateTime: '2026-03-15T14:00:00',
    endDateTime: '2026-03-15T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 21,
    meetingName: 'DevOps 세미나',
    bookName: 'DevOps 핸드북',
    nickname: 'DevOps엔지니어',
    startDateTime: '2026-03-22T14:00:00',
    endDateTime: '2026-03-22T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
  {
    meetingId: 22,
    meetingName: '마이크로서비스 아키텍처',
    bookName: '마이크로서비스 패턴',
    nickname: 'MSA전문가',
    startDateTime: '2026-03-29T14:00:00',
    endDateTime: '2026-03-29T16:00:00',
    meetingStatus: 'CONFIRMED',
  },
]

/**
 * 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 목데이터를 페이지네이션 형태로 반환합니다.
 */
export const getMockMeetingApprovals = (
  status: 'PENDING' | 'CONFIRMED',
  page: number = 0,
  size: number = 10
): PaginatedResponse<MeetingApprovalItem> => {
  const mockData = status === 'PENDING' ? mockPendingMeetings : mockConfirmedMeetings

  // 페이지네이션 처리
  const start = page * size
  const end = start + size
  const items = mockData.slice(start, end)

  return {
    items,
    totalCount: mockData.length,
    currentPage: page,
    pageSize: size,
    totalPages: Math.ceil(mockData.length / size),
  }
}
