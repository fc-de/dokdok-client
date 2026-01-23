export const ROUTES = {
  // Auth
  LOGIN: '/login',
  ONBOARDING: '/onboarding',

  // Books
  BOOKS: '/books',
  BOOK_DETAIL: (id: number | string) => `/books/${id}`,
  BOOK_SEARCH: '/books/search',

  // Gatherings
  GATHERINGS: '/gatherings',
  GATHERING_DETAIL: (id: number | string) => `/gatherings/${id}`,
  GATHERING_CREATE: '/gatherings/create',

  // Meetings
  MEETINGS: '/meetings',
  MEETING_DETAIL: (id: number | string) => `/meetings/${id}`,

  // Records
  RECORDS: '/records',
  RECORD_DETAIL: (id: number | string) => `/records/${id}`,
} as const
