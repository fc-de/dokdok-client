import { useInfiniteQuery } from '@tanstack/react-query'

import { PAGE_SIZES } from '@/shared/constants'

import { getMyMeetings } from '../meetings.api'
import type { MyMeetingFilter, MyMeetingListResponse } from '../meetings.types'
import { myMeetingQueryKeys } from './myMeetingQueryKeys'

export function useMyMeetings(filter: MyMeetingFilter) {
  return useInfiniteQuery({
    queryKey: myMeetingQueryKeys.list(filter),
    queryFn: ({ pageParam }) =>
      getMyMeetings({
        filter,
        startDateTime: pageParam?.startDateTime,
        meetingId: pageParam?.meetingId,
        size: PAGE_SIZES.MY_MEETINGS,
      }),
    initialPageParam: undefined as MyMeetingListResponse['nextCursor'] | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  })
}
