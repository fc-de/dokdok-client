export const ROUTES = {
  // Auth
  LOGIN: '/login',
  ONBOARDING: '/onboarding',

  HOME: '/',
  HOME_ALIAS: '/home',

  // Books
  BOOKS: '/books',
  BOOK_DETAIL: (id: number | string) => `/books/${id}`,
  BOOK_SEARCH: '/books/search',

  // Gatherings
  GATHERINGS: '/gatherings',
  GATHERING_DETAIL: (id: number | string) => `/gatherings/${id}`,
  GATHERING_CREATE: '/gatherings/create',

  // Invite
  INVITE_BASE: '/invite',
  INVITE: (invitationCode: string) => `/invite/${invitationCode}`,

  // Meetings
  MEETING_DETAIL: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}`,
  MEETING_CREATE: (gatheringId: number | string) => `/gatherings/${gatheringId}/meetings/create`,
  MEETING_UPDATE: (gatheringId: number | string, meetingId: number | string) =>
    `/gatherings/${gatheringId}/meetings/${meetingId}/update`,
  MEETING_SETTING: (gatheringId: number | string) => `/gatherings/${gatheringId}/meetings/setting`,

  // Records
  RECORDS: '/records',
  RECORD_DETAIL: (id: number | string) => `/records/${id}`,
} as const
