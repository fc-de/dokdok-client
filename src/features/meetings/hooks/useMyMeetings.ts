import { useInfiniteQuery } from '@tanstack/react-query'

import { getMyMeetings } from '../meetings.api'
import type { MyMeetingFilter, MyMeetingListResponse } from '../meetings.types'
import { myMeetingQueryKeys } from './myMeetingQueryKeys'

const MY_MEETINGS_PAGE_SIZE = 4

export function useMyMeetings(filter: MyMeetingFilter) {
  return useInfiniteQuery({
    queryKey: myMeetingQueryKeys.list(filter),
    queryFn: ({ pageParam }) =>
      getMyMeetings({
        filter,
        startDateTime: pageParam?.startDateTime,
        meetingId: pageParam?.meetingId,
        size: MY_MEETINGS_PAGE_SIZE,
      }),
    initialPageParam: undefined as MyMeetingListResponse['nextCursor'] | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  })
}
