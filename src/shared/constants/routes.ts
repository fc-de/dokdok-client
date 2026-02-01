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
  MEETINGS: '/meetings',
  MEETING_DETAIL: (id: number | string) => `/meetings/${id}`,
  MEETING_CREATE: '/meetings/create',
  MEETING_UPDATE: '/meetings/update',
  MEETING_SETTING: '/meetings/setting',

  // Records
  RECORDS: '/records',
  RECORD_DETAIL: (id: number | string) => `/records/${id}`,
} as const
