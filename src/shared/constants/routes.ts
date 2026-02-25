export const ROUTES = {
  // Auth
  LOGIN: '/login',
  ONBOARDING: '/onboarding',

  HOME: '/',
  HOME_ALIAS: '/home',

  LANDING: '/landing',

  // Books
  BOOKS: '/books',
  BOOK_DETAIL: (id: number | string) => `/books/${id}`,
  BOOK_REVIEW_HISTORY: (id: number | string) => `/books/${id}/reviews`,
  BOOK_SEARCH: '/books/search',

  // Gatherings
  GATHERINGS: '/gatherings',
  GATHERING_DETAIL: (id: number | string) => `/gatherings/${id}`,
  GATHERING_CREATE: '/gatherings/create',
  GATHERING_SETTING: (id: number | string) => `/gatherings/${id}/settings`,

  // Invite
  INVITE_BASE: '/invite',
  INVITE: (invitationCode: string) => `/invite/${invitationCode}`,

  // Pre-opinions
  PRE_OPINION_WRITE: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/pre-opinions/new`,

  // Meetings
  MEETING_DETAIL: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}`,
  MEETING_CREATE: (gatheringId: number | string) => `/gatherings/${gatheringId}/meetings/create`,
  MEETING_UPDATE: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/update`,
  MEETING_SETTING: (gatheringId: number | string) => `/gatherings/${gatheringId}/meetings/setting`,
  PRE_OPINIONS: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/pre-opinions`,

  // Topics
  TOPICS_CREATE: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/topic-create`,

  // Retrospectives (약속 회고)
  MEETING_RETROSPECTIVE: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/retrospective`,
  MEETING_RETROSPECTIVE_CREATE: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/retrospective/create`,
  MEETING_RETROSPECTIVE_DETAIL: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/retrospective/detail`,

  // Retrospectives (개인 회고)
  PERSONAL_RETROSPECTIVE: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/retrospective/personal`,
  PERSONAL_RETROSPECTIVE_VIEW: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/retrospective/personal/view`,

  // Records
  RECORDS: '/records',
  RECORD_DETAIL: (id: number | string) => `/records/${id}`,
} as const
